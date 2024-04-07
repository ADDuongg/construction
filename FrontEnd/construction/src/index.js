import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './pages/homepage';
import Project from './pages/project';
import Matterials from './pages/matterial';
import Machine from './pages/machine';
import Error from './error/error';
import Assignment from './pages/assignment';
import CheckToken from './component/checkToken';
import StatePayment from './pages/statePayment'
import Statistic from './pages/statistic';
import AddStatistic from './form/statistic/addStatistic';
import Staff from './pages/staff';
import Contracts from './pages/contracts';
import Contractors from './pages/contractors';
import Customers from './pages/customers';
import ImportMatterials from './pages/importMatterials';
import HireMachine from './pages/hireMachine';
import Login from './pages/login';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import EditStatistic from './form/statistic/editStatistic';
import StateProject from './pages/stateProject';
import DetailSchedule from './pages/detailSchedule';
import AddState from './form/project/addState';
import AddSchedule from './pages/addSchedule';
import ExtendProject from './pages/extendProject';
import ExtendContract from './pages/extendContract';
import BuildingPermit from './pages/buildingPermit';
import ContractPayment from './pages/contractPayment';
import Attendance from './pages/attendance';
import AttendanceDetail from './form/attendance/attendanceDetail';
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: "/",
    element: <Homepage />,
    errorElement: <Error />
  },
  {
    path: "/project",
    element: <CheckToken><Project /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/matterials",
    element: <CheckToken><Matterials /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/machine",
    element: <CheckToken><Machine /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/assignment",
    element: <CheckToken><Assignment /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/addSchedule/:id",
    element: <CheckToken><AddState /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/stateProject",
    element: <StateProject />,
    errorElement: <Error />
  },
  {
    path: "/statistics",
    element: <CheckToken><Statistic /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/addStatistic",
    element: <CheckToken><AddStatistic /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/staff",
    element: <CheckToken><Staff /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/contracts",
    element:<CheckToken> <Contracts /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/contractors",
    element: <CheckToken><Contractors /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/customers",
    element: <CheckToken><Customers /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/importMatterials",
    element: <CheckToken><ImportMatterials /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/hireMachine",
    element: <CheckToken><HireMachine /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/editStatistic/:id",
    element: <CheckToken><EditStatistic /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/detailSchedule/",
    element: <CheckToken><DetailSchedule /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/addSchedule/",
    element: <CheckToken><AddSchedule /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/extendProject/",
    element: <CheckToken><ExtendProject /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/extendContract/",
    element: <CheckToken><ExtendContract /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/buildingPermit/",
    element: <CheckToken><BuildingPermit /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/contractPayment/",
    element: <CheckToken><ContractPayment /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/statePayment",
    element: <CheckToken><StatePayment /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/attendance",
    element: <CheckToken><Attendance /></CheckToken>,
    errorElement: <Error />
  },
  {
    path: "/attendanceDetail/:id",
    element: <CheckToken><AttendanceDetail /></CheckToken>,
    errorElement: <Error />
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>

      <RouterProvider router={router} />
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={true} />

    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
