import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from 'jwt-decode';
import {client} from '../client.js';

const NavBar = ({ searchTerm, setsearchTerm, user }) => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const decoded = jwt_decode(response.credential);

    localStorage.setItem("user", JSON.stringify(decoded));

    const { name, picture: image, sub: uid } = decoded;

    const doc = {
      _id: uid,
      _type: "user",
      username: name,
      image: image,
    };

    client.createIfNotExists(doc).then((res) => {
      navigate("/", { replace: true });
      window.location.reload();
    });
  };
  return (
    <div className="flex gap-2 md:gap-2 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setsearchTerm(e.target.value)}
          value={searchTerm}
          className="p-2 w-full bg-white outline-none  "
          placeholder="Search"
          onFocus={() => navigate("/search")}
        />
      </div>
      {user ? (
        <div className="flex gap-2">
          <Link to={`/user-profile/${user?._id}`} className="hidden md:block">
            <img
              src={user?.image}
              alt="user profile"
              className="w-14 h-12 rounded-lg"
            />
          </Link>
          <Link to={"create-pin"}>
            <IoMdAdd className="bg-[#00BFFF] p-3 text-white rounded-lg w-14 h-12 md:w-12 md:h-12 flex justify-center items-center" />
          </Link>
        </div>
      ) : (
        <div className="border-none outline-non">
          <GoogleLogin
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            shape="square"
            cookiePolicy="single_host_origin"
          />
        </div>
      )}
    </div>
  );
};

export default NavBar;
