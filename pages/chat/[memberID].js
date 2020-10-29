import {
  useEffect,
  useContext,
  useRef,
} from 'react';
import { ReactSVG } from 'react-svg';
import { format } from 'timeago.js';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CHATROOM from 'js/models/chatRooms';
import AuthContext from 'js/contexts/auth';
import LayoutContext from 'js/contexts/layout';
import useProtection from 'js/hooks/useProtection';
import useForm from 'js/hooks/useForm';
import useChatRoomReducer, {
  CHANGE_IS_SENDING,
  UPDATE_ROOMS,
  UPDATE_MESSAGES,
  UPDATE_ACTIVE_ROOM,
  UPDATE_SETTINGS,
  ADD_NEW_ROOM,
} from 'js/reducers/chatRoom';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';

// TODO: Limit the number of message displayed
const ChatRoom = () => {
  // contexts
  const { user } = useContext(AuthContext);
  const { handlers } = useContext(LayoutContext);

  // states
  const [state, dispatch] = useChatRoomReducer();

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
   * openChatRoom.
   *
   * @param {string} memberID
   */
  const openChatRoom = async (memberID) => {
    try {
      const chatRoom = await CHATROOM.openChatRoom(user.key, memberID);

      if (memberID !== router.query?.member) {
        router.push(`/chat/${memberID}`);
      }

      dispatch({
        type: UPDATE_ACTIVE_ROOM,
        activeRoom: chatRoom,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getUserChatSettings.
   */
  const getUserChatSettings = async () => {
    try {
      const rawUserChatRoomSettings = await CHATROOM.getOneUserChatRoom(user.key);

      dispatch({
        type: UPDATE_SETTINGS,
        settings: normalizeData(rawUserChatRoomSettings),
      });
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
      messageBox.current.innerHTML = '';
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

    dispatch({
      type: CHANGE_IS_SENDING,
      isSending: true,
    });

    try {
      const payload = ({
        content: form.message,
        user,
      });

      await CHATROOM.addMessage(
        user.key,
        state.activeRoom.userID,
        state.activeRoom.key,
        payload,
      );
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({
        type: CHANGE_IS_SENDING,
        isSending: false,
      });
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
    if (!state.isSending) return;

    const isMessageBoxOkayToClear = state.isSending && messageBox?.current;

    if (isMessageBoxOkayToClear) {
      // Need to make this async
      // Not sure why or how contentEditable do this
      setTimeout(() => {
        messageBox.current.innerHTML = '';
        setForm({ message: '' });
      }, 0);
    }
  }, [state.isSending]);

  /**
   * useEffect.
   */
  useEffect(() => {
    const activeRoomKey = state.activeRoom?.key;

    // stop this effect
    if (!activeRoomKey || !state.rooms) return () => {};

    // check if the room exists
    const isChatRoomExists = state.rooms?.some((room) => room.key === state.activeRoom.key);

    // add new room
    if (!isChatRoomExists) {
      dispatch({
        type: ADD_NEW_ROOM,
        newRoom: state.activeRoom,
      });
    }

    // listener
    const unsubscribe = CHATROOM.messagesListener(activeRoomKey, (snapshot) => {
      const messages = normalizeData(snapshot);

      // The message is seen
      CHATROOM.readChatRoomMessage(user.key, activeRoomKey);

      // display messages with a fancy auto-scroll
      dispatch({
        type: UPDATE_MESSAGES,
        messages,
      });
      messageAnchor.current.scrollIntoView({ behavior: 'smooth' });
    });

    return unsubscribe;
  }, [state.activeRoom?.key, state.rooms]);

  /**
   * useEffect. initializer.
   */
  useEffect(() => {
    const memberID = router.query?.memberID;

    const unsubscribe = CHATROOM.userChatRoomsListener(user.key, (snapshot) => {
      const rooms = normalizeData(snapshot);

      dispatch({
        type: UPDATE_ROOMS,
        rooms,
      });
    });

    if (memberID) {
      openChatRoom(memberID);
    }

    // settings
    getUserChatSettings();

    return unsubscribe;
  }, []);

  // TODO: Break this markup into independent components like what we did in items/[itemID].js
  return (
    <Layout title="Palit | Chat">
      <div className="chat-room">
        <div className="grid">
          {/* HEADER */}
          <div className="chat-room-header">
            <h1 className="chat-room-header__title">
              {state.activeRoom && (
                `${state.activeRoom.firstName} ${state.activeRoom.lastName}`
              )}
            </h1>
            <Link href="/chat/settings" as="/chat/settings">
              <a className="chat-room-header__settings" type="button">
                <ReactSVG
                  className="chat-room-header__settings-icon"
                  src="/icons/settings-outline.svg"
                />
              </a>
            </Link>
          </div>

          {/* BODY */}
          <div className="chat-room-body">
            {/* MESSAGES */}
            <ul className="chat-room-messages">
              {state.messages && (
                state.messages.map((message) => {
                  const isSender = message.sender.key === user.key;

                  return (
                    <li
                      className={`chat-room-message ${isSender ? '--sender' : ''}`}
                      key={message.key}
                    >
                      <figure className="chat-room-message__avatar">
                        <img src={message.sender?.avatar} alt="Palit" />
                      </figure>
                      <div className="chat-room-message__info">
                        {!isSender && (
                          <p className="chat-room-message__info-name">
                            {`${message.sender?.firstName} ${message.sender?.lastName}`}
                          </p>
                        )}
                        <div
                          className="chat-room-message__info-text"
                          dangerouslySetInnerHTML={{__html: message.content}} // eslint-disable-line
                        />
                        <p className="chat-room-message__info-time">{format(message?.timestamp?.toMillis())}</p>
                      </div>
                    </li>
                  );
                })
              )}
              <li ref={messageAnchor} />
            </ul>

            {/* CHAT FORM */}
            <div className="chat-room-form">
              <button className="chat-room-form__util" type="button" onClick={copyToClipboard}>
                <ReactSVG
                  className="chat-room-form__util-icon"
                  src="/icons/copy-outline.svg"
                />
              </button>
              <div className="chat-room-form-container">
                <div className="chat-room-form__input-group">
                  <div
                    ref={messageBox}
                    contentEditable
                    className="chat-room-form__input"
                    onInput={handleMessage}
                    onKeyPress={sendMessage}
                    role="textbox"
                    aria-label="Editor"
                    tabIndex={0}
                  />
                  {!form.message && (
                    <p className="chat-room-form__input-placeholder">
                      Type something here...
                    </p>
                  )}
                </div>
                <button
                  className={`chat-room-form__button button ${state.isSending ? '--disabled' : ''}`}
                  type="button"
                  onClick={sendMessage}
                  disabled={state.isSending}
                >
                  <ReactSVG
                    className="chat-room-form__util-icon"
                    src="/icons/send-outline.svg"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* CHAT HEADS */}
          <ul className="chat-room-heads">
            {state.rooms && (
              state.rooms.map((room) => (
                <li
                  className={`chat-room-head ${state.activeRoom?.key === room.key ? '--active' : ''}`}
                  key={room.key}
                >
                  <div className="chat-room-head__group">
                    {room.isUnread && (
                      <span className="chat-room-head__indicator" />
                    )}
                    <button
                      className="chat-room-head__button"
                      type="button"
                      onClick={() => openChatRoom(room.userID)}
                    >
                      <img src={room.avatar} alt={room.name} />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <style jsx>
          {`
            .chat-room {
              --theme: #${state.settings?.theme || 'fa9917'};
            }
          `}
        </style>
      </div>
    </Layout>
  );
};

export default useProtection(ChatRoom);
