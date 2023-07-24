import React, { useEffect, useState } from "react";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import GroupPost from "./GroupPost.jsx";
import EmptyFeed from "./EmptyFeed.jsx";
import FeedGroups from "./FeedGroups.jsx";

const Feed = () => {
  const axiosIns = useAxiosIns();
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};
  const [isReload, setReload] = useState(false);
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
    [_id, isReload]
  );

  return !isPostsLoading ? (
    <>
      {posts.length ? (
        <div className={`grid grid-cols-1 gap-7 max-w-lg mx-auto mt-10`}>
          {posts.map((post) => (
            <GroupPost key={post._id} _id={_id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyFeed />
      )}
      <FeedGroups isReload={isReload} setReload={setReload} />
    </>
  ) : null;
};

export default Feed;
