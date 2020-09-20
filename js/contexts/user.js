import { createContext } from 'react';

export const defaultValue = {
  id: 'v8WgF6h9IOhUHtxgrOL7mqNk8Dk1',
  address: 'Cauayan City, Isabela',
  email: 'joimee.cajandab@gmail.com',
  firstName: 'Joimee',
  lastName: 'Cajandab',
};

const UserContext = createContext(defaultValue);

export default UserContext;
