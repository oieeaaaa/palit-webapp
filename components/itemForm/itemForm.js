/*
***************************************
Component: ItemForm
Author: Joimee
Description:
***************************************
*/
import { useState, useEffect, useContext } from 'react';
import { ReactSVG } from 'react-svg';
import LayoutContext from 'js/contexts/layout';
import { extractFileURL, validateFields, isEqual } from 'js/utils';

export const initialFormValues = {
  name: '',
  remarks: '',
};

const ItemForm = ({
  onSubmit,
  isLoading,
  variant = 'add',
  data = initialFormValues,
}) => {
  // contexts
  const { handlers } = useContext(LayoutContext);

  // states
  const [form, setForm] = useState(data);

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
      imageFile: image,
      [e.target.name]: extractFileURL(image),
    }));
  };

  /**
   * handleSubmit.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const validatedForm = validateFields(form, {
      name: { complete: true },
      remarks: { complete: true },
      image: { complete: true },
    });

    if (isEqual(data, form)) {
      handlers.showBanner({
        text: 'Nothing to update',
        variant: 'info',
      });

      return;
    }

    if (validatedForm.isInvalid) {
      handlers.showBanner({
        text: 'You are missing some required field',
        variant: 'warning',
      });

      return;
    }

    onSubmit(form);
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    setForm({
      ...data,
      image: data.cover,
    });
  }, [data]);

  return (
    <div className="itemForm">
      <form className="grid" onSubmit={handleSubmit}>
        <label className="input-group" htmlFor="cover">
          <figure className="itemForm__image">
            {form.image ? (
              <img src={form.image} alt={form.name} />
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
          className={`button --primary ${isLoading ? ' --disabled' : ''}`}
          type="submit"
          disabled={isLoading}
        >
          {variant === 'add' ? 'Add' : 'Edit'}
        </button>
      </form>
    </div>
  );
};

export default ItemForm;
