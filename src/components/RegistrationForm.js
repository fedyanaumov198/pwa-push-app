import React, { useState, useContext } from 'react';
import { Page, Toolbar, Input, Button, ProgressCircular } from 'react-onsenui';
import { SubContext } from '../SubContext';
import { urlBase64ToUint8Array } from '../utils';

const VAPID_PUBLIC_KEY = 'BEZDXiWj7aaVg-yBqLSEGdCueTn9eOko6I47GoQWxTHVCiegDGh9IVO5wHgfoyJIr4bYT8FzOA-hQX04FcHAAQk';

export default function RegistrationForm({ navigator }) {
  const [fio, setFio] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSubData, setPushSubscription } = useContext(SubContext);

  const handleSubscribe = async () => {
    if (!fio || !subGroup) {
      alert('Заполните все поля!');
      return;
    }

    setLoading(true);
    try {
      if (!('serviceWorker' in window.navigator)) {
        throw new Error('Service Worker не поддерживается в этом браузере');
      }

      const reg = await window.navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }

      const formData = new FormData();
      formData.append('fio', fio);
      formData.append('sub_group', subGroup);
      formData.append('endpoint', sub.endpoint);
      formData.append('p256dh', btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))));
      formData.append('auth', btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))));

      const response = await fetch('http://naumovfmai.temp.swtest.ru/saveSubscription.php', {
        method: 'POST',
        body: formData
      });

      const resText = await response.text();

      if (resText.includes('1') || response.ok) {
        setSubData({ fio, subGroup });
        setPushSubscription(sub);
        navigator.pushPage({ key: 'ShowSubscriptionPg' });
      } else {
        alert('Ошибка сохранения на сервере');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка оформления подписки: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      renderModal={() => null}
      renderFixed={() => null}
      renderBottomToolbar={() => null}
      renderToolbar={() => <Toolbar><div className="center">Регистрация Push</div></Toolbar>}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>
          <Input
            value={fio}
            onChange={(e) => setFio(e.target.value)}
            modifier="underbar"
            float
            placeholder="ФИО"
          />
        </p>
        <p>
          <Input
            value={subGroup}
            onChange={(e) => setSubGroup(e.target.value)}
            modifier="underbar"
            float
            placeholder="Группа"
          />
        </p>
        <p style={{ marginTop: '30px' }}>
          {loading ? (
            <ProgressCircular indeterminate />
          ) : (
            <Button onClick={handleSubscribe}>Подписаться на уведомления</Button>
          )}
        </p>
      </div>
    </Page>
  );
}