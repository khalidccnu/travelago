import React from "react";

const GroupMember = ({ user }) => {
  const { fullName } = user;

  return <li className={`px-2 py-3 border rounded`}>{fullName}</li>;
};

export default GroupMember;
