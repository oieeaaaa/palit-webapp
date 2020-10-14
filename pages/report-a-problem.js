import { useState, useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import { extractFileURL, validateFields } from 'js/utils';
import useError from 'js/hooks/useError';
import REPORT from 'js/models/report';
import storage from 'js/storage';

import Header from 'components/header/header';
import { LandingFooter } from 'components/landing/landing';

const initalFormValues = {
  problemType: '',
  explanation: '',
  screenshot: null,
};

const ReportAProblem = () => {
  // contexts
  const { handlers } = useContext(LayoutContext);

  // TODO: create a useForm hook
  // states
  const [form, setForm] = useState(initalFormValues);

  // custom hooks
  const [displayError] = useError();
  const fieldKeys = {
    problemType: 'problemType',
    explanation: 'explanation',
    screenshot: 'screenshot',
  };

  /**
   * handleChange.
   *
   * @param {object} e
   */
  const handleChange = (e) => {
    e.persist();

    // EASTER EGG: The banner will pops up when the user selected "the whole thing" as a problem
    if (e.target.name === fieldKeys.problemType && e.target.value === 'the-whole-thing') {
      handlers.showBanner({
        text: 'bruh, uncool. 😿',
        variant: 'default',
      });
    }

    setForm((prevForm) => ({
      ...prevForm,
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

    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: image,
      [`${e.target.name}__url`]: extractFileURL(image),
    }));
  };

  /**
   * handleSubmit.
   *
   * @param {object} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validatedForm = validateFields(form, {
      problemType: { complete: true },
      explanation: { complete: true },
    });

    if (validatedForm.isInvalid) {
      handlers.showBanner({
        text: 'You\'re missing some required field/s',
        variant: 'warning',
      });

      return;
    }

    try {
      const screenshotFile = form[fieldKeys.screenshot];
      let screenshot = '';

      // fetch the public file URL then store it in the database
      if (screenshotFile) {
        const fileName = `${Date.now()}-${screenshotFile.name}`;
        screenshot = await storage.saveImage(form[fieldKeys.screenshot], fileName, 'reports');
      }

      await REPORT.add({
        ...form,
        screenshot,
      });

      setForm(initalFormValues);
      handlers.showBanner({
        text: 'Done!',
        variant: 'success',
      });
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <div className="report-a-problem">
      <Header />
      <form className="report-a-problem__form grid" onSubmit={handleSubmit}>
        <div className="report-a-problem__group">
          <label className="form-group --mb-40 --problemType" htmlFor={fieldKeys.problemType}>
            <p className="form-group__label --em">
              What kind of problem?
            </p>
            <select
              className="form__input"
              id={fieldKeys.problemType}
              name={fieldKeys.problemType}
              value={form[fieldKeys.problemType]}
              onChange={handleChange}
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
          <label className="form-group --mb-40 --explanation" htmlFor={fieldKeys.explanation}>
            <p className="form-group__label --em">
              Wait, Can you explain?
            </p>
            <textarea
              className="form__input --textarea"
              id={fieldKeys.explanation}
              name={fieldKeys.explanation}
              value={form[fieldKeys.explanation]}
              onChange={handleChange}
            />
            <p className="form__helper">
              We know this is boring, but we need more details to develop a
              better solution for your problem
            </p>
          </label>
        </div>
        <label className="form-group --mb-60 report-a-problem__screenshot" htmlFor={fieldKeys.screenshot}>
          <input
            className="hide-appearance"
            id={fieldKeys.screenshot}
            name={fieldKeys.screenshot}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
          />
          <p className="form-group__label --em">
            Screenshot
          </p>
          {form[fieldKeys.screenshot] ? (
            <figure className="report-a-problem__screenshot-image">
              <img
                src={form[`${fieldKeys.screenshot}__url`]}
                alt={form[fieldKeys.screenshot].name}
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
        <button className="button --primary" type="submit">
          Report
        </button>
      </form>
      <LandingFooter />
    </div>
  );
};

export default ReportAProblem;
