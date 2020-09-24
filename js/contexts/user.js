import { createContext } from 'react';

const users = {
  joimee: {
    id: 'iBffuKGQ1ZUlcMrz3Orls0mH91W2',
    address: 'Mississippi, United States',
    email: 'joimee.cajandab@gmail.com',
    firstName: 'Joimee',
    lastName: 'Cajandab',
  },
  jm: {
    id: 'v8WgF6h9IOhUHtxgrOL7mqNk8Dk1',
    address: 'California, United States',
    email: 'jm.smith@gmail.com',
    firstName: 'JM',
    lastName: 'Smith',
  },
};

export const defaultValue = users.jm;

const UserContext = createContext(defaultValue);

export default UserContext;
