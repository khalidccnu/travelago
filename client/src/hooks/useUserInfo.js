import React, { useEffect, useState } from "react";
import useAuth from "./useAuth.js";
import useAxiosIns from "./useAxiosIns.js";

const useUserInfo = () => {
  const [isUserInfoLoading, setUserInfoLoading] = useState(true);
  const [isUserInfoRefetch, setUserInfoRefetch] = useState(false);
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const axiosIns = useAxiosIns();

  useEffect(
    (_) => {
      if (user) {
        axiosIns.get(`/self/users/${user.uid}`).then((response) => {
          setUserInfo(response.data);
          setUserInfoLoading(false);
          setUserInfoRefetch(false);
        });
      }
    },
    [user, isUserInfoRefetch]
  );

  return [isUserInfoLoading, userInfo, setUserInfoRefetch];
};

export default useUserInfo;
