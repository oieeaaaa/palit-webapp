import { useState, useContext, useEffect } from 'react';
import CHATROOM from 'js/models/chatRooms';
import AuthContext from 'js/contexts/auth';
import useProtection from 'js/hooks/useProtection';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';
import { ChatHeader, ChatMates } from 'components/chat/chat';

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
          <ChatHeader title="Chat" />
          <ChatMates mates={rooms} userID={user.key} />
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Chat);
