import { useState, useEffect } from 'react';
import throttle from 'lodash.throttle';
import { breakpoint } from 'js/utils';

const maxWidth = 768;
const gridList = [
  {
    name: 'mobile',
    cols: 8,
    gutter: 10,
    margin: 20,
    size: 375,
  },
  {
    name: 'tablet-p',
    cols: 12,
    gutter: 15,
    margin: 30,
    size: 768,
  },
];

function getCurrentGrid(list) {
  let currentGrid = {};
  if (window.innerWidth >= maxWidth) {
    return list[list.length - 1];
  }

  for (let i = 0; i <= gridList.length - 1; i += 1) {
    if (breakpoint() === list[i].name) {
      currentGrid = list[i];
      break;
    }
  }

  return currentGrid;
}

const GridGuide = () => {
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [gridItem, setGridItem] = useState({});

  useEffect(() => {
    const updateGridItem = throttle(() => {
      setGridItem(getCurrentGrid(gridList));
    }, 100);

    updateGridItem();
    window.addEventListener('resize', updateGridItem);
    return () => window.removeEventListener('resize', updateGridItem);
  }, []);

  useEffect(() => {
    const toggleGrid = throttle((e) => {
      if (!(e.altKey && e.shiftKey && e.keyCode === 197)) return;

      setIsGridOpen(!isGridOpen);
    }, 200);

    window.addEventListener('keypress', toggleGrid);

    return () => window.removeEventListener('keypress', toggleGrid);
  });

  const genCols = cols => Array.from({length: cols}).map((_, i) => <span key={i} />); // eslint-disable-line

  return (
    <div className="grid-guide">
      {genCols(gridItem.cols)}

      <style jsx>
        {`
          .grid-guide {
            display: ${isGridOpen ? 'grid' : 'none'};
            grid-column-gap: ${gridItem.gutter}px;
            grid-template-columns: repeat(${gridItem.cols}, 1fr);
            padding: 0 ${gridItem.margin}px;
          }
        `}
      </style>
    </div>
  );
};

export default GridGuide;
