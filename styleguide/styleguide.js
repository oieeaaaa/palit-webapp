import { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';
import Nav from './nav/nav';
import componentList from './component-list';

export default () => {
  const [activeComponent, setActiveComponent] = useState('');

  useEffect(() => {
    const toggleGrid = throttle((e) => {
      if (e.ctrlKey && e.key === 'g') {
        document.body.classList.toggle('active-grid');
      }
    }, 200);

    window.addEventListener('keypress', toggleGrid);

    return () => window.removeEventListener('keypress', toggleGrid);
  });


  const renderComponents = (list) => {
    if (!activeComponent) return () => {};

    const Component = list.reduce((comp, curComp) => {
      if (activeComponent === curComp.name) {
        comp = curComp.component;
      }

      return comp;
    }, '');

    return <Component />;
  };

  return (
    <div className="styleguide">
      <Nav active={activeComponent} onSetActive={setActiveComponent} />
      <main className="styleguide-main grid">
        {renderComponents(componentList)}
      </main>
    </div>
  );
};
