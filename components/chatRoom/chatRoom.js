/*
***************************************
Component: ChatRoom
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import { format } from 'timeago.js';
import Icon from 'components/icon/icon';

/**
 * ChatRoomHeader.
 *
 * @param {object} props
   * @param {object} activeRoom
 */
export const ChatRoomHeader = ({ activeRoom }) => (
  <div className="chat-room-header">
    <h1 className="chat-room-header__title">
      {activeRoom && (
        `${activeRoom.firstName} ${activeRoom.lastName}`
      )}
    </h1>
    <Link href="/chat/settings" as="/chat/settings">
      <a className="chat-room-header__settings" type="button">
        <Icon
          className="chat-room-header__setings-icon"
          name="settings-outline"
        />
      </a>
    </Link>
  </div>
);

/**
 * ChatRoomMessage.
 *
 * @param {object} props
   * @param {boolean} isSender
   * @param {object} message
 */
export const ChatRoomMessage = ({ isSender, message }) => (
  <li className={`chat-room-message ${isSender ? '--sender' : ''}`}>
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

/**
 * ChatRoomMessages.
 *
 * @param {object} props
   * @param {object} messages
   * @param {string} userID
   * @param {object} messageAnchor
 */
export const ChatRoomMessages = ({ messages, userID, messageAnchor }) => (
  <ul className="chat-room-messages">
    {messages && (
      messages.map((message) => {
        const isSender = message.sender.key === userID;

        return (
          <ChatRoomMessage
            key={message.key}
            isSender={isSender}
            message={message}
          />
        );
      })
    )}
    <li ref={messageAnchor} />
  </ul>
);

/**
 * ChatRoomMessages.
 *
 * @param {object} props
   * @param {function} copyToClipboard
   * @param {object} messageBox
   * @param {function} handleMessage
   * @param {function} sendMessage
   * @param {object} form
   * @param {boolean} isSending
 */
export const ChatRoomForm = ({
  copyToClipboard,
  messageBox,
  handleMessage,
  sendMessage,
  form,
  isSending,
}) => (
  <div className="chat-room-form">
    <button className="chat-room-form__util" type="button" onClick={copyToClipboard}>
      <Icon className="chat-room-form__util-icon" name="copy-outline" />
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
        className={`chat-room-form__button button ${isSending ? '--disabled' : ''}`}
        type="button"
        onClick={sendMessage}
        disabled={isSending}
      >
        <Icon className="chat-room-form__util-icon" name="send-outline" />
      </button>
    </div>
  </div>
);

/**
 * ChatRoomHeads.
 *
 * @param {object} props
   * @param {array} rooms
   * @param {object} activeRoom
   * @param {function} openChatRoom
 */
export const ChatRoomHeads = ({ rooms, activeRoom, openChatRoom }) => (
  <ul className="chat-room-heads">
    {rooms && (
      rooms.map((room) => (
        <li
          className={`chat-room-head ${activeRoom?.key === room.key ? '--active' : ''}`}
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
);

export default {
  ChatRoomHeader,
  ChatRoomMessage,
  ChatRoomMessages,
  ChatRoomForm,
  ChatRoomHeads,
};
