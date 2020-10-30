import {
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import CHATROOM from 'js/models/chatRooms';
import AuthContext from 'js/contexts/auth';
import useProtection from 'js/hooks/useProtection';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';
import { ChatHeader, ChatMates, ChatEmpty } from 'components/chat/chat';

const Chat = () => {
  // context
  const { user } = useContext(AuthContext);

  // states
  const [rooms, setRooms] = useState(null);

  // callbacks
  const isChatEmpty = useCallback(() => !!(rooms && !rooms.length), [rooms]);

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
          <ChatHeader title="Chat" />
          <ChatMates mates={rooms} userID={user.key} />
          <ChatEmpty isEmpty={isChatEmpty()} />
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Chat);
