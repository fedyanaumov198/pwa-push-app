
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let payload = { title: 'Новое уведомление', body: 'Пуш получен!' };
    
    if (event.data) {
      try {
        payload = event.data.json();
      } catch (e) {
        payload.body = event.data.text();
      }
    }

    const windowClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    const isAppFocused = windowClients.some(client => client.focused);

    for (const client of windowClients) {
      client.postMessage({
        type: 'PUSH_RECEIVED',
        payload: payload
      });
    }

    if (!isAppFocused) {
      return self.registration.showNotification(payload.title || 'Пуш', {
        body: payload.body || payload.msg,
        icon: '/logo192.png',
        badge: '/logo192.png',
        data: payload
      });
    }
  })());
});

self.addEventListener('notificationclick', event => {
  event.waitUntil((async () => {
    event.notification.close();

    const windowClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    for (const client of windowClients) {
      if (client.url.includes(self.location.origin) && 'focus' in client) {
        return client.focus();
      }
    }

    if (self.clients.openWindow) {
      return self.clients.openWindow('/');
    }
  })());
});

self.addEventListener('notificationclose', event => {
  event.waitUntil((async () => {
    console.log('Уведомление было закрыто/смахнуто пользователем', event.notification.data);
  })());
});