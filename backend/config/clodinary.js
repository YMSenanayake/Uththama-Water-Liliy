import {v2 as cloundinary } from "cloudinary"

const connectCloudinary = async ()=>{
    cloundinary.config({
        cloud_name:process.env.CLDN_NAME,
        api_key:process.env.CLDN_API_SECRET,
        api_secret:process.env.CLDN_API_SECRET,

    });
};

export default connectCloudinary;