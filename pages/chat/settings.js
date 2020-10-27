import { Fragment } from 'react';
import { ReactSVG } from 'react-svg';
import useProtection from 'js/hooks/useProtection';
import useForm from 'js/hooks/useForm';
import Layout from 'components/layout/layout';

const Settings = () => {
  const themes = ['FA9917', '39F', 'F55', '2AC940', '333'];

  // custom hooks
  const { setForm, form } = useForm({
    theme: '',
    doNotDisturb: false,
  });

  /**
   * toggleCheckbox.
   *
   * @param {object} e
   */
  const toggleCheckbox = (e) => {
    e.persist();

    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: !prevForm[e.target.name],
    }));
  };

  /**
   * onSelectTheme.
   *
   * @param {string} theme
   */
  const onSelectTheme = (theme) => {
    setForm((prevForm) => ({
      ...prevForm,
      theme,
    }));
  };

  return (
    <Layout title="Palit | Chat Settings">
      <div className="chat-settings">
        <div className="grid">
          <h1 className="chat-settings__title">Chat Settings</h1>
          <div className="form-group">
            <h3 className="form-group__label">Theme</h3>
            <ul className="chat-settings__themes">
              {themes && themes.map((theme) => (
                <Fragment key={theme}>
                  <li
                    className={`chat-settings__theme --${theme} ${theme === form.theme ? '--active' : ''}`}
                  >
                    <label className="chat-settings__checkbox" htmlFor={theme}>
                      <div className="chat-settings__theme-color" />
                      <input
                        id={theme}
                        name="theme"
                        className="hide-appearance"
                        type="checkbox"
                        onChange={() => onSelectTheme(theme)}
                      />
                      {form.theme === theme && (
                        <span className="chat-settings__checkbox-display">
                          <ReactSVG
                            className="chat-settings__checkbox-icon"
                            src="/icons/checkbox-outline.svg"
                          />
                        </span>
                      )}
                    </label>
                  </li>
                  <style jsx>
                    {`
                      .chat-settings__theme.--${theme} .chat-settings__theme-color,
                      .chat-settings__theme.--${theme} .chat-settings__checkbox-display {
                        background-color: #${theme};
                      }
                    `}
                  </style>
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="form-group">
            <h3 className="form-group__label">Notifications</h3>
            <label
              className="chat-settings__checkbox"
              htmlFor="doNotDisturb"
            >
              <input
                id="doNotDisturb"
                name="doNotDisturb"
                className="hide-appearance"
                type="checkbox"
                onChange={toggleCheckbox}
              />
              <span className="chat-settings__checkbox-display">
                {form.doNotDisturb && (
                  <ReactSVG
                    className="chat-settings__checkbox-icon"
                    src="/icons/checkbox-outline.svg"
                  />
                )}
              </span>
              <span className="chat-settings__checkbox-text">
                Do not disturb
              </span>
            </label>
          </div>
          <div className="chat-settings__actions">
            <button className="button --default" type="button">
              Leave settings
            </button>
            <button className="button --primary" type="button">
              Save
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Settings);
