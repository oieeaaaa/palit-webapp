import {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import CHATROOM from 'js/models/chatRooms';
import useProtection from 'js/hooks/useProtection';
import AuthContext from 'js/contexts/auth';
import useForm from 'js/hooks/useForm';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';

const Chat = () => {
  // contexts
  const { user } = useContext(AuthContext);

  // states
  const [isSending, setIsSending] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState(null);

  // refs
  const messageAnchor = useRef(null);

  // custom hooks
  const { form, inputController, clearForm } = useForm({ message: '' });
  const router = useRouter();

  /**
   * initChatRooms.
   */
  const initChatRooms = async () => {
    try {
      const rawChatRooms = await CHATROOM.getAllUserChatRooms(user.key);
      const chatRooms = normalizeData(rawChatRooms);

      setRooms(chatRooms);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * openChatRoom.
   *
   * @param {string} memberID
   */
  const openChatRoom = async (memberID) => {
    try {
      const chatRoom = await CHATROOM.openChatRoom(user.key, memberID);

      setActiveRoom(chatRoom);

      if (memberID !== router.query?.member) {
        router.push(`/chat?member=${memberID}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * sendMessage.
   *
   * @param {object} e
   */
  const sendMessage = async (e) => {
    e.persist();

    if (!(e.type === 'keypress' && !e.shiftKey && e.key === 'Enter')) return;

    setIsSending(true);

    try {
      const payload = ({
        content: form.message,
        user,
      });

      await CHATROOM.addMessage(activeRoom.key, payload);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
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
   * useEffect.
   */
  useEffect(() => {
    const activeRoomKey = activeRoom?.key;

    // stop this effect
    if (!activeRoomKey) return () => {};

    // listener
    const unsubscribe = CHATROOM.messagesListener(activeRoomKey, (snapshot) => {
      const newMessages = normalizeData(snapshot);
      const isEmpty = !newMessages.length;

      // stop if empty
      if (isEmpty) return;

      // proceed if not
      setMessages(newMessages);

      // show the new message
      messageAnchor.current.scrollIntoView({ behavior: 'smooth' });
    });

    return unsubscribe;
  }, [activeRoom?.key]);

  /**
   * useEffect. initializer.
   */
  useEffect(() => {
    const memberID = router.query?.member;

    initChatRooms();

    if (memberID) {
      openChatRoom(memberID);
    }
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
                  className={`chat__user ${room.key === activeRoom?.key ? '--active' : ''}`}
                  key={room.userID}
                >
                  <button className="chat__user-button" type="button" onClick={() => openChatRoom(room.userID)}>
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
                    {!isSender && (
                      <h3 className="chat-message__user">{sender.firstName}</h3>
                    )}
                    <p className="chat-message__content">
                      {content}
                    </p>
                  </li>
                );
              })}
              <li ref={messageAnchor} className="chat-messages__anchor" />
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Chat);
