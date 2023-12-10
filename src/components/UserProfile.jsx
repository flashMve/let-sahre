import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import { client } from "../client";
import {
  userQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
} from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage = "https://source.unsplash.com/1600x900/?nature,water";
const activeBtnStyle = "bg-red-500 text-white rounded-md px-4 py-2 m-2";
const notActiveBtnStyle =
  "bg-white rounded-md px-4 py-2 m-2 hover:bg-red-500 hover:text-white";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
    return () => {};
  });

  useEffect(() => {
    if (text === "Created") {
      const query = userCreatedPinsQuery(userId);
      client.fetch(query).then((data) => {
        setPins(data);
      });
    } else {
      const query = userSavedPinsQuery(userId);
      client.fetch(query).then((data) => {
        setPins(data);
      });
    }
    return () => {};
  }, [text, userId]);

  if (!user) return <Spinner message={"Loading Profile"} />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="nature water"
              className="object-cover w-full h-370 2xl:h-510 shadow-lg"
            />
            <img
              src={user?.image}
              alt="user"
              className="rounded-full w-20 h-20 -mt-10 shadow-lg object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.username}
            </h1>
            <div className="absolute z-1 right-0 top-0 p-2 m-2 bg-white rounded-full text-red-900 opacity-70 hover:opacity-100 cursor-pointer">
              {user?._id === userId && (
                <AiOutlineLogout
                  className="text-2xl"
                  onClick={() => {
                    localStorage.removeItem("user");
                    googleLogout();
                    navigate("/");
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              className={`${
                activeBtn === "created" ? activeBtnStyle : notActiveBtnStyle
              }`}
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              type="button"
            >
              Created
            </button>

            <button
              className={`${
                activeBtn === "saved" ? activeBtnStyle : notActiveBtnStyle
              }`}
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              type="button"
            >
              Saved
            </button>
            {pins?.length > 0 ? (
              <MasonryLayout pins={pins} />
            ) : (
              <h1 className="text-2xl font-bold text-center mt-5">
                No {text} Pins Found
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
