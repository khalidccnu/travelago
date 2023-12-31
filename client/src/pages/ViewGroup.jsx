import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import { FaUsers } from "react-icons/fa6";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import GroupUploadPost from "../components/GroupUploadPost.jsx";
import GroupPosts from "../components/GroupPosts.jsx";
import GroupMembers from "../components/GroupMembers.jsx";

const ViewGroup = () => {
  const { gid } = useParams();
  const axiosIns = useAxiosIns();
  const [isReload, setReload] = useState(false);
  const [isGroupLoading, setGroupLoading] = useState(true);
  const [group, setGroup] = useState([]);
  const { _id: group_id, groupImg, groupName } = group ?? {};
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};

  useEffect(
    (_) => {
      if (_id) {
        axiosIns.get(`/groups/id/${gid}`).then((response) => {
          setGroup(response.data);
          setGroupLoading(false);
        });
      }
    },
    [_id]
  );

  return (
    <div className={`mt-10`}>
      {/* group image */}
      <figure className="w-full h-52 rounded overflow-hidden">
        <IKImage
          path={groupImg?.filePath}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className={`flex justify-between items-center mt-3`}>
        {/* group name */}
        <h3 className={`text-2xl font-bold`}>{groupName}</h3>
        {/* group members */}
        <div
          className={`flex justify-center items-center w-10 h-10 bg-[#3d429c] hover:bg-transparent text-white hover:text-[#3d429c] border !border-[#3d429c] rounded-full cursor-pointer`}
          onClick={() => window.members_modal.showModal()}
        >
          <FaUsers />
        </div>
      </div>
      <div>
        {/* write post */}
        <GroupUploadPost
          isReload={isReload}
          setReload={setReload}
          _id={_id}
          group_id={group_id}
        />
        {/* show group posts */}
        <GroupPosts isReload={isReload} group_id={group_id} />
      </div>
      {/* group members modal */}
      <dialog id="members_modal" className="modal">
        <GroupMembers group_id={group_id} />
      </dialog>
    </div>
  );
};

export default ViewGroup;
