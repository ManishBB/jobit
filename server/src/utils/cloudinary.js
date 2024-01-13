import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//TODO: To be research on how to upload image and pdf with specific resource types
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "raw"
        })

        //file has been successfully uploaded
        console.log("file has been successfully uploaded", response.url)
        
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) //removes locally saved temporary files as the upload operation got failed
        return null
    }
}

export { uploadOnCloudinary }