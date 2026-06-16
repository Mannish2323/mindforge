'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function usePushNotifications(userId: string | null) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return false;
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted' && userId) {
        // Save preference to Firestore
        await updateDoc(doc(db, 'users', userId), {
          pushNotificationsEnabled: true,
          pushPermissionGrantedAt: new Date().toISOString(),
        });
        // Schedule a test notification
        setTimeout(() => {
          new Notification('🌿 Velmorth — You\'re all set!', {
            body: 'We\'ll remind you to practice every day.',
            icon: '/icon-192.png',
          });
        }, 1000);
      }
      return result === 'granted';
    } catch (e) {
      console.error('Push permission error:', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendStreakReminder = (streakDays: number) => {
    if (permission !== 'granted') return;
    new Notification(`🔥 Keep your ${streakDays}-day streak!`, {
      body: 'You haven\'t practiced today. Don\'t break your streak!',
      icon: '/icon-192.png',
      tag: 'streak-reminder',
    });
  };

  return { permission, loading, requestPermission, sendStreakReminder };
}
