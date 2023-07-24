import React, { useEffect, useState } from "react";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import GroupMember from "./GroupMember.jsx";

const GroupMembers = ({ group_id }) => {
  const axiosIns = useAxiosIns();
  const [isUsersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(
    (_) => {
      if (group_id) {
        axiosIns.get(`/group/users/${group_id}`).then((response) => {
          setUsers(response.data);
          setUsersLoading(false);
        });
      }
    },
    [group_id]
  );

  return (
    <div className="modal-box max-w-sm space-y-2">
      <div className={`flex justify-between items-center`}>
        <h3 className="font-bold text-lg">Members</h3>
        {/* close modal */}
        <form method="dialog">
          <button className="btn focus:outline-0">Close</button>
        </form>
      </div>
      {users.length ? (
        <ul>
          {users.map((user) => (
            <GroupMember key={user._id} user={user} />
          ))}
        </ul>
      ) : (
        <span>No users!</span>
      )}
    </div>
  );
};

export default GroupMembers;
