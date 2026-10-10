import React, { useContext } from 'react';
import { Page, Toolbar, Button, BackButton } from 'react-onsenui';
import { SubContext } from '../SubContext';

export default function ShowSubscriptionPg({ navigator }) {
  const { subData, setSubData, pushSubscription, setPushSubscription } = useContext(SubContext);

  const handleUnsubscribe = async () => {
    try {
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
      }
      setSubData(null);
      setPushSubscription(null);
      navigator.popPage();
    } catch (err) {
      alert('Ошибка при отписке: ' + err.message);
    }
  };

  return (
    <Page
      renderModal={() => null}
      renderFixed={() => null}
      renderBottomToolbar={() => null}
      renderToolbar={() => (
        <Toolbar>
          <div className="left"><BackButton onClick={() => navigator.popPage()}>Назад</BackButton></div>
          <div className="center">Ваша подписка</div>
        </Toolbar>
      )}
    >
      <div style={{ padding: '20px' }}>
        <h3>Подписка активна!</h3>
        <p><strong>ФИО:</strong> {subData?.fio}</p>
        <p><strong>Группа:</strong> {subData?.subGroup}</p>
        <p style={{ marginTop: '30px' }}>
          <Button modifier="cta" onClick={handleUnsubscribe}>Отписаться</Button>
        </p>
      </div>
    </Page>
  );
}