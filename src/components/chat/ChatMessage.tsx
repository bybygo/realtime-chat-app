const ChatMessage = (props: { position: string; message: string }) => {
  const { position = 'left', message } = props;
  const isRight = position.toLowerCase() === 'right';
  const align = isRight ? 'text-right' : 'text-left';
  const justify = isRight ? 'justify-content-end' : 'justify-content-start';

  const messageBoxStyles = {
    maxWidth: '70%',
    flexGrow: 0,
  };

  const messageStyles = {
    fontWeight: 500,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
  };

  return (
    <div className={`w-100 d-flex my-1 ${justify}`}>
      <div className="bg-light border-gray rounded border p-2" style={messageBoxStyles}>
        <span className={`d-block text-secondary ${align}`} style={messageStyles}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
