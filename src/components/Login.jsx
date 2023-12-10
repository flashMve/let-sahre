import React from "react";
import {GoogleLogin} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {share} from "../assets";
import {logowhite as logo} from "../assets";
import jwt_decode from 'jwt-decode';
import {client} from '../client.js';

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response)=>{
    const decoded = jwt_decode(response.credential);
    
    localStorage.setItem('user',JSON.stringify(decoded));
     
    
    const {name,picture:image,sub:uid} = decoded;

    const doc = {
      _id:uid,
      _type:'user',
      username:name,
      image:image,
    };


    client.createIfNotExists(doc)
    .then((res)=>{
      navigate('/',{replace:true});
    });

  };
  return (
    <div className="flex justify-start items-center h-screen flex-col">
      <div className="relative w-full h-full">
        <video
          src={share}
          type="video/mp4"
          loop={true}
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 absolute bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy='single_host_origin'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
