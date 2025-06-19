import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginForm from "./pages/Auth/LoginForm";
import SignUpForm from "./pages/Auth/SignUpForm";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import { useSelector } from "react-redux";
import type { RootState } from "./@types";

const Root = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/dashboard" />;
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/income",
    element: <Income />,
  },
  {
    path: "/expense",
    element: <Expense />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};

export default App;
