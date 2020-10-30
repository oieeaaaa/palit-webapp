/*
***************************************
Component: Chat
Author: Joimee
Description:
***************************************
*/
import Link from 'next/link';
import { format } from 'timeago.js';
import { isAllObjectValuesFalse } from 'js/utils';
import Icon from 'components/icon/icon';
import Title from 'components/title/title';
import Avatar from 'components/avatar/avatar';

/**
 * ChatHeader.
 *
 * @param {object} props
 * @param {string} title
 */
export const ChatHeader = ({ title }) => (
  <div className="chat-header">
    <Title>{title}</Title>
    <Link href="/chat/settings" as="/chat/settings">
      <a className="chat-header__settings">
        <Icon name="settings-outline" />
      </a>
    </Link>
  </div>
);

/**
 * ChatMate.
 *
 * @param {object} props
   * @param {string} mate
   * @param {string} userID
 */
export const ChatMate = ({ mate, userID }) => (
  <li
    className={`chat-mate ${mate.isUnread ? '--unread' : ''}`}
    key={mate.key}
  >
    <Link href="/chat/[memberID]" as={`/chat/${mate.userID}`}>
      <a className="chat-mate__link">
        <div className="chat-mate__avatar-container">
          <Avatar
            className="chat-mate__avatar"
            src={mate.avatar}
            name={mate.firstName}
            initial={mate.firstName[0]}
          />
        </div>
        <div className="chat-mate__info">
          <h2 className="chat-mate__name">
            {mate.firstName}
            {' '}
            {mate.lastName}
          </h2>
          {!isAllObjectValuesFalse(mate.latestMessage) ? (
            <>
              <p className="chat-mate__message">
                {mate.latestMessage.senderID === userID ? 'Me: ' : ''}
                {mate.latestMessage.content}
              </p>
              <div className="chat-mate__meta">
                <span className="chat-mate__read-more">Read More</span>
                <span className="chat-mate__timeago">
                  {format(mate.latestMessage.timestamp.toMillis())}
                </span>
              </div>
            </>
          )
            : (
              <p className="chat-mate__message">Empty conversation</p>
            )}
        </div>
      </a>
    </Link>
  </li>
);

/**
 * ChatMates.
 *
 * @param {object} props
   * @param {object} mates
 */
export const ChatMates = ({ mates, userID }) => (
  <ul className="chat-mates">
    {mates && mates.map((mate) => (
      <ChatMate key={mate.key} mate={mate} userID={userID} />
    ))}
  </ul>
);

/**
 * ChatEmpty.
 *
 * @param {object} props
   * @param {boolean} string
 */
export const ChatEmpty = ({ isEmpty }) => isEmpty && (
  <div className="tip">
    <h2 className="tip-heading">Your chat is empty:</h2>
    <p className="tip-text">There is nothing here</p>
  </div>
);

export default {
  ChatMate,
  ChatHeader,
  ChatMates,
  ChatEmpty,
};
