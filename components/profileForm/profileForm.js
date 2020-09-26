/*
***************************************
Component: ProfileForm
Author: Joimee
Description:
***************************************
*/
import { useState, useContext, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from 'js/contexts/user';
import { extractFileURL } from 'js/utils';

const ProfileForm = ({ onSubmit, isLoading }) => {
  const user = useContext(UserContext);
  const [form, setForm] = useState(user);
  const fieldKeys = {
    firstName: 'firstName',
    lastName: 'lastName',
    avatar: 'avatar',
    phoneNumber: 'phoneNumber',
    messengerLink: 'messengerLink',
    address: 'address',
    email: 'email',
  };

  /**
   * handleFormChange.
   *
   * @param {object} e
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
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
      [e.target.name]: extractFileURL(image),
      [`${e.target.name}File`]: image,
    }));
  };

  /**
   * handleSubmit.
   *
   * @param {object} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(user.key, form);
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    if (!user.key) return;

    setForm(user);
  }, [user]);

  return (
    <form className="profileForm grid" onSubmit={handleSubmit}>
      <div className="profileForm-top">
        <label className="profileForm__upload" htmlFor={fieldKeys.avatar}>
          <figure className="profileForm__avatar">
            {form[fieldKeys.avatar] ? (
              <img src={form[fieldKeys.avatar]} alt={form[fieldKeys.firstName]} />
            ) : (
              <ReactSVG
                className="profileForm__avatar-icon"
                src="/icons/image-outline.svg"
              />
            )}
          </figure>
          <button className="profileForm__upload-button" type="button">
            Upload Image
          </button>
          <input
            id={fieldKeys.avatar}
            name={fieldKeys.avatar}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
          />
        </label>
        <div className="profileForm__name">
          <label className="form-group" htmlFor={fieldKeys.firstName}>
            <span className="form-group__label">First Name</span>
            <input
              id={fieldKeys.firstName}
              className="form__input"
              name={fieldKeys.firstName}
              value={form[fieldKeys.firstName]}
              onChange={handleFormChange}
              type="text"
              required
            />
          </label>
          <label className="form-group" htmlFor={fieldKeys.lastName}>
            <span className="form-group__label">Last Name</span>
            <input
              id={fieldKeys.lastName}
              className="form__input"
              name={fieldKeys.lastName}
              value={form[fieldKeys.lastName]}
              onChange={handleFormChange}
              type="text"
              required
            />
          </label>
        </div>
      </div>
      <label className="form-group" htmlFor={fieldKeys.email}>
        <span className="form-group__label">Email</span>
        <input
          id={fieldKeys.email}
          className="form__input --disabled"
          name={fieldKeys.email}
          value={form[fieldKeys.email]}
          onChange={handleFormChange}
          type="email"
          disabled
        />
      </label>
      <label className="form-group" htmlFor={fieldKeys.phoneNumber}>
        <span className="form-group__label">Phone Number</span>
        <input
          id={fieldKeys.phoneNumber}
          className="form__input"
          name={fieldKeys.phoneNumber}
          value={form[fieldKeys.phoneNumber]}
          onChange={handleFormChange}
          type="text"
          required
        />
      </label>
      <label className="form-group" htmlFor={fieldKeys.messengerLink}>
        <span className="form-group__label">Messenger Link (optional)</span>
        <input
          id={fieldKeys.messengerLink}
          className="form__input"
          name={fieldKeys.messengerLink}
          value={form[fieldKeys.messengerLink]}
          onChange={handleFormChange}
          type="text"
          required
        />
      </label>
      <label className="form-group" htmlFor={fieldKeys.address}>
        <span className="form-group__label">Address (optional)</span>
        <textarea
          id={fieldKeys.address}
          className="form__input --textarea"
          name={fieldKeys.address}
          value={form[fieldKeys.address]}
          onChange={handleFormChange}
          required
        />
      </label>
      <div className="profileForm-bottom">
        <button
          className={`button --primary ${isLoading ? '--disabled' : ''}`}
          type="submit"
          disabled={isLoading}
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;