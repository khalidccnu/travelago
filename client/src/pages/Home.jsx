import React from "react";
import { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import Signin from "../components/Signin.jsx";
import Dashboard from "../components/Dashboard.jsx";

const Home = () => {
  const { isUserLoading, user } = useAuth();

  return (
    <section>
      <div className="container">
        {!isUserLoading ? (
          !user ? (
            <Signin />
          ) : (
            <Dashboard />
          )
        ) : (
          // loader
          <div className="flex items-center justify-center min-h-screen">
            <div>
              <h2 className="text-6xl font-semibold text-[#40513b] uppercase animate-pulse">
                Loading...
              </h2>
              <p className="text-2xl text-[rgb(157,_192,_139)]">
                Wait for sometime
              </p>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </section>
  );
};

export default Home;
