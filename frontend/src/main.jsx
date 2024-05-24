import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import ErrorPage from "./pages/error/ErrorPage.jsx";
import GameDetailPage from "./pages/GameDetailPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AdminGuard from "./guards/AdminGuard.jsx";
import SuccessPage from "./pages/payment/Success.jsx";
import FailurePage from "./pages/payment/Failure.jsx";
import NotificationPage from "./pages/payment/Notification.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import UnderConstruct from "./pages/error/UnderConstruct.jsx";

const browserRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "games/:id",
        element: <GameDetailPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
      {
        path: "/shopping-cart",
        element: <ShoppingCart />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/payment/success",
        element: <SuccessPage />,
      },
      {
        path: "/payment/failure",
        element: <FailurePage />,
      },
      {
        path: "/payment/notification",
        element: <NotificationPage />,
      },
      {
        path: "/construct",
        element: <UnderConstruct />,
      },
      // Protected admin routes
      {
        path: "/admin/dashboard",
        element: (
          <AdminGuard>
            <AdminDashboardPage />
          </AdminGuard>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={browserRouter} />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);
