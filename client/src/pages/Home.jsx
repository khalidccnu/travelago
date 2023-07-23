import React from "react";
import useAuth from "../hooks/useAuth.js";
import Signin from "../components/Signin.jsx";

const Home = () => {
  const { isUserLoading, user } = useAuth();

  return (
    <section>
      <div className="container">
        {!isUserLoading ? !user ? <Signin /> : null : null}
      </div>
    </section>
  );
};

export default Home;
