import React, { useEffect, useState } from "react";
import useAxiosIns from "../hooks/useAxiosIns.js";
import GroupPost from "./GroupPost.jsx";

const GroupPosts = ({ isReload, _id, group_id }) => {
  const axiosIns = useAxiosIns();
  const [isPostsLoading, setPostsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(
    (_) => {
      if (group_id) {
        axiosIns.get(`/posts/${group_id}`).then((response) => {
          setPosts(response.data);
          setPostsLoading(false);
        });
      }
    },
    [group_id, isReload]
  );

  return !isPostsLoading ? (
    posts.length ? (
      <div className={`grid grid-cols-1 gap-7 max-w-lg mx-auto mt-10`}>
        {posts.map((post) => (
          <GroupPost key={post._id} _id={_id} post={post} />
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
        <span>There are no group posts yet.</span>
      </div>
    )
  ) : null;
};

export default GroupPosts;
