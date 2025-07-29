import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDJ4hs3ohCbjEV3NeeClXEsnU2dXl7m-S4',
        authDomain: 'day-hotel.firebaseapp.com',
        projectId: 'day-hotel',
        storageBucket: 'day-hotel.firebasestorage.app',
        messagingSenderId: '391678775969',
        appId: '1:391678775969:web:249814c75ee630cc0196e0',
        measurementId: 'G-WPQ74GD6Y1',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
