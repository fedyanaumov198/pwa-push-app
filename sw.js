self.addEventListener('push', function (event) {
  let data = { title: 'Уведомление', body: 'Новое сообщение!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/logo192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'PWA Push', options)
  );
});