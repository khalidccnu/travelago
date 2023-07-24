import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import MyGroupsCard from "../components/MyGroupsCard.jsx";

const MyGroups = () => {
  const { isReload } = useOutletContext();
  const axiosIns = useAxiosIns();
  const [groups, setGroups] = useState([]);
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};

  useEffect(
    (_) => {
      if (_id) {
        axiosIns
          .get(`/self/groups/${_id}`)
          .then((response) => setGroups(response.data));
      }
    },
    [_id, isReload]
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-7 mt-10`}>
      {groups.map((group) => (
        <MyGroupsCard key={group._id} group={group} />
      ))}
    </div>
  );
};

export default MyGroups;
