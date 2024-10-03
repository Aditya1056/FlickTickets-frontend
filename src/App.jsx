import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import Root from "./pages/Root/Root";
import Auth from "./pages/auth/Auth";
import ForgotMyPassword from "./pages/auth/ForgotMyPassword";
import Profile from "./pages/Profile/Profile";
import Theatres from './pages/Theatres/Theatres';
import MyTheatres from "./pages/Theatres/MyTheatres";
import Requests from "./pages/Theatres/Requests";
import Theatre from "./pages/Theatres/Theatre";
import Movies from "./pages/Movies/Movies";
import Movie from "./pages/Movies/Movie";
import Booking from "./pages/Movies/Booking";
import MyBookings from "./pages/Movies/MyBookings";

import AuthContextProvider from "./components/shared/Providers/AuthContextProvider";
import ToastContextProvider from './components/shared/Providers/ToastContextProvider';

import AuthProtection from "./components/shared/AuthProtection/AuthProtection";
import UnAuthProtection from "./components/shared/AuthProtection/UnAuthProtection";

import queryClient from './util/helpers/queryClient';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <UnAuthProtection element={ <Auth /> } />
      },
      {
        path:'forgot-password',
        element: <UnAuthProtection element={ <ForgotMyPassword /> } />
      },
      {
        path: 'movies',
        element: <AuthProtection element={ <Movies /> } />
      },
      {
        path: 'movie/:movieId',
        element: <AuthProtection element={ <Movie /> } />
      },
      {
        path: 'movie-show/:showId',
        element: <AuthProtection element={ <Booking /> } />
      },
      {
        path: 'theatres',
        element: <AuthProtection element={ <Theatres /> } />
      },
      {
        path: 'mytheatres',
        element: <AuthProtection element={ <MyTheatres /> } />
      },
      {
        path: 'theatre/:theatreId',
        element: <AuthProtection element={ <Theatre /> } />
      },
      {
        path: 'theatre-requests',
        element: <AuthProtection element={ <Requests /> } />
      },
      {
        path: 'bookings',
        element: <AuthProtection element={ <MyBookings /> } />
      },
      {
        path: 'profile',
        element: <AuthProtection element={ <Profile /> } />
      },
    ]
  }
]);

function App() {

  return (
    <ToastContextProvider>
      <QueryClientProvider client={queryClient} >
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </QueryClientProvider>
    </ToastContextProvider>
  );
}

export default App;
