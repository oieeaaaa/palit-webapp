import firebase from 'firebase/app';

const storageRef = firebase.storage().ref();

/**
 * saveImage
 *
 * @param {object} file
 * @param {string} folderName
 */
const saveImage = async (file, fileName, folderName = 'images') => {
  const imageRef = storageRef.child(`${folderName}/${fileName}`);

  const imageSnapshot = await imageRef.put(file);
  const imageUrl = await imageSnapshot.ref.getDownloadURL();

  return imageUrl;
};

export default {
  saveImage,
};
