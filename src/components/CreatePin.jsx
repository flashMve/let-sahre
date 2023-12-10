import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../client";

import { MdDelete } from "react-icons/md";
import { MdSave } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";

import Spinner from "../components/Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/jpeg" ||
      type === "image/png" ||
      type === "image/svg+xml" ||
      type === "image/jpg"
    ) {
      setWrongImageType(false);
      setLoading(true);
      const file = e.target.files[0];

      client.assets
        .upload("image", file, {
          contentType: type,
          filename: name,
        })
        .then((doc) => {
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error in uploading image");
          setLoading(false);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const handleSave = () => {
   if(title && about && destination && category && imageAsset?._id){
    setLoading(true);
    setFields(false);
    const doc = {
      _type: 'pin',
      title,
      about,
      destination,
      category,
      image:{
        _type:'image',
        asset:{_type:"reference",_ref:imageAsset._id,},
      },
      userId:user._id,
      postedBy:{
        _type:'postedBy',
        _ref:user._id,
      }
    }

    client.create(doc).then((res)=>{
      setLoading(false);
      navigate('/');
    });
  }else{
    setFields(true);
    setTimeout(()=>setFields(false),3000);
  }
  };

  return (
    <div className="relative flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="absolute bg-red-500 shadow-lg px-4 py-3 rounded-md text-white  translate-y-[-50%] text-xl transition-all duration-150 ease-in">
          Please Enter all the fields.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-grey-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-red-500 text-xl mb-5 transition-all duration-150 ease-in">
                Wrong Image Type.
              </p>
            )}
            {!imageAsset ? (
              <label>
                <div className="cursor-pointer flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to Upload Image.</p>
                    <p className="mt-2 text-gray-400">
                      Use High Quality Image. i.e JPG, PNG, JPEG, SVG etc.
                    </p>
                    <input
                      type="file"
                      name="upload_image"
                      className="w-0 h-0"
                      onChange={uploadImage}
                    />
                  </div>
                </div>
              </label>
            ) : (
              <div className="h-full relative">
                <img
                  src={imageAsset?.url}
                  alt="uploaded file"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 bg-white rounded-full text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add Your Pin Title"
            className="outline-none text-2xl sm:text-lg bg-gray-100 focus:bg-gray-200 px-4 py-[0.5rem] rounded-[0.19rem]"
          />
          {user && (
            <div className="flex justify-between gap-2 my-2 items-center bg-white rounded-full">
              <div className="flex items-center flex-1 justify-start">
                <img
                  src={user?.image}
                  alt="user pic"
                  className="w-10 h-10 rounded-full"
                />
                <p className="px-4 font-bold">{user?.username}</p>
              </div>
              <p className="font-extrabold pr-4">Author</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your Pin about?"
            className="outline-none text-2xl sm:text-lg bg-gray-100 focus:bg-gray-200 px-4 py-[0.5rem] rounded-[0.19rem]"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-2xl sm:text-lg  bg-gray-100 focus:bg-gray-200 px-4 py-[0.5rem] rounded-[0.19rem]"
          />

          <div className="flex flex-col">
            <div>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="cursor-pointer outline-none border-none w-full bg-gray-100 capitalize font-semibold text-md p-3 rounded-[0.19rem] focus:bg-gray-100"
              >
                <option value="other" name="other">
                  select category
                </option>
                {categories.map((category) => (
                  <option value={category.name}> {category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="flex justify-center items-center bg-red-500 text-white font-bold text-lg text-center p-2 px-4 rounded-full mt-5"
              >
                <MdSave className="mx-2"/>
                Create Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
