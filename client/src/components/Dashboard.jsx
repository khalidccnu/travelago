import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { CgMenuLeft } from "react-icons/cg";
import { FaAngleLeft, FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import useAuth from "../hooks/useAuth.js";
import useUserInfo from "../hooks/useUserInfo.js";
import DashboardRoot from "./DashboardRoot.jsx";

const Dashboard = () => {
  const location = useLocation();
  const { logOut } = useAuth();
  const [, userInfo] = useUserInfo();
  const [hbMenu, setHbMenu] = useState(true);
  const { fullName, userImg } = userInfo ?? {};

  // handle responsive ui
  const handleResize = (_) => {
    if (innerWidth >= 768) setHbMenu(false);
    else setHbMenu(true);
  };

  useEffect(() => {
    handleResize();

    addEventListener("resize", handleResize);

    return () => removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-[18rem_auto]">
        {/* sidebar */}
        <div
          className={`fixed md:static ${
            hbMenu ? "-left-96" : "left-0"
          } top-0 w-72 md:w-auto h-full md:h-auto md:min-h-screen p-5 pt-10 md:-mt-10 md:-mb-10 bg-gray-50 overflow-y-auto md:overflow-y-visible scrollbar-hide md:scrollbar-default z-10 transition-[left] duration-500`}
        >
          <FaAngleLeft
            className="md:hidden text-2xl mb-5 cursor-pointer"
            onClick={(_) => setHbMenu(true)}
          />
          <div className="md:sticky md:top-28">
            {/* user image */}
            <figure className="w-20 h-20 rounded-full mx-auto overflow-hidden">
              <IKImage
                path={userImg}
                className="w-full h-full object-cover"
                transformation={[{ q: "40" }]}
              />
            </figure>
            {/* user name */}
            <h2 className="font-bold text-center mt-3">{fullName}</h2>
            {/* menu items */}
            <ul className="flex flex-col bg-gray-200 p-5 mt-5 rounded space-y-3">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "flex px-2 py-1 leading-5 gap-1 rounded transition-colors duration-500 " +
                    (isActive
                      ? "bg-[#3d429c] text-white"
                      : "hover:bg-[#3d429c] hover:text-white")
                  }
                >
                  <FaHome />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    "flex px-2 py-1 leading-5 gap-1 rounded transition-colors duration-500 " +
                    (isActive
                      ? "bg-[#3d429c] text-white"
                      : "hover:bg-[#3d429c] hover:text-white")
                  }
                >
                  <FaUser />
                  <span>Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="groups"
                  className={({ isActive }) =>
                    "flex px-2 py-1 leading-5 gap-1 rounded transition-colors duration-500 " +
                    (isActive
                      ? "bg-[#3d429c] text-white"
                      : "hover:bg-[#3d429c] hover:text-white")
                  }
                >
                  <FaUserGroup />
                  <span>Groups</span>
                </NavLink>
              </li>
              <li>
                <span
                  className="flex px-2 py-1 leading-5 gap-1 rounded hover:bg-[#3d429c] hover:text-white cursor-pointer transition-colors duration-500"
                  onClick={logOut}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* main content */}
        <div className="container">
          <CgMenuLeft
            className="md:hidden text-lg mb-5 cursor-pointer"
            onClick={(_) => setHbMenu(false)}
          />
          {location.pathname === "/" ? <DashboardRoot /> : null}
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
