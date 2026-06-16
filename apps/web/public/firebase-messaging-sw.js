// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyExample",
  authDomain: "learn-with-velmorth-254fa.firebaseapp.com",
  projectId: "learn-with-velmorth-254fa",
  storageBucket: "learn-with-velmorth-254fa.appspot.com",
  messagingSenderId: "999787929255",
  appId: "1:999787929255:web:velmorth"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Received background message:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Velmorth', {
    body: body || 'Time to practice Japanese! 🌿',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'velmorth-streak',
    data: payload.data,
    actions: [
      { action: 'practice', title: '🎯 Practice Now' },
      { action: 'dismiss', title: 'Later' },
    ],
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'practice' || !event.action) {
    event.waitUntil(
      clients.openWindow('https://learnwithvelmorth.web.app')
    );
  }
});
