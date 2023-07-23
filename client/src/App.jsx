import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import Root from "./Root.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);

  return (
    // imagekit authentication context
    <IKContext
      publicKey={import.meta.env.VITE_IK_PL_KEY}
      urlEndpoint={`https://ik.imagekit.io/${import.meta.env.VITE_IK_ID}`}
      authenticationEndpoint={`${import.meta.env.VITE_API_URL}/ik`}
    >
      <RouterProvider router={router} />
    </IKContext>
  );
};

export default App;
