import React from "react";
import { useFormik } from "formik";
import { FaGoogle } from "react-icons/fa";
import Signup from "./Signup.jsx";

const Signin = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      const { email, password } = values;
    },
  });

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-7 items-center py-10 sm:py-24`}
    >
      {/* brand identity */}
      <div className={`max-w-sm mx-auto`}>
        {/* brand logo */}
        <figure className={`w-full sm:w-72`}>
          <img src="/lg-travelago.png" alt="travelago" />
        </figure>
        {/* brand motto */}
        <h1 className={`text-xl font-semibold text-center sm:text-start mt-4`}>
          Connect with travelers community and know different places.
        </h1>
      </div>
      {/* sign-in form */}
      <div className="card sm:max-w-sm sm:mx-auto bg-base-100 shadow-2xl">
        <div className="card-body">
          <form className="form-control gap-y-4" onSubmit={formik.handleSubmit}>
            {/* email input box */}
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="input input-sm bg-transparent text-[#3d429c] w-full px-0 border-0 border-b border-b-[#3d429c] rounded-none focus:outline-0"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {/* password input box */}
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="input input-sm bg-transparent text-[#3d429c] w-full px-0 border-0 border-b border-b-[#3d429c] rounded-none focus:outline-0"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {/* form submit button */}
            <button
              type="submit"
              className="btn btn-sm w-full bg-[#3d429c] hover:bg-transparent text-white hover:text-[#3d429c] !border-[#3d429c] rounded normal-case"
            >
              Login
            </button>
            {/* new user sign-up modal invoke */}
            <div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-2">
              <span>New to Travelago?</span>
              <span
                className="text-[#3d429c] w-fit cursor-pointer"
                onClick={() => window.signup_modal.showModal()}
              >
                Create New Account
              </span>
            </div>
            <div className="divider">or</div>
            {/* google authentication method */}
            <div className="flex justify-center items-center p-2 border hover:text-[#3d429c] cursor-pointer space-x-2 transition-[color] duration-500">
              <FaGoogle className="text-xl" />
              <span>Continue with Google</span>
            </div>
          </form>
        </div>
      </div>
      {/* new user sign-up modal declaration */}
      <dialog id="signup_modal" className="modal">
        <Signup />
      </dialog>
    </div>
  );
};

export default Signin;
