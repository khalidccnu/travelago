import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import AuthProvider from "./providers/AuthProvider.jsx";
import Home from "./pages/Home.jsx";
import Error from "./pages/Error.jsx";
import Profile from "./pages/Profile.jsx";
import Groups from "./pages/Groups.jsx";
import GroupsRoot from "./components/GroupsRoot.jsx";
import MyGroups from "./pages/MyGroups.jsx";
import OtherGroups from "./pages/OtherGroups.jsx";
import ViewGroup from "./pages/ViewGroup.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />,
      children: [
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "groups",
          element: <Groups />,
          children: [
            {
              path: "/groups",
              element: <GroupsRoot />,
            },
            {
              path: "my",
              element: <MyGroups />,
            },
            {
              path: "other",
              element: <OtherGroups />,
            },
            {
              path: ":gid",
              element: <ViewGroup />,
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
