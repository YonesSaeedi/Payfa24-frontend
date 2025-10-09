// Import the Firebase scripts needed for messaging
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_Plaa8FwbR0J0DPxV1pbHGI7viiR9fDQ",
  authDomain: "payfa24-19c04.firebaseapp.com",
  projectId: "payfa24-19c04",
  storageBucket: "payfa24-19c04.firebasestorage.app",
  messagingSenderId: "433776593819",
  appId: "1:433776593819:web:b2ab46e4cec08e791b2f3e",
  measurementId: "G-7ZFK8F11JR"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: handle background messages
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // اگر داری
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
