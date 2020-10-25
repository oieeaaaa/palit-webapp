import {
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import { ReactSVG } from 'react-svg';
import { format } from 'timeago.js';
import { useRouter } from 'next/router';
import CHATROOM from 'js/models/chatRooms';
import AuthContext from 'js/contexts/auth';
import LayoutContext from 'js/contexts/layout';
import useProtection from 'js/hooks/useProtection';
import useForm from 'js/hooks/useForm';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';

const Chat = () => {
  // contexts
  const { user } = useContext(AuthContext);
  const { handlers } = useContext(LayoutContext);

  // states
  const [isSending, setIsSending] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState(null);

  // refs
  const messageAnchor = useRef(null);
  const messageBox = useRef(null);

  // custom hooks
  const {
    form,
    setForm,
    validateForm,
  } = useForm({ message: '' });
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

      if (memberID !== router.query?.member) {
        router.push(`/chat?member=${memberID}`);
      }

      setActiveRoom(chatRoom);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * handleMessage.
   *
   * @param {object} e
   */
  const handleMessage = (e) => {
    e.persist();
    let value = e.target.innerHTML;

    if (value && value === '<br>') {
      value = '';
    }

    setForm((prevForm) => ({
      ...prevForm,
      message: value,
    }));
  };

  /**
   * sendMessage.
   *
   * @param {object} e
   */
  const sendMessage = async (e) => {
    if (e.type !== 'click') {
      if (!(!e.shiftKey && e.key === 'Enter')) return;
    }

    const isFormValid = validateForm({
      message: { complete: true },
    });

    if (!isFormValid) return;

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
   * copyToClipboard.
   */
  const copyToClipboard = () => {
    if (!messageBox?.current || !form.message) return;

    const messageBoxEl = messageBox.current;
    const range = document.createRange();

    // 1. cleanup
    messageBoxEl.focus();
    window.getSelection().removeAllRanges();

    // 2. create a selection
    range.setStartBefore(messageBoxEl.firstChild);
    range.setEndAfter(messageBoxEl.lastChild);
    window.getSelection().addRange(range);

    /* 3. Copy the text inside the text field */
    document.execCommand('copy');

    // 4. deselect, so the browser doesn't leave the element visibly selected
    window.getSelection().removeAllRanges();

    // 5. Let the user know the text is copied
    handlers.showBanner({
      text: 'Copied text ✨',
      variant: 'info',
    });
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    const isMessageBoxClear = isSending && messageBox?.current;

    if (isMessageBoxClear) {
      messageBox.current.innerHTML = '';
    }
  }, [isSending, messageBox]);

  /**
   * useEffect.
   */
  useEffect(() => {
    const activeRoomKey = activeRoom?.key;

    // stop this effect
    if (!activeRoomKey || !rooms) return () => {};

    // find if the room exists
    const isChatRoomExists = rooms?.some((room) => room.key === activeRoom.key);

    // add new room
    if (!isChatRoomExists) {
      setRooms((prevRooms) => prevRooms.concat(activeRoom));
    }

    // listener
    const unsubscribe = CHATROOM.messagesListener(activeRoomKey, (snapshot) => {
      const newMessages = normalizeData(snapshot);
      const isEmpty = !newMessages.length;

      // clear messages
      if (isEmpty) {
        setMessages(null);
        return;
      }

      // display messages with a fancy auto-scroll
      setMessages(newMessages);
      messageAnchor.current.scrollIntoView({ behavior: 'smooth' });
    });

    return unsubscribe;
  }, [activeRoom?.key, rooms]);

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
          {/* HEADER */}
          <div className="chat-header">
            <h1 className="chat-header__title">
              {`${activeRoom?.firstName || 'Anonymous'} ${activeRoom?.lastName || ''}`}
            </h1>
            <button className="chat-header__settings" type="button">
              <ReactSVG
                className="chat-header__settings-icon"
                src="/icons/settings-outline.svg"
              />
            </button>
          </div>

          {/* BODY */}
          <div className="chat-body">
            {/* MESSAGES */}
            <ul className="chat-messages">
              {messages && (
                messages.map((message) => {
                  const isSender = message.sender.key === user.key;

                  return (
                    <li
                      className={`chat-message ${isSender ? '--sender' : ''}`}
                      key={message.key}
                    >
                      <figure className="chat-message__avatar">
                        <img src={message.sender?.avatar} alt="Palit" />
                      </figure>
                      <div className="chat-message__info">
                        {!isSender && (
                          <p className="chat-message__info-name">
                            {`${message.sender?.firstName || 'Anonymous'} ${message.sender?.lastName || ''}`}
                          </p>
                        )}
                        <div
                          className="chat-message__info-text"
                          dangerouslySetInnerHTML={{__html: message.content}} // eslint-disable-line
                        />
                        <p className="chat-message__info-time">{format(message?.timestamp?.toMillis())}</p>
                      </div>
                    </li>
                  );
                })
              )}
              <li ref={messageAnchor} />
            </ul>

            {/* CHAT FORM */}
            <div className="chat-form">
              <button className="chat-form__util" type="button" onClick={copyToClipboard}>
                <ReactSVG
                  className="chat-form__util-icon"
                  src="/icons/copy-outline.svg"
                />
              </button>
              <div className="chat-form-container">
                <div className="chat-form__input-group">
                  <div
                    ref={messageBox}
                    contentEditable
                    className="chat-form__input"
                    type="text"
                    name="message"
                    onInput={handleMessage}
                    onKeyPress={sendMessage}
                    role="textbox"
                    aria-label="Editor"
                    tabIndex={0}
                  />
                  {!form.message && (
                    <p className="chat-form__input-placeholder">
                      Type something here...
                    </p>
                  )}
                </div>
                <button
                  className={`chat-form__button button ${isSending ? '--disabled' : '--primary'}`}
                  type="button"
                  onClick={sendMessage}
                  disabled={isSending}
                >
                  <ReactSVG
                    className="chat-form__util-icon"
                    src="/icons/send-outline.svg"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* CHAT ROOMS */}
          <ul className="chat-rooms">
            {rooms && (
              rooms.map((room) => (
                <li
                  className={`chat-room ${activeRoom?.key === room.key ? '--active' : ''}`}
                  key={room.key}
                >
                  <button
                    className="chat-room__button"
                    type="button"
                    onClick={() => openChatRoom(room.userID)}
                  >
                    <img src={room.avatar} alt={room.name} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Chat);
