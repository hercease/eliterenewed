'use client'

import { useEffect } from 'react'
import { toaster } from "@/components/ui/toaster"

export default function PushPrompt({ user }) {
  useEffect(() => {
    if (!user) return;
    
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorkerAndSubscribe(user);
    } else {
      console.warn('Push messaging is not supported');
    }
  }, [user]);

  return null;
}

async function registerServiceWorkerAndSubscribe(user) {
  try {
    // First, register the service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    
    console.log('Service Worker registered:', registration);
    
    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    
    // Now ask for permission and subscribe
    await askPermissionAndSubscribe(user);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    toaster.create({
      title: 'Error',
      description: 'Push notifications not supported: ' + error.message,
      duration: 5000,
      type: 'error',
    });
  }
}

async function askPermissionAndSubscribe(user) {
  try {
    // Check if already subscribed
    const reg = await navigator.serviceWorker.ready;
    const existingSubscription = await reg.pushManager.getSubscription();
    
    if (existingSubscription) {
      console.log('Already subscribed to push notifications');
      return;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    //console.log("Notification permission:", permission);
    
    if (permission !== 'granted') {
      //console.log('Notification permission denied');
      toaster.create({
        title: 'Permission Required',
        description: 'Please enable notifications to receive updates',
        duration: 3000,
        type: 'warning',
      });
      return;
    }

    // Subscribe to push notifications
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    });

    //console.log("Push subscription:", subscription);

    // Send subscription to server
    const payload = new URLSearchParams();
    payload.append('subscription', JSON.stringify(subscription));
    payload.append('username', user);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registersubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    const result = await response.json();
    //console.log('Server response:', result);

    if (result.status) {
      // Store subscription status
      localStorage.setItem('pushSubscribed', 'true');
      
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("Success!", {
          body: "You've successfully subscribed to notifications",
          icon: '/icons/android/android-launchericon-96-96.png',
        });
      }
      
      toaster.create({
        title: 'Success',
        description: 'Push notifications enabled successfully',
        duration: 3000,
        type: 'success',
      });
    } else {
      throw new Error(result.message || 'Failed to register subscription');
    }
  } catch (err) {
    console.error('Failed to register push subscription:', err);
    toaster.create({
      title: 'Error',
      description: 'Failed to enable push notifications: ' + err.message,
      duration: 5000,
      type: 'error',
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}