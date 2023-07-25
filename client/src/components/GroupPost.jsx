import React, { useEffect, useState } from "react";
import { IKImage } from "imagekitio-react";
import useAxiosIns from "../hooks/useAxiosIns.js";

const GroupPost = ({ post }) => {
  const { postImg, postDescription, user_id } = post;
  const axiosIns = useAxiosIns();
  const [user, setUser] = useState({});

  useEffect((_) => {
    axiosIns
      .get(`/users/${user_id}`)
      .then((response) => setUser(response.data));
  }, []);

  return (
    <div className="card card-compact bg-base-100 shadow">
      {postImg ? (
        <figure>
          <IKImage
            path={postImg}
            className="w-full h-full object-cover"
            transformation={[{ q: "40" }]}
          />
        </figure>
      ) : null}
      <div className="card-body space-y-2">
        <div className="flex items-center space-x-2">
          <div className="avatar">
            <figure className="mask mask-squircle w-6 h-6">
              {user.userImg?.includes("https") ? (
                <img
                  src={user.userImg}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <IKImage
                  path={user.userImg}
                  className="w-full h-full object-cover"
                  transformation={[{ q: "40" }]}
                />
              )}
            </figure>
          </div>
          <h6 className="font-bold">{user.fullName}</h6>
        </div>
        <p>{postDescription}</p>
      </div>
    </div>
  );
};

export default GroupPost;
