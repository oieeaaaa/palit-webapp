import { createContext } from 'react';

export const defaultValue = {
  id: 'iBffuKGQ1ZUlcMrz3Orls0mH91W2',
  address: 'Cauayan City, Isabela',
  email: 'joimee.cajandab@gmail.com',
  firstName: 'Joimee',
  lastName: 'Cajandab',
};

const UserContext = createContext(defaultValue);

export default UserContext;
