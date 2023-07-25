import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import toast from "react-hot-toast";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";
import FeedGroupsCard from "./FeedGroupsCard.jsx";

const FeedGroups = ({ isReload, setReload }) => {
  const axiosIns = useAxiosIns();
  const [isGroupLoading, setGroupLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};

  // connect with group
  const connectGroup = (gid, groupName) => {
    axiosIns.put(`/groups/connect/${_id}/${gid}`).then((_) => {
      toast.success(`You connected successfully with ${groupName}!`);
      setReload(!isReload);
    });
  };

  useEffect(
    (_) => {
      if (_id) {
        axiosIns
          .get(`/groups/limit/${_id}?method=not-connect&limit=10`)
          .then((response) => {
            setGroups(response.data);
            setGroupLoading(false);
          });
      }
    },
    [_id, isReload]
  );

  return !isGroupLoading ? (
    groups.length ? (
      <div className={`max-w-lg mx-auto mt-10`}>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ pauseOnMouseEnter: true, disableOnInteraction: false }}
          slidesPerView="1"
          spaceBetween="50"
        >
          {groups.map((group) => (
            <SwiperSlide key={group._id}>
              <FeedGroupsCard connectGroup={connectGroup} group={group} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    ) : null
  ) : null;
};

export default FeedGroups;
