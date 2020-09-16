const withSass = require('@zeit/next-sass');

module.exports = withSass({
  env: {
    APIKEY: 'AIzaSyBWYNLNYfLXd1grBErEy4eUBkkNJu4SMYc',
    AUTHDOMAIN: 'palit-fb2a5.firebaseapp.com',
    DATABASEURL: 'https://palit-fb2a5.firebaseio.com',
    PROJECTID: 'palit-fb2a5',
    STORAGEBUCKET: 'palit-fb2a5.appspot.com',
    MESSAGINGSENDERID: '899544816314',
    APPID: '1:899544816314:web:88a4bacd52d7343bbf0083',
    MEASUREMENTID: 'G-N2C1EYVDGE',
  },
});
