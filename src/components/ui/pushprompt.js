'use client'

import { useEffect } from 'react'

export default function PushPrompt({ user }) {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      if (!user) return;
      askPermissionAndSubscribe(user);
    }
  }, [user]);

  return null;
}

async function askPermissionAndSubscribe(user) {
  if (localStorage.getItem('pushSubscribed') === 'true') return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const reg = await navigator.serviceWorker.ready;
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
  });

  const payload = new URLSearchParams();
  payload.append('subscription', JSON.stringify(subscription));
  payload.append('username', user);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registersubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const result = await response.json();

    if (result.status === true) {
      localStorage.setItem('pushSubscribed', 'true');

      new Notification("Congratulations!", {
        body: "You have subscribed to notification successfully.",
        icon: '/icons/android/android-launchericon-96-96.png',
      });
    }
  } catch (err) {
    console.error('Failed to register push subscription:', err);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
