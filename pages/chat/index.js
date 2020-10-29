import { useState, useContext, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';
import { format } from 'timeago.js';
import CHATROOM from 'js/models/chatRooms';
import AuthContext from 'js/contexts/auth';
import useProtection from 'js/hooks/useProtection';
import { normalizeData, isAllObjectValuesFalse } from 'js/utils';
import Layout from 'components/layout/layout';
import Title from 'components/title/title';

const Chat = () => {
  // context
  const { user } = useContext(AuthContext);

  // states
  const [rooms, setRooms] = useState(null);

  /**
   * useEffect.
   */
  useEffect(() => {
    const unsubscribe = CHATROOM.userChatRoomsListener(user.key, (snapshot) => {
      const chatRooms = normalizeData(snapshot);

      setRooms(chatRooms);
    });

    return unsubscribe;
  }, []);

  return (
    <Layout title="Pailt | Chat">
      <div className="chat">
        <div className="grid">
          <div className="chat-header">
            <Title>Chat</Title>
            <Link href="/chat/settings" as="/chat/settings">
              <a className="chat-header__settings">
                <ReactSVG src="/icons/settings-outline.svg" />
              </a>
            </Link>
          </div>
          <ul className="chat-mates">
            {rooms && rooms.map((room) => (
              <li
                className={`chat-mate ${room.isUnread ? '--unread' : ''}`}
                key={room.key}
              >
                <Link href="/chat/[memberID]" as={`/chat/${room.userID}`}>
                  <a className="chat-mate__link">
                    <div className="chat-mate__avatar-container">
                      <figure className="chat-mate__avatar">
                        <img src={room.avatar} alt="palit" />
                      </figure>
                    </div>
                    <div className="chat-mate__info">
                      <h2 className="chat-mate__name">
                        {room.firstName}
                        {' '}
                        {room.lastName}
                      </h2>
                      {!isAllObjectValuesFalse(room.latestMessage) ? (
                        <>
                          <p className="chat-mate__message">
                            {room.latestMessage.senderID === user.key ? 'Me: ' : ''}
                            {room.latestMessage.content}
                          </p>
                          <div className="chat-mate__meta">
                            <span className="chat-mate__read-more">Read More</span>
                            <span className="chat-mate__timeago">
                              {format(room.latestMessage.timestamp.toMillis())}
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
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Chat);
