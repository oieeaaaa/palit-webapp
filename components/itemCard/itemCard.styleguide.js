/*
*******************************
Stylguide for Item Card.

NOTE: Not for production use
*******************************
*/

import ItemCard from './itemCard';

export const data = [
  {
    id: 0,
    title: 'Hammer',
    cover: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    likes: 323,
    trade_requests: 28,
    is_liked: true,
    is_traded: false,
  },
  {
    id: 1,
    title: 'Mug',
    cover: 'https://images.unsplash.com/photo-1582098763665-8477ab3c25fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1901&q=80',
    likes: 99,
    trade_requests: 3,
    is_liked: true,
    is_traded: true,
  },
  {
    id: 2,
    title: 'Pickle Axe',
    cover: 'https://images.unsplash.com/photo-1558903619-229c7bfcf634?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1826&q=80',
    likes: 68,
    trade_requests: 5,
    is_liked: true,
    is_traded: false,
  },
  {
    id: 3,
    title: 'Rocket',
    cover: 'https://images.unsplash.com/photo-1564518440696-ef272968778e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    likes: 241,
    trade_requests: 81,
    is_liked: false,
    is_traded: false,
  },
];

export default () => (
  <ItemCard />
);
