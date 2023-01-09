import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../public/index.scss';
import App from './App';
import NewConferencePage from './components/NewConferencePage';
import ConferencesPage from './components/ConferencesPage';
import ConferencePage from './components/ConferencePage';
import EditConferencePage from './components/EditConferencePage';

const container = document.getElementById('app');
const root = createRoot(container);

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <ConferencesPage />,
      },
      {
        path: 'new',
        element: <NewConferencePage />,
      },
      {
        path: 'conference',
        children: [
          {
            path: ':id',
            element: <ConferencePage />,
          },
          {
            path: 'edit/:id',
            element: <EditConferencePage />,
          },
        ],
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
