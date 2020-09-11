import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBWYNLNYfLXd1grBErEy4eUBkkNJu4SMYc',
  authDomain: 'palit-fb2a5.firebaseapp.com',
  databaseURL: 'https://palit-fb2a5.firebaseio.com',
  projectId: 'palit-fb2a5',
  storageBucket: 'palit-fb2a5.appspot.com',
  messagingSenderId: '899544816314',
  appId: '1:899544816314:web:88a4bacd52d7343bbf0083',
  measurementId: 'G-N2C1EYVDGE',
};

firebase.initializeApp(config);

export default firebase;
