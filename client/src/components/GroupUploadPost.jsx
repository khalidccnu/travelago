import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { FaUpload } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import useAxiosIns from "../hooks/useAxiosIns.js";

const GroupUploadPost = ({ _id, group_id }) => {
  const axiosIns = useAxiosIns();
  const formik = useFormik({
    initialValues: {
      postDescription: "",
      postImg: null,
    },
    onSubmit: async (values, formikHelpers) => {
      if (!values.postDescription) {
        toast.error("Write something!");
        return false;
      }

      if (values.postImg) {
        const formData = new FormData();
        formData.append("postImg", values.postImg);

        // upload image to server
        await axiosIns
          .post(`/posts/upload-pi`, formData)
          .then((response) => (values.postImg = response.data.filePath));
      }

      // insert data to server
      axiosIns
        .post(`/posts`, { ...values, group_id, user_id: _id, date: new Date() })
        .then((_) => {
          formikHelpers.resetForm();
          toast.success("New post created!");
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="form-control flex-row">
      <div className={`relative basis-[40rem] mx-auto mt-12`}>
        <div className={`pb-12 border textarea-bordered rounded`}>
          <textarea
            rows="3"
            placeholder="Write something..."
            name="postDescription"
            className="textarea textarea-sm leading-loose w-full resize-none focus:outline-0"
            value={formik.values.postDescription}
            onChange={formik.handleChange}
          ></textarea>
          <div className={`absolute bottom-3 left-3`}>
            <input
              type="file"
              name="postImg"
              id="postImg"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                formik.setFieldValue("postImg", e.currentTarget.files[0])
              }
            />
            <label
              htmlFor="postImg"
              className="btn btn-sm rounded w-full normal-case"
            >
              {formik.values.postImg ? (
                formik.values.postImg.name?.substring(
                  0,
                  formik.values.postImg.name?.lastIndexOf(".")
                )
              ) : (
                <>
                  <span>Choose Post Photo</span>
                  <FaUpload />
                </>
              )}
            </label>
          </div>
          <button
            type="submit"
            className={`absolute bottom-3 right-3 flex justify-center items-center w-10 h-10 bg-[#3d429c] hover:bg-transparent text-white hover:text-[#3d429c] border !border-[#3d429c] rounded-full cursor-pointer`}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </form>
  );
};

export default GroupUploadPost;
