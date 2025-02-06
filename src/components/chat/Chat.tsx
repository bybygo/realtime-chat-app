import React, { Fragment, useEffect, useState } from 'react';

import axios from 'axios';
import Pusher from 'pusher-js';

import ChatMessage from '@/components/chat/ChatMessage';
import { Message } from '@/models/chat';

const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

const Chat = (props: { activeUser: string }) => {
  const [chats, setChats] = useState<Message[]>([]);

  useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_APP_KEY!, {
      cluster: process.env.PUSHER_APP_CLUSTER!,
      forceTLS: true,
    });

    const channel = pusher.subscribe('chat-room');
    channel.bind('new-message', ({ chat = null }) => {
      if (chat) {
        setChats((prevChats) => [...prevChats, chat]);
      }
    });

    pusher.connection.bind('connected', () => {
      axios.post('/messages').then((response) => {
        const chats = response.data.messages;
        setChats(chats);
      });
    });

    return () => {
      pusher.disconnect();
    };
  }, []);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    if (event.key === 'Enter' && !event.shiftKey) {
      const { activeUser: user } = props;
      const chat = { user, message: value, timestamp: +new Date() };

      event.currentTarget.value = '';
      axios.post('/message', chat);
    }
  };

  return (
    props.activeUser && (
      <Fragment>
        <div
          className="border-bottom border-gray w-100 d-flex align-items-center bg-white"
          style={{ height: 90 }}
        >
          <h2 className="text-dark mx-4 mb-0 px-2">{props.activeUser}</h2>
        </div>

        <div
          className="w-100 d-flex align-items-start align-content-start position-relative flex-row flex-wrap px-4 pb-4"
          style={{ height: 'calc(100% - 180px)', overflowY: 'scroll' }}
        >
          {chats.map((chat: Message, index) => {
            const previous = Math.max(0, index - 1);
            const previousChat = chats[previous];
            const position = chat.user === props.activeUser ? 'right' : 'left';

            const isFirst = previous === index;
            const inSequence = chat.user === previousChat.user;
            const hasDelay = Math.ceil((chat.timestamp - previousChat.timestamp) / (1000 * 60)) > 1;

            const mood =
              chat.sentiment > 0 ? HAPPY_EMOJI : chat.sentiment === 0 ? NEUTRAL_EMOJI : SAD_EMOJI;

            return (
              <Fragment key={index}>
                {(isFirst || !inSequence || hasDelay) && (
                  <div
                    className={`d-block w-100 font-weight-bold text-dark mt-4 px-1 pb-1 text-${position}`}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span className="d-block" style={{ fontSize: '1.6rem' }}>
                      {String.fromCodePoint(...mood)}
                    </span>
                    <span>{chat.user || 'Anonymous'}</span>
                  </div>
                )}

                <ChatMessage message={chat.message} position={position} />
              </Fragment>
            );
          })}
        </div>

        <div
          className="border-top border-gray w-100 d-flex align-items-center bg-light px-4"
          style={{ minHeight: 90 }}
        >
          <textarea
            className="form-control px-3 py-2"
            onKeyUp={handleKeyUp}
            placeholder="Enter a chat message"
            style={{ resize: 'none' }}
          ></textarea>
        </div>
      </Fragment>
    )
  );
};

export default Chat;
