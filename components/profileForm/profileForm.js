/*
***************************************
Component: ProfileForm
Author: Joimee
Description:
***************************************
*/
import { useState, useContext, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import AuthContext from 'js/contexts/auth';
import useForm from 'js/hooks/useForm';

const ProfileForm = ({
  onSubmit,
  isLoading,
}) => {
  // contexts
  const { user } = useContext(AuthContext);

  // states
  const [isSignedInWithGoogle, setIsSignedInWithGoogle] = useState(false);

  // custom hooks
  const {
    form,
    setForm,
    inputController,
    fileController,
    validateForm,
  } = useForm({
    firstName: '',
    lastName: '',
    avatar: null,
    phoneNumber: '',
    messengerLink: '',
    address: '',
    email: '',
  });

  /**
   * handleSubmit.
   *
   * @param {object} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid = validateForm({
      firstName: { complete: true },
      lastName: { complete: true },
      avatar: { complete: true },
      phoneNumber: { complete: true },
      email: { complete: true, email: true },
    });

    if (isFormValid) {
      onSubmit(user.key, form);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    if (!user.key) return;

    setForm({
      ...user,
      avatarUrl: user.avatar,
    });

    setIsSignedInWithGoogle(user.providerId === 'google.com');
  }, [user]);

  return (
    <form className="profileForm grid" onSubmit={handleSubmit}>
      <div className="profileForm-top">
        <label className="profileForm__upload" htmlFor="avatar">
          <figure className="profileForm__avatar">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt={form.firstName} />
            ) : (
              <ReactSVG
                className="profileForm__avatar-icon"
                src="/icons/image-outline.svg"
              />
            )}
          </figure>
          <p className="profileForm__upload-button" type="button">
            Upload Image
          </p>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={fileController}
          />
        </label>
        <div className="profileForm__name">
          <label className="form-group" htmlFor="firstName">
            <span className="form-group__label">First Name</span>
            <input
              id="firstName"
              className="form__input"
              name="firstName"
              value={form.firstName}
              onChange={inputController}
              type="text"
            />
          </label>
          <label className="form-group" htmlFor="lastName">
            <span className="form-group__label">Last Name</span>
            <input
              id="lastName"
              className="form__input"
              name="lastName"
              value={form.lastName}
              onChange={inputController}
              type="text"
            />
          </label>
        </div>
      </div>
      <label className="form-group" htmlFor="email">
        <span className="form-group__label">Email</span>
        <input
          id="email"
          className={`form__input ${isSignedInWithGoogle ? '--disabled' : ''}`}
          name="email"
          value={form.email}
          onChange={inputController}
          type="email"
          disabled={isSignedInWithGoogle}
        />
      </label>
      <label className="form-group" htmlFor="phoneNumber">
        <span className="form-group__label">Phone Number</span>
        <input
          id="phoneNumber"
          className="form__input"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={inputController}
          type="text"
        />
      </label>
      <label className="form-group" htmlFor="messengerLink">
        <span className="form-group__label">Messenger Link (optional)</span>
        <input
          id="messengerLink"
          className="form__input"
          name="messengerLink"
          value={form.messengerLink}
          onChange={inputController}
          type="text"
        />
      </label>
      <label className="form-group" htmlFor="address">
        <span className="form-group__label">Address (optional)</span>
        <textarea
          id="address"
          className="form__input --textarea"
          name="address"
          value={form.address}
          onChange={inputController}
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
