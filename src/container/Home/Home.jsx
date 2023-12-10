import React, { useState, useRef, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { client } from "../../client";
import { SideBar, UserProfile } from "../../components";
import Pins from "../Home/Pins";
import { logo } from "../../assets";
import { userQuery } from "../../utils/data";
import {userData} from "../../utils/fetchUser";

const Home = () => {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = userData();

  const { sub: uid } = userInfo ?? { sub: null };
  
  useEffect(() => {
    const query = userQuery(uid);
    client.fetch(query).then((res) => {
      console.log(res);
      setUser(res[0]);
    });

    return () => {};
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
    return () => {};
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col transition-height duration-75 ease-out h-screen">
      <div className="hidden md:flex h-screen flex-initial">
        <SideBar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md ">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSideBar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>
        {toggleSideBar && (
          <div className="fixed w-4/5 bg-white overflow-y-auto h-screen shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={40}
                className="cursor-pointer"
                onClick={() => setToggleSideBar(false)}
              />
            </div>
            <SideBar user={user && user} closeToggle={setToggleSideBar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
