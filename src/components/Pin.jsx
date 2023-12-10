import React, { useState } from "react";
import { client, urlFor } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { userData } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, title, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const { sub: uid } = userData() ?? {sub: null};
  
  const alreadySaved =
    !!(save?.filter((item) => item.postedBy._id === uid))?.length;
  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: uid,
            postedBy: {
              _type: "postedBy",
              _ref: uid,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg overflow-hidden rounded-lg transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt={title}
          src={urlFor(image)?.width(300).url()}
        />
        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-full w-7 h-7 flex justify-center items-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  className="bg-red-600 rounded-3xl flex justify-center items-center text-white py-1 px-5 text-base font-bold opacity-50 hover:shadow-md hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  className="bg-red-600 rounded-3xl flex justify-center items-center text-white py-1 px-5 text-sm font-bold opacity-50 hover:shadow-md hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  {save?.length} Save
                </button>
              )}
            </div>
            <div className="flex w-full justify-between items-center gap-2">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex justify-center items-center bg-white gap-2 text-black text-sm p-2 pl-4 pr-4 opacity-60 hover:opacity-100 hover:shadow-md rounded-full"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination?.slice(8, 28) + "..."
                    : destination?.slice(8)}
                </a>
              )}
              {postedBy._id === uid && (
                <button
                  type="button"
                  className="bg-white p-2 rounded-3xl flex justify-center items-center text-black text-sm opacity-50 hover:shadow-md hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`user-profile/${uid}`}
      className='px-1 flex gap-2 mt-2 items-center'>
        <img 
        src={postedBy?.image}
        className='w-8 h-8 rounded-full object-cover'
        />
        <p className='font-semibol text-sm capitalize'>{postedBy?.username}</p>
      </Link>
    </div>
  );
};

export default Pin;
