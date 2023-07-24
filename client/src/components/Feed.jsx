import React, { useEffect, useState } from "react";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import GroupPost from "./GroupPost.jsx";
import EmptyFeed from "./EmptyFeed.jsx";

const Feed = () => {
  const axiosIns = useAxiosIns();
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};
  const [isPostsLoading, setPostsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(
    (_) => {
      if (_id) {
        axiosIns.get(`/posts/users/${_id}`).then((response) => {
          setPosts(response.data);
          setPostsLoading(false);
        });
      }
    },
    [_id]
  );

  return !isPostsLoading ? (
    posts.length ? (
      <div className={`grid grid-cols-1 gap-7 max-w-lg mx-auto mt-10`}>
        {posts.map((post) => (
          <GroupPost key={post._id} _id={_id} post={post} />
        ))}
      </div>
    ) : (
      <EmptyFeed />
    )
  ) : null;
};

export default Feed;
