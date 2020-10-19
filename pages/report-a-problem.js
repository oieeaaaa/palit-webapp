import { useState, useContext } from 'react';
import LayoutContext from 'js/contexts/layout';
import useError from 'js/hooks/useError';
import REPORT from 'js/models/report';
import storage from 'js/storage';

import Header from 'components/header/header';
import { LandingFooter } from 'components/landing/landing';
import ReportAProblemForm from 'components/reportAProblemForm/reportAProblemForm';

const ReportAProblem = () => {
  // states
  const [isLoading, setIsLoading] = useState(false);

  // contexts
  const { handlers } = useContext(LayoutContext);

  // custom hooks
  const [displayError] = useError();

  /**
   * handleSubmit.
   *
   * @param {object} form
   * @param {function} clearForm
   */
  const handleSubmit = async (form, clearForm) => {
    try {
      setIsLoading(true);

      let { screenshot } = form;

      // fetch the public file URL then store it in the database
      if (screenshot) {
        const fileName = `${Date.now()}-${screenshot.name}`;
        screenshot = await storage.saveImage(form.screenshot, fileName, 'reports');
      }

      await REPORT.add({
        ...form,
        screenshot,
      });

      handlers.showBanner({
        text: 'Done!',
        variant: 'success',
      });

      clearForm();
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report-a-problem">
      <Header />
      <ReportAProblemForm onSubmit={handleSubmit} isLoading={isLoading} />
      <LandingFooter />
    </div>
  );
};

export default ReportAProblem;
