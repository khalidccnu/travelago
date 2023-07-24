import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import MyGroupsCard from "../components/MyGroupsCard.jsx";

const MyGroups = () => {
  const { isReload, setReload } = useOutletContext();
  const axiosIns = useAxiosIns();
  const [isGroupLoading, setGroupLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};

  // delete group data
  const deleteGroup = (gid, iid) => {
    axiosIns.delete(`/self/groups/${_id}/${gid}/${iid}`).then((_) => {
      toast.success("Group deleted!");
      setReload(!isReload);
    });
  };

  useEffect(
    (_) => {
      if (_id) {
        axiosIns.get(`/self/groups/${_id}`).then((response) => {
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
          <MyGroupsCard
            key={group._id}
            deleteGroup={deleteGroup}
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
        <span>You did not create any group yet.</span>
      </div>
    )
  ) : null;
};

export default MyGroups;
