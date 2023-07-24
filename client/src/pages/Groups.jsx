import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import NewGroup from "../components/NewGroup.jsx";

const Groups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReload, setReload] = useState(false);

  return (
    <div>
      <div className={`flex justify-between`}>
        <div className="join join-horizontal">
          <button
            className={`btn btn-sm join-item normal-case ${
              location.pathname.includes("my") ? "btn-disabled" : ""
            }`}
            onClick={(_) => navigate("my")}
          >
            My Groups
          </button>
          <button
            className={`btn btn-sm join-item normal-case ${
              location.pathname.includes("other") ? "btn-disabled" : ""
            }`}
            onClick={(_) => navigate("other")}
          >
            Other Groups
          </button>
        </div>
        {location.pathname.includes("my") ? (
          <button
            className={`btn btn-sm normal-case -space-x-1`}
            onClick={() => window.new_group.showModal()}
          >
            <FaPlusCircle />
            <span>New</span>
          </button>
        ) : null}
      </div>
      <Outlet context={{ isReload }} />
      <dialog id="new_group" className="modal">
        <NewGroup isReload={isReload} setReload={setReload} />
      </dialog>
    </div>
  );
};

export default Groups;
