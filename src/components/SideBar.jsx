import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { categories } from "../utils/data";
import { logo } from "../assets";

const isNotActiveStyle =
  "flex items-center mt-4 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center mt-4 px-5 gap-3 font-extrabold border-r-4 border-black transition-all duration-200 ease-in-out capitalize";

const SideBar = ({user, closeToggle}) => {
  const handleSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between bg-white overflow-y-scroll min-w-210 h-screen hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleSidebar}
        >
          <img src={logo} alt="logo" className="w-full cursor-pointer" />
        </Link>
        <div className="flex mt-3 flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle+' px-5'
            }
            onClick={handleSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
        </div>

        <h1 className="mt-4 px-5 text-base 2xl:text-xl">
          Discover Categories
          {categories.slice(0, categories.length - 1).map((category, index) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              key={index + category.name}
              onClick={handleSidebar}
            >
              <img src={category.image} alt={category.name} className='rounded-full w-8 h-8' />
              {category.name}
            </NavLink>
          ))}
        </h1>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex  my-5 mb-3 gap-2 p-2 mx-3 items-center bg-white rounded-lg shadow-lg"
          onClick={handleSidebar}
        >
          <img
            src={user?.image}
            alt="user-profile"
            className="w-10 h-10 rounded-full"
          />
          <p className="text-sm">{user?.username}</p>
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
};

export default SideBar;
