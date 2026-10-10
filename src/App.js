import React, { useState, useEffect } from 'react';
import { Navigator } from 'react-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import { SubContext } from './SubContext';
import RegistrationForm from './components/RegistrationForm';
import ShowSubscriptionPg from './components/ShowSubscriptionPg';

export default function App() {
  const [subData, setSubData] = useState(null);
  const [pushSubscription, setPushSubscription] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('SW зарегистрирован:', reg))
        .catch((err) => console.error('Ошибка SW:', err));
    }
  }, []);

  const renderPage = (route, navigator) => {
    switch (route.key) {
      case 'ShowSubscriptionPg':
        return <ShowSubscriptionPg key={route.key} navigator={navigator} />;
      case 'RegistrationForm':
      default:
        return <RegistrationForm key={route.key} navigator={navigator} />;
    }
  };

  return (
    <SubContext.Provider value={{ subData, setSubData, pushSubscription, setPushSubscription }}>
      <Navigator
        initialRoute={{ key: 'RegistrationForm' }}
        renderPage={renderPage}
        renderModal={() => null}
        renderToolbar={() => null}
        onPrePush={() => {}}
        onPostPush={() => {}}
        onPrePop={() => {}}
        onPostPop={() => {}}
      />
    </SubContext.Provider>
  );
}