/*
***************************************
Component: ItemForm
Author: Joimee
Description:
***************************************
*/
import { useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import useForm from 'js/hooks/useForm';

export const initialFormValues = {
  name: '',
  remarks: '',
  cover: null,
};

const ItemForm = ({
  onSubmit,
  isLoading,
  variant = 'add',
  data = initialFormValues,
}) => {
  // custom hooks
  const {
    form,
    setForm,
    inputController,
    fileController,
    validateForm,
    clearForm,
  } = useForm(data);

  /**
   * handleSubmit.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const isFormValid = validateForm({
      name: { complete: true },
      remarks: { complete: true },
      image: { complete: true },
    });

    if (isFormValid) {
      onSubmit(form, clearForm);
    }
  };

  /**
   * useEffect.
   */
  useEffect(() => {
    if (variant !== 'edit') return;

    setForm({
      ...initialFormValues,
      name: data.name,
      remarks: data.remarks,
      coverUrl: data.cover,
    });
  }, [data]);

  return (
    <div className="itemForm">
      <form className="grid" onSubmit={handleSubmit}>
        <label className="input-group" htmlFor="cover">
          <figure className="itemForm__image">
            {form.coverUrl ? (
              <img src={form.coverUrl} alt={form.name} />
            ) : (
              <ReactSVG className="itemForm__icon" src="/icons/image-outline.svg" />
            )}
          </figure>
          <span>Choose a file</span>
          <input
            id="cover"
            name="cover"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={fileController}
          />
        </label>
        <input
          className="form__input itemForm__input"
          name="name"
          type="text"
          placeholder="Name"
          onChange={inputController}
          value={form.name}
        />
        <textarea
          className="form__input --textarea itemForm__textarea"
          name="remarks"
          placeholder="Remarks"
          onChange={inputController}
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
