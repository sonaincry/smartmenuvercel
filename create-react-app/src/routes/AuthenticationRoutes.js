import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const Template = Loadable(lazy(() => import('views/utilities/Template')));
const Test = Loadable(lazy(() => import('views/utilities/renderTemplate')));
const Display = Loadable(lazy(() => import('views/utilities/Display')));
const ChooseTemplate = Loadable(lazy(() => import('views/sample-page/ChooseTemplate')));
const ConfirmPassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/ConfirmPassword')));
const Checking = Loadable(lazy(() => import('views/sample-page/Checking')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/template/:templateId',
      element: <Template />
    },
    {
      path: '/pages/display/:templateId',
      element: <Display />
    },
    {
      path: '/pages/choose-template',
      element: <ChooseTemplate />
    },
    {
      path: '/pages/getTemplate',
      element: <Test />
    },
    {
      path: '/',
      element: <AuthLogin3 />
    },
    {
      path: '/pages/checking',
      element: <Checking />
    },
    {
      path: '/pages/confirm-password',
      element: <ConfirmPassword />
    }
  ]
};

export default AuthenticationRoutes;
