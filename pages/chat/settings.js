import {
  Fragment,
  useState,
  useEffect,
  useContext,
} from 'react';
import { ReactSVG } from 'react-svg';
import AuthContext from 'js/contexts/auth';
import LayoutContext from 'js/contexts/layout';
import CHATROOM from 'js/models/chatRooms';
import useProtection from 'js/hooks/useProtection';
import useForm from 'js/hooks/useForm';
import { normalizeData } from 'js/utils';
import { goBack } from 'js/helpers/router';
import Layout from 'components/layout/layout';

const Settings = () => {
  const themes = ['FA9917', '39F', 'F55', '2AC940', '333'];

  // contexts
  const { user } = useContext(AuthContext);
  const { handlers } = useContext(LayoutContext);

  // states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // custom hooks
  const { setForm, form: settings, validateForm } = useForm({
    theme: '',
    doNotDisturb: false,
  });

  /**
   * getUserChatRoomSettings.
   */
  const getUserChatRoomSettings = async () => {
    try {
      const rawUserChatRoomSettings = await CHATROOM.getOneUserChatRoom(user.key);

      setForm(normalizeData(rawUserChatRoomSettings));
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * saveSettings.
   */
  const saveSettings = async () => {
    const isFormValid = validateForm({
      theme: { complete: true },
    });

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      await CHATROOM.updateUserChatRoom(user.key, settings);

      handlers.showBanner({
        text: 'Updated settings! ✨',
        variant: 'success',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  /**
   * useEffect.
   */
  useEffect(() => {
    getUserChatRoomSettings();
  }, []);

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
                    className={`chat-settings__theme --${theme} ${theme === settings.theme ? '--active' : ''}`}
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
                      {settings.theme === theme && (
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
                {settings.doNotDisturb && (
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
            <button className="button --default" type="button" onClick={goBack}>
              Leave settings
            </button>
            <button
              className={`button ${isSubmitting ? '--disabled' : '--primary'}`}
              type="button"
              onClick={saveSettings}
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Settings);
