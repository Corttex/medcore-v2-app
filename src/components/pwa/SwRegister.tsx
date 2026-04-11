'use client';

import { useEffect } from 'react';

export default function SwRegister() {
  useEffect(() => {
    // Only register SW in production to avoid issues with stale CSS/JS in dev
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('MedCore SW Registration successful with scope: ', registration.scope);
        })
        .catch((err) => {
          console.log('MedCore SW Registration failed: ', err);
        });
    }
  }, []);

  return null;
}
