import firebase from 'palit-firebase';
import { newReport } from 'js/shapes/report';

const db = firebase.firestore();
const reportsCollection = db.collection('reports');

/**
 * add
 *
 * @param {object} data
 */
const add = (data) => reportsCollection.add(newReport(data));

export default {
  add,
};
