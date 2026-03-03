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
        apiKey: 'AIzaSyBCE4Kua1UIuTZ4nbm2rH1ZD0fochqGe74',
        authDomain: 'room-manager-40bb0.firebaseapp.com',
        projectId: 'room-manager-40bb0',
        storageBucket: 'room-manager-40bb0.firebasestorage.app',
        messagingSenderId: '938821730785',
        appId: '1:938821730785:web:8316095c47668768a392a0',
        measurementId: 'G-49BC4Z2N7Z',
      }),
    ),
    provideFirestore(() => getFirestore()),
  ],
};
