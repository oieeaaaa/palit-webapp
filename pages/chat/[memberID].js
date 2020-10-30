import {
  useEffect,
  useContext,
  useRef,
} from 'react';
import { useRouter } from 'next/router';

// models
import CHATROOM from 'js/models/chatRooms';

// contexts
import AuthContext from 'js/contexts/auth';

// hooks
import useProtection from 'js/hooks/useProtection';
import useError from 'js/hooks/useError';
import useForm from 'js/hooks/useForm';
import useCopyToClibpard from 'js/hooks/useCopyToClipboard';

// reducers
import useChatRoomReducer, {
  CHANGE_IS_SENDING,
  UPDATE_ROOMS,
  UPDATE_MESSAGES,
  UPDATE_ACTIVE_ROOM,
  UPDATE_SETTINGS,
  ADD_NEW_ROOM,
} from 'js/reducers/chatRoom';

// utils
import { normalizeData } from 'js/utils';

// components
import Layout from 'components/layout/layout';
import {
  ChatRoomHeader,
  ChatRoomMessages,
  ChatRoomForm,
  ChatRoomHeads,
} from 'components/chatRoom/chatRoom';

// TODO: Limit the number of message displayed
const ChatRoom = () => {
  // contexts
  const { user } = useContext(AuthContext);

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
  const [displayError] = useError();
  const copyToClipboard = useCopyToClibpard(messageBox);

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
      displayError(err);
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
      displayError(err);
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
      displayError(err);
    } finally {
      dispatch({
        type: CHANGE_IS_SENDING,
        isSending: false,
      });
    }
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

  return (
    <Layout title="Palit | Chat">
      <div className="chat-room">
        <div className="grid">
          {/* HEADER */}
          <ChatRoomHeader activeRoom={state.activeRoom} />

          {/* BODY */}
          <div className="chat-room-body">
            {/* MESSAGES */}
            <ChatRoomMessages
              messages={state.messages}
              userID={user.key}
              messageAnchor={messageAnchor}
            />

            {/* CHAT FORM */}
            <ChatRoomForm
              copyToClipboard={copyToClipboard}
              messageBox={messageBox}
              handleMessage={handleMessage}
              sendMessage={sendMessage}
              form={form}
              isSending={state.isSending}
            />
          </div>

          {/* CHAT HEADS */}
          <ChatRoomHeads
            rooms={state.rooms}
            activeRoom={state.activeRoom}
            openChatRoom={openChatRoom}
          />
        </div>
      </div>
      <style jsx>
        {`
          .chat-room {
            --theme: #${state.settings?.theme || 'fa9917'};
          }
        `}
      </style>
    </Layout>
  );
};

export default useProtection(ChatRoom);
