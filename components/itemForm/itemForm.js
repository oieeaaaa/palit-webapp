/*
***************************************
Component: ItemForm
Author: Joimee
Description:
***************************************
*/
import { useState, useContext } from 'react';
import { ReactSVG } from 'react-svg';
import { extractFileURL } from 'js/utils';
import firebase from 'palit-firebase';
import UserContext from 'js/contexts/user';
import LayoutContext from 'js/contexts/layout';
import item from 'js/models/item';

const initialFormValues = {
  name: '',
  remarks: '',
};

export default () => {
  const user = useContext(UserContext);
  const { handlers } = useContext(LayoutContext);
  const [form, setForm] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handleChange.
   * It should update the form state
   * @param {object} e
   */
  const handleChange = (e) => {
    e.persist();

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * handleImageChange.
   * It extracts the first item from the files array
   * It should udpate the form state
   * @param {object} e
   */
  const handleImageChange = (e) => {
    e.persist();

    // Stop this function if no file is selected
    if (!e.target.value) return;

    const image = e.target.files[0];

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: image,
    }));
  };

  /**
   * handleSubmit.
   *
   * It should store the image to the firebase storage
   * It should save the form state to the realtime db in firebase
   * It should update the error state if something goes wrong
   * @param {object} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Disable button while waiting for the requests below
    setIsLoading(true);

    const storageRef = firebase.storage().ref();

    // Problem: Firebase overrides the previous image if the filename already exists
    // TODO: Image name must be unique or find a way to prevent firebase from overriding files
    const imageRef = storageRef.child(`images/${form.image.name}`);

    try {
      const imageSnapshot = await imageRef.put(form.image);

      // fetch the public file URL then store it in the database
      const cover = await imageSnapshot.ref.getDownloadURL();

      // add new data in the database
      await item.add(user.id, {
        ...form,
        cover,
      });

      // reset form
      setForm(initialFormValues);

      handlers.showBanner({
        variant: 'success',
        text: `Added ${form.name} 🎉`,
      });
    } catch (err) {
      handlers.showBanner({
        variant: 'error',
        text: err.message,
      });
    } finally {
      // Enable submit button
      setIsLoading(false);
    }
  };

  return (
    <div className="itemForm">
      <form className="grid" onSubmit={handleSubmit}>
        <label className="input-group" htmlFor="cover">
          <figure className="itemForm__image">
            {form.image ? (
              <img src={extractFileURL(form.image)} alt="" />
            ) : (
              <ReactSVG className="itemForm__icon" src="/icons/image-outline.svg" />
            )}
          </figure>
          <span>Add Image</span>
          <input
            id="cover"
            name="image"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
          />
        </label>
        <input
          className="input"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
        />
        <textarea
          className="textarea"
          name="remarks"
          placeholder="Remarks"
          onChange={handleChange}
          value={form.remarks}
        />
        <button
          className={`button ${isLoading ? ' --disabled' : ''}`}
          type="submit"
          disabled={isLoading}
        >
          Add
        </button>
      </form>
    </div>
  );
};
