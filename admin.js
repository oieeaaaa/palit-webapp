import admin from 'firebase-admin';
import serviceAccount from './palit-fb2a5-firebase-adminsdk-i87c4-7f92ea78ec.json';

const functions = require('firebase-functions');

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
};

const app = !admin.apps.length ? admin.initializeApp(config) : admin.app();

// services
export const db = app.firestore();
export const fn = functions;

export default app;
