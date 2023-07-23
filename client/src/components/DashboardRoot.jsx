import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import useUserInfo from "../hooks/useUserInfo.js";

const DashboardRoot = () => {
  const [, userInfo] = useUserInfo();
  const [greetings, setGreetings] = useState(null);
  const [anmCommunity, setAnmCommunity] = useState(null);

  useEffect((_) => {
    import(`../assets/community.json`).then((response) =>
      setAnmCommunity(response.default)
    );
  }, []);

  useEffect((_) => {
    {
      const hours = new Date().getHours();

      if (hours < 12) setGreetings("Morning");
      else if (hours >= 12 && hours <= 18) setGreetings("Afternoon");
      else if (hours > 18 && hours <= 24) setGreetings("Evening");
    }
  }, []);

  return (
    <div className="max-w-xs mx-auto md:mt-14">
      {anmCommunity ? (
        <Lottie className="w-full" animationData={anmCommunity} loop={true} />
      ) : null}
      <h2 className="font-bold text-lg text-center">
        Good {greetings}, {userInfo?.fullName}
      </h2>
    </div>
  );
};

export default DashboardRoot;
