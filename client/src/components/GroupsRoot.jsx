import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import GroupsRootCard from "./GroupsRootCard.jsx";

const GroupsRoot = () => {
  const axiosIns = useAxiosIns();
  const [isReload, setReload] = useState(false);
  const [isGroupLoading, setGroupLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};

  // disconnect with group
  const disConnectGroup = (gid, groupName) => {
    axiosIns.put(`/groups/disconnect/${_id}/${gid}`).then((_) => {
      toast.success(`You disconnected successfully from ${groupName}!`);
      setReload(!isReload);
    });
  };

  useEffect(
    (_) => {
      if (_id) {
        axiosIns.get(`/groups/${_id}?method=connect`).then((response) => {
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
          <GroupsRootCard
            key={group._id}
            disConnectGroup={disConnectGroup}
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
        <span>There are no groups.</span>
      </div>
    )
  ) : null;
};

export default GroupsRoot;
