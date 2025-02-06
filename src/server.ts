import next from 'next';

import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import Pusher from 'pusher';
import Sentiment from 'sentiment';

import { ChatHistory, Message } from '@/models/chat';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

const sentiment = new Sentiment();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_APP_CLUSTER!,
  useTLS: true,
});

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    const chatHistory: ChatHistory = { messages: [] };

    server.post('/message', (req) => {
      const { user = null, message = '', timestamp = +new Date() } = req.body;
      const sentimentScore = sentiment.analyze(message).score;
      // const chat = { user, message, timestamp, sentiment: sentimentScore };
      const chat: Message = { user, message, timestamp, sentiment: sentimentScore };

      chatHistory.messages.push(chat);
      pusher.trigger('chat-room', 'new-message', { chat });
    });

    server.post('/messages', (req, res) => {
      res.json({ ...chatHistory, status: 'success' });
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
