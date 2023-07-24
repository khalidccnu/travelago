import React from "react";
import { IKImage } from "imagekitio-react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";
import useUserInfo from "../hooks/useUserInfo.js";

const Profile = () => {
  const [, userInfo] = useUserInfo();
  const { userImg, fullName, phone, email } = userInfo ?? {};

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-white shadow-xl rounded-lg py-3">
        {/* user image */}
        <figure className="w-32 h-32 rounded-full mx-auto overflow-hidden">
          <IKImage
            path={userImg}
            className="w-full h-full object-cover"
            transformation={[{ q: "40" }]}
          />
        </figure>
        <div className="p-2">
          {/* user name */}
          <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
            {fullName}
          </h3>
          {/* user details */}
          <div className="text-xs space-y-1 mt-2">
            <div className={`flex justify-center space-x-1`}>
              <span className="text-gray-500 font-semibold">
                <FaPhoneAlt />
              </span>
              <span>{phone || "N/A"}</span>
            </div>
            <div className={`flex justify-center space-x-1`}>
              <span className="text-gray-500 font-semibold">
                <FaEnvelope />
              </span>
              <span>{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
