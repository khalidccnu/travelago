import React, { useEffect, useState } from "react";
import { IKImage } from "imagekitio-react";
import useAxiosIns from "../hooks/useAxiosIns.js";

const GroupPost = ({ _id, post }) => {
  const { postImg, postDescription } = post;
  const axiosIns = useAxiosIns();
  const [user, setUser] = useState({});

  useEffect(
    (_) => {
      if (_id) {
        axiosIns
          .get(`/users/${_id}`)
          .then((response) => setUser(response.data));
      }
    },
    [_id]
  );

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
              <IKImage
                path={user.userImg}
                className="w-full h-full object-cover"
                transformation={[{ q: "40" }]}
              />
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
