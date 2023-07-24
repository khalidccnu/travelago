import React from "react";
import { useNavigate } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { FaMinus } from "react-icons/fa";

const GroupsRootCard = ({ disConnectGroup, group }) => {
  const { _id, groupImg, groupName } = group;
  const navigate = useNavigate();

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body space-y-3">
        <div
          className={`flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3`}
        >
          {/* group image */}
          <figure className="w-40 h-40 sm:w-32 sm:h-32 rounded">
            <IKImage
              path={groupImg.filePath}
              className="w-full h-full object-cover"
              transformation={[{ q: "40" }]}
            />
          </figure>
          {/* group name */}
          <h3 className={`card-title`}>{groupName}</h3>
        </div>
        {/* group action */}
        <div className="card-actions flex-nowrap justify-center sm:justify-between">
          <button
            className="btn btn-sm sm:w-[85%] bg-[#3d429c] hover:bg-transparent text-white hover:text-[#3d429c] !border-[#3d429c] rounded normal-case"
            onClick={(_) => navigate("/groups/" + _id)}
          >
            View group
          </button>
          <button
            className="btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case"
            onClick={(_) => disConnectGroup(_id, groupName)}
          >
            <FaMinus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupsRootCard;
