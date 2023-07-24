import React, { useRef } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { FaUpload } from "react-icons/fa";
import useAxiosIns from "../hooks/useAxiosIns.js";
import useUserInfo from "../hooks/useUserInfo.js";

// check new group form validation
const validateForm = (values) => {
  const errors = {};

  // group name validation
  if (!values.groupName) errors.groupName = "Required";
  else if (values.groupName.length > 20)
    errors.groupName = "Must be 20 characters or less";

  // group image validation
  if (!values.groupImg) errors.groupImg = "Required";

  return errors;
};

const NewGroup = ({ isReload, setReload }) => {
  const closeRef = useRef(null);
  const axiosIns = useAxiosIns();
  const [, userInfo] = useUserInfo();
  const { _id } = userInfo ?? {};
  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupImg: null,
    },
    validate: validateForm,
    onSubmit: async (values, formikHelpers) => {
      const formData = new FormData();
      formData.append("groupImg", values.groupImg);

      // upload image to server
      await axiosIns
        .post(`/groups/upload-gi/${_id}`, formData)
        .then((response) => (values.groupImg = response.data.filePath));

      // insert data to server
      axiosIns
        .post(`/groups/${_id}`, { ...values, owner: _id })
        .then((_) => {
          formikHelpers.resetForm();
          closeRef.current.click();
          toast.success("New group created!");
        })
        .then((_) => setReload(!isReload));
    },
  });

  return (
    <div className="modal-box max-w-sm">
      <div className={`flex justify-between items-center`}>
        <div>
          <h3 className="font-bold text-lg">New Group</h3>
          <p className="text-gray-500">It's quick and easy.</p>
        </div>
        {/* close modal */}
        <form method="dialog">
          <button className="btn focus:outline-0" ref={closeRef}>
            Close
          </button>
        </form>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="form-control grid grid-cols-1 gap-4 mt-5"
      >
        {/* group name box */}
        <div className="flex flex-col gap-0.5">
          <input
            type="text"
            placeholder="Group name"
            name="groupName"
            className="input input-sm input-bordered rounded w-full focus:outline-0"
            value={formik.values.groupName}
            onChange={formik.handleChange}
          />
          {formik.errors.groupName ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.groupName}
            </small>
          ) : null}
        </div>
        {/* group image box */}
        <div>
          <input
            type="file"
            name="groupImg"
            id="groupImg"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              formik.setFieldValue("groupImg", e.currentTarget.files[0])
            }
          />
          <label
            htmlFor="groupImg"
            className="btn btn-sm rounded w-full normal-case"
          >
            {formik.values.groupImg ? (
              formik.values.groupImg.name?.substring(
                0,
                formik.values.groupImg.name?.lastIndexOf(".")
              )
            ) : (
              <>
                <span>Choose Group Photo</span>
                <FaUpload />
              </>
            )}
          </label>
          {formik.errors.groupImg ? (
            <small className="text-red-600 ml-0.5">
              {formik.errors.groupImg}
            </small>
          ) : null}
        </div>
        {/* form submit button */}
        <button
          type="submit"
          className="btn btn-sm w-full bg-[#3d429c] hover:bg-transparent text-white hover:text-[#3d429c] !border-[#3d429c] rounded normal-case"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default NewGroup;
