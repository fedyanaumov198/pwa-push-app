import { createContext } from 'react';

export const SubContext = createContext({
  subData: null,
  setSubData: () => {},
  pushSubscription: null,
  setPushSubscription: () => {}
});