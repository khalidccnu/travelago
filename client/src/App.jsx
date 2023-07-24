import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import AuthProvider from "./providers/AuthProvider.jsx";
import Home from "./pages/Home.jsx";
import Error from "./pages/Error.jsx";
import Groups from "./pages/Groups.jsx";
import MyGroups from "./pages/MyGroups.jsx";
import OtherGroups from "./pages/OtherGroups.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />,
      children: [
        {
          path: "groups",
          element: <Groups />,
          children: [
            {
              path: "my",
              element: <MyGroups />,
            },
            {
              path: "other",
              element: <OtherGroups />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    // user authentication provider
    <AuthProvider>
      {/* imagekit authentication provider */}
      <IKContext
        urlEndpoint={`https://ik.imagekit.io/${import.meta.env.VITE_IK_ID}`}
      >
        <RouterProvider router={router} />
      </IKContext>
    </AuthProvider>
  );
};

export default App;
