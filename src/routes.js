import React, { Suspense, Fragment, lazy } from 'react';
import {  Route, Redirect, Switch } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={() => (
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            )}
          />
        );
      })}
      <Redirect to={BASE_URL} />
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: true,
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    layout: AdminLayout,
    routes: [
      {
        exact: true,
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: true,
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      }
    ]
  }
];

export { renderRoutes, routes };
