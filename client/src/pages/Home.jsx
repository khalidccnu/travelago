import React from "react";
import Signin from "../components/Signin.jsx";

const Home = () => {
  return (
    <section>
      <div className="container">
        {/* show sign-in component */}
        <Signin />
      </div>
    </section>
  );
};

export default Home;
