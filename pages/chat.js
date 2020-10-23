import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import CHATROOM from 'js/models/chatRooms';
import useProtection from 'js/hooks/useProtection';
import AuthContext from 'js/contexts/auth';
import useForm from 'js/hooks/useForm';
import Layout from 'components/layout/layout';

const Chat = () => {
  // contexts
  const { user } = useContext(AuthContext);

  // states
  const [isSending, setIsSending] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [messages, setMessages] = useState(null);

  // custom hooks
  const { form, inputController, clearForm } = useForm({ message: '' });
  const router = useRouter();

  /**
   * initChatRoom.
   */
  const initChatRoom = async () => {
    try {
      const chatRooms = await CHATROOM.openChatRoom(user.key, router.query?.owner);

      setRooms(chatRooms);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * sendMessage.
   *
   * @param {object} e
   */
  const sendMessage = (e) => {
    e.persist();

    if (!(e.type === 'keypress' && !e.shiftKey && e.key === 'Enter')) return;

    setIsSending(true);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.concat({
        key: prevMessages.length + 1,
        sender: {
          key: user.key,
          name: 'Joimee',
        },
        content: form.message,
      }));

      setIsSending(false);
    }, 1000);
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    if (isSending) {
      clearForm();
    }
  }, [isSending]);

  /**
   * useEffect. initializer.
   */
  useEffect(() => {
    initChatRoom();
  }, []);

  return (
    <Layout title="Palit | Chat">
      <div className="chat">
        <div className="grid">
          <div className="chat-users">
            <h2 className="chat__heading">
              Users
            </h2>
            <ul className="chat-users__list hide-scrollbar">
              {rooms && rooms.map((room) => (
                <li
                  className={`chat__user ${room.isActive ? '--active' : ''}`}
                  key={room.userID}
                >
                  <button className="chat__user-button" type="button">
                    <img src={room.avatar} alt={room.name} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-room">
            <h2 className="chat__heading">
              Chat Room
            </h2>
            <ul className="chat-messages">
              {messages && messages.map(({ key, sender, content }) => {
                const isSender = sender.key === user.key;

                return (
                  <li
                    className={`chat-message ${isSender ? '--sender' : '--receiver'}`}
                    key={key}
                  >
                    <h3 className="chat-message__user">{isSender ? 'You' : sender.name}</h3>
                    <p className="chat-message__content">
                      {content}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="chat-write">
            <h2 className="chat__heading">
              Message
            </h2>
            <textarea
              name="message"
              className="form__input --textarea"
              onChange={inputController}
              onKeyPress={sendMessage}
              value={form.message}
            />
            <button
              className={`button --primary ${isSending ? '--disabled' : ''}`}
              type="submit"
              onClick={sendMessage}
              disabled={isSending}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Chat);
