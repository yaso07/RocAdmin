import { createBrowserRouter, redirect } from "react-router-dom";
import Login, { action } from "./pages/Login";
import App from "./App";
import DashBoard from "./pages/DashBoard";

import Error from "./components/Error";
import { getUser } from "./api/Category/user";
import { toast } from "react-toastify";

import ContactsPage from "./pages/ContactsPage";
import EventsPage from "./pages/EventsPage";
import ActivityPage from "./pages/ActivityPage";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <Error error="404"></Error>,
    loader: async () => {
      const user = await JSON.parse(getUser());
      if (!user) {
        return redirect("/login");
      }
      return null;
    },
    children: [
      {
        index: true,
        element: <DashBoard></DashBoard>,
      },
      {
        path: 'contacts',
        element: <ContactsPage></ContactsPage>
      },
      {
        path: 'events',
        element: <EventsPage />
      },
      {
        path: 'activity',
        element: <ActivityPage />
      }
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
    action: async ({ request }) => {
      return action(request);
    },
  },
  {
    path: "/logout",
    loader: () => {
      localStorage.removeItem("user");
      toast.success(`You've successfully logged out.`);
      return redirect("/login");
    },
  },
]);
