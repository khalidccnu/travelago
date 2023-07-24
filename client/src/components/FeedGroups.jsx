import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import OtherGroupsCard from "../components/OtherGroupsCard.jsx";

const FeedGroups = ({ isReload, setReload }) => {
  const axiosIns = useAxiosIns();
  const [isGroupLoading, setGroupLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};

  // connect with group
  const connectGroup = (gid, groupName) => {
    axiosIns.put(`/groups/connect/${_id}/${gid}`).then((_) => {
      toast.success(`You connected successfully with ${groupName}!`);
      setReload(!isReload);
    });
  };

  useEffect(
    (_) => {
      if (_id) {
        axiosIns
          .get(`/groups/limit/${_id}?method=not-connect&limit=2`)
          .then((response) => {
            setGroups(response.data);
            setGroupLoading(false);
          });
      }
    },
    [_id, isReload]
  );

  return !isGroupLoading ? (
    groups.length ? (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-7 mt-10`}>
        {groups.map((group) => (
          <OtherGroupsCard
            key={group._id}
            connectGroup={connectGroup}
            group={group}
          />
        ))}
      </div>
    ) : (
      <div className="alert max-w-sm mx-auto mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>There are no groups for connect.</span>
      </div>
    )
  ) : null;
};

export default FeedGroups;
