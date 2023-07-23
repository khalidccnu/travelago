import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.config.js";

// initialize authentication provider
export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isUserLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);

  // create user in db
  const createUser = async (userId, values) => {
    if (values.phone) {
      values.phone = "+880" + values.phone;
      delete values.password;

      const formData = new FormData();
      formData.append("userImg", values.userImg);

      await axios
        .post(`${import.meta.env.VITE_API_URL}/users/upload-ui`, formData)
        .then((response) => (values.userImg = response.data.filePath));
    }

    return await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
      _id: userId,
      ...values,
    });
  };

  // get user authentication from firebase
  const signInWithEP = async (email, password) => {
    setUserLoading(true);

    return await signInWithEmailAndPassword(auth, email, password);
  };

  // get user google account authentication from firebase
  const signInWithGoogle = async (_) => {
    setUserLoading(true);

    return await signInWithPopup(auth, googleProvider).then((userCred) =>
      createUser(userCred.user.uid, {
        email: userCred.user.email,
        fullName: userCred.user.displayName,
        userImg: userCred.user.photoURL,
      })
    );
  };

  // create user in firebase
  const createUserWithEP = async (values) => {
    setUserLoading(true);
    const { email, password } = values;

    return await createUserWithEmailAndPassword(auth, email, password).then(
      (userCred) => createUser(userCred.user.uid, values)
    );
  };

  // user logout
  const logOut = async (_) => await signOut(auth);

  // initialize authentication info
  const authInfo = {
    isUserLoading,
    setUserLoading,
    user,
    signInWithEP,
    signInWithGoogle,
    createUserWithEP,
    logOut,
  };

  useEffect(() => {
    // change state form sign-in to sign-out or vice-versa
    const authChange = onAuthStateChanged(auth, async (userCred) => {
      if (userCred) {
        setUser(userCred);

        // get jwt token from server
        await axios
          .post(`${import.meta.env.VITE_API_URL}/jwt`, { _id: userCred.uid })
          .then((response) => localStorage.setItem("_at", response.data));
      } else {
        setUser(null);
        localStorage.removeItem("_at");
      }

      setUserLoading(false);
    });

    return () => authChange();
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
