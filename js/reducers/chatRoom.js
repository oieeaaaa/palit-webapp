import { useReducer } from 'react';

// initial values
const defaultChatRoomValues = {
  isSending: false,
  rooms: null,
  activeRoom: null,
  messages: null,
  settings: null,
};

// constants
export const CHANGE_IS_SENDING = 'CHANGE_IS_SENDING';
export const UPDATE_ROOMS = 'UPDATE_ROOMS';
export const UPDATE_ACTIVE_ROOM = 'UPDATE_ACTIVE_ROOM';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const ADD_NEW_ROOM = 'ADD_NEW_ROOM';

// reducer
const chatRoomReducer = (state, action) => {
  switch (action.type) {
    case CHANGE_IS_SENDING:
      return ({
        ...state,
        isSending: action.isSending,
      });

    case UPDATE_ROOMS:
      return ({
        ...state,
        rooms: action.rooms,
      });

    case ADD_NEW_ROOM:
      return ({
        ...state,
        rooms: state.rooms.concat(action.newRoom),
      });

    case UPDATE_ACTIVE_ROOM:
      return ({
        ...state,
        activeRoom: action.activeRoom,
      });

    case UPDATE_MESSAGES:
      return ({
        ...state,
        messages: action.messages,
      });

    case UPDATE_SETTINGS:
      return ({
        ...state,
        settings: action.settings,
      });

    default:
      throw new Error(`Invalid Type! There is no such type as ${action.type}`);
  }
};

// hook
const useChatRoomReducer = (initialValues = defaultChatRoomValues) => {
  const [state, dispatch] = useReducer(chatRoomReducer, initialValues);

  return [
    state,
    dispatch,
  ];
};

export default useChatRoomReducer;
