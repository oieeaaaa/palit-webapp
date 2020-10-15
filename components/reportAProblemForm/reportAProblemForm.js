/*
***************************************
Component: ReportAProblemForm
Author: Joimee
Description:
***************************************
*/
import { useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import useForm from 'js/hooks/useForm';

const ReportAProblemForm = ({ onSubmit, isLoading }) => {
  // contexts
  const { handlers } = useContext(LayoutContext);

  // states
  const {
    form,
    inputController,
    fileController,
    setForm,
    validateForm,
    clearForm,
  } = useForm({
    problemType: '',
    explanation: '',
    screenshot: null,
  });

  /**
   * handleSelectChange.
   *
   * @param {object} e
   */
  const handleSelectChange = (e) => {
    e.persist();

    // little easter egg
    if (e.target.value === 'the-whole-thing') {
      handlers.showBanner({
        text: 'Bruh. Uncool. 😿',
      });
    }

    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * handleSubmit.
   *
   * @param {object} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm({
      problemType: { complete: true },
      explanation: { complete: true },
    });

    if (!isFormValid) return;

    onSubmit(form, clearForm);
  };

  return (
    <form className="report-a-problem__form grid" onSubmit={handleSubmit}>
      <div className="report-a-problem__group">
        <label className="form-group --mb-40 --problemType" htmlFor="problemType">
          <p className="form-group__label --em">
            What kind of problem?
          </p>
          <select
            className="form__input"
            id="problemType"
            name="problemType"
            value={form.problemType}
            onChange={handleSelectChange}
          >
            <option disabled value="">&nbsp;</option>
            <option value="login-or-signup">Login or Signup</option>
            <option value="trading">Trading</option>
            <option value="inventory">Inventory</option>
            <option value="account">Account</option>
            <option value="user-behaviors">User Behaviors</option>
            <option value="others">Others</option>
            <option value="the-whole-thing">the whole thing!</option>
          </select>
        </label>
        <label className="form-group --mb-40 --explanation" htmlFor="explanation">
          <p className="form-group__label --em">
            Wait, Can you explain?
          </p>
          <textarea
            className="form__input --textarea"
            id="explanation"
            name="explanation"
            value={form.explanation}
            onChange={inputController}
          />
          <p className="form__helper">
            We know this is boring, but we need more details to develop a
            better solution for your problem
          </p>
        </label>
      </div>
      <label className="form-group --mb-60 report-a-problem__screenshot" htmlFor="screenshot">
        <input
          className="hide-appearance"
          id="screenshot"
          name="screenshot"
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={fileController}
        />
        <p className="form-group__label --em">
          Screenshot
        </p>
        {form.screenshotUrl ? (
          <figure className="report-a-problem__screenshot-image">
            <img
              src={form.screenshotUrl}
              alt={form.screenshot.name}
            />
          </figure>
        ) : (
          <p className="report-a-problem__screenshot-text">
            Choose a file
          </p>
        )}
        <p className="form__helper">
          Sometimes a screenshot is better than 1,283 words.
        </p>
      </label>
      <button
        className={`button --primary ${isLoading ? '--disabled' : ''}`}
        type="submit"
        disabled={isLoading}
      >
        Report
      </button>
    </form>
  );
};

export default ReportAProblemForm;
