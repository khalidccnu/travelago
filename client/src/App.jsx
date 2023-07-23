import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import AuthProvider from "./providers/AuthProvider.jsx";
import Root from "./Root.jsx";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ]);

  return (
    // user authentication provider
    <AuthProvider>
      {/* imagekit authentication provider */}
      <IKContext
        publicKey={import.meta.env.VITE_IK_PL_KEY}
        urlEndpoint={`https://ik.imagekit.io/${import.meta.env.VITE_IK_ID}`}
        authenticationEndpoint={`${import.meta.env.VITE_API_URL}/ik`}
      >
        <RouterProvider router={router} />
      </IKContext>
    </AuthProvider>
  );
};

export default App;
