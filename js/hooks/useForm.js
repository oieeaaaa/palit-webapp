import { useState, useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import { extractFileURL, validateFields, isEqual } from 'js/utils';

/**
 * useForm.
 *
 * @param {object} initialFormValues
 */
const useForm = (initialFormValues = {}) => {
  // contexts
  const { handlers } = useContext(LayoutContext);

  // states
  const [form, setForm] = useState(initialFormValues);

  /**
   * inputController.
   * It should update the form state
   * @param {object} e
   */
  const inputController = (e) => {
    e.persist();

    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * fileController.
   *
   * It extracts the first item from the files array
   * It should udpate the form state
   *
   * @param {object} e
   */
  const fileController = (e) => {
    e.persist();

    // Stop this function if no file is selected
    if (!e.target.value) return;

    const file = e.target.files[0];

    setForm((prevForm) => ({
      ...prevForm,
      [`${e.target.name}Url`]: extractFileURL(file),
      [e.target.name]: file,
    }));
  };

  /**
   * clearForm.
   */
  const clearForm = () => {
    setForm(initialFormValues);
  };

  /**
   * validateForm.
   *
   * @param {object} fieldRules
   * Ex:
   *
   ```
    {
      name: { complete: true },
      remarks: { complete: true },
      image: { complete: true },
      email: { complete: true, email: true },
    }
    ```
    visit js/utils -> validate func for more info.
   */
  const validateForm = (fieldRules = {}) => {
    const validatedForm = validateFields(form, fieldRules);

    switch (true) {
      case (validatedForm.isInvalid): {
        handlers.showBanner({
          text: 'You are missing some required field/s',
          variant: 'warning',
        });

        return false;
      }

      case (isEqual(initialFormValues, form)): {
        handlers.showBanner({
          text: 'Nothing to update',
          variant: 'info',
        });

        return false;
      }

      default:
        return true;
    }
  };

  return {
    form,
    setForm,
    inputController,
    fileController,
    clearForm,
    validateForm,
  };
};

export default useForm;
