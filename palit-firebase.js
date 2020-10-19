import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

// navigate to next.config.js to find the value of these properties
const config = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

// Initialize Firebase (only once)
const app = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

// UNCOMMENT CODE BELOW TO ENABLE LOCAL EMULATOR

// const env = process.env.NODE_ENV || 'development';

/* if (env === 'development') {
  app.firestore().settings({
    host: 'localhost:8080',
    ssl: false,
  });
} */

export default app;
