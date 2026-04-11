'use client';

import { useEffect } from 'react';

export default function SwRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
