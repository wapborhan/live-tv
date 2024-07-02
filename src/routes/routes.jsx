import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import StreamPage from "../pages/StreamPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:id",
    element: <StreamPage />,
    // loader: async ({ params }) => {
    //   return fetch(`/api/teams/${params.id}.json`);
    // },
  },
]);
