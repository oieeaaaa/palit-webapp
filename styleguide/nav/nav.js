import componentList from 'styleguide/component-list';

export default ({ active, onSetActive }) => (
  <ul className="styleguide-nav">
    {componentList.map(({ name }) => {
      let buttonClass = 'styleguide-nav__button';

      if (name === active) {
        buttonClass += ' active';
      }

      return (
        <li key={name} className="styleguide-nav__item">
          <button
            type="button"
            className={buttonClass}
            onClick={() => onSetActive(name)}
          >
            {name}
          </button>
        </li>
      );
    })}
  </ul>
);
