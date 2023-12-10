import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { client, urlFor } from "../client";
import { v4 as uuidv4 } from "uuid";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { userData } from "../utils/fetchUser";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { sub: uid } = userData() ?? { sub: null };
  const fetchPin = () => {
    const pinQuery = pinDetailQuery(pinId);
    client.fetch(pinQuery).then((data) => {
      setPinDetail(data[0]);
      if (data[0]) {
        const morePinQuery = pinDetailMorePinQuery(data[0]);
        client.fetch(morePinQuery).then((data) => {
          setPins(data);
        });
      }
    });
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              userId: uid,
            },
          },
        ])
        .commit()
        .then((data) => {
          fetchPin();
          setComment("");
          setAddingComment(false);
          window.location.reload();
        });
    }
  };

  useEffect(() => {
    fetchPin();
    return () => {};
  }, [pinId]);

  if (!pinDetail) return <Spinner message={"Loading Pin..."} />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col bg-white m-auto"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image)}
            alt={pinDetail?.title + "user-post"}
            className=" lg:h-full lg:object-cover rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-full w-7 h-7 flex justify-center items-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetail?.destination}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {pinDetail?.destination.slice(0, 50) + "..."}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail?.title}
            </h1>
            <p className="mt-3">{pinDetail?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="px-1 flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetail?.postedBy?.image}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibol text-sm capitalize">
              {pinDetail?.postedBy?.username}
            </p>
          </Link>

          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg "
                key={i}
              >
                <img
                  src={comment?.postedBy?.image}
                  alt={comment?.postedBy?.image + " user-comment"}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment?.postedBy?.username}</p>
                  <p>{comment?.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {user && (
          <div className="flex gap-3 m-4 items-center justify-center flex-wrap mt-6">
            <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className="bg-white rounded-lg">
              <img
                src={pinDetail?.postedBy?.image}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="flex-1 outline-none text-2xl sm:text-lg bg-gray-100 focus:bg-gray-200 px-4 py-[0.5rem] rounded-[0.19rem]"
            />
            <button
              type="button"
              onClick={addComment}
              className="bg-red-500 text-white px-4 py-[0.5rem] rounded-[0.19rem] text-xl sm:text-lg"
            >
              {addingComment ? "Posting" : "Post"}
            </button>
          </div>
        )}
      </div>
      <div className="mt-7">
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2x mt-8 mb-4"></h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message={"Loading More Pins Like This..."} />
      )}
      </div>
    </>
  );
};

export default PinDetail;
