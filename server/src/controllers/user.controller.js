// TODO: Login
// TODO: Register
// TODO: Logout
// TODO: Update Profile
// TODO: Change Profile Picture
// TODO: Change Password

// TODO: Apply Job
// TODO: View Applied Jobs
// TODO: Search Jobs based on skills

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}

const registerUser = asyncHandler ( async (req, res) => {
    const { name, email, password, mobileNumber, profilePicture} = req.body

    if([name, email, password, mobileNumber].some( (field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email: email})

    if( existedUser ) throw new ApiError(409, "User already exists")

    const newUser = await User.create({
        name,
        email,
        password,
        mobileNumber
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

    if(!createdUser) throw new ApiError(500, "Something went wrong while creating a new user")

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler( async (req, res) => {

    const {email, password} = req.body

    if(!email || !password) throw new ApiError(403, "Invalid email or password")

    const user = await User.findOne({email: email})

    if(!user) throw new ApiError(404, "User not found")

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect) throw new ApiError(401, "Invalid credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in successfully")
    )
})

const changeCurrentUserPassword = asyncHandler ( async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid old password")

    user.password = newPassword

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Password updated successfully")
    )
})

const logoutUser = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const updateUserProfile = asyncHandler ( async (req, res) => {

    const { name, mobileNumber, profilePicture, resume } = req.body
    
    if(!name || !mobileNumber || !profilePicture || !resume) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                mobileNumber,
                profilePicture,
                resume
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})

const updateUserResume = asyncHandler ( async (req, res) => {

    const resumeLocalPath = req.file?.path

    if( !resumeLocalPath ) {
        throw new ApiError(400, "Resume is missing")
    }

    const resume = await uploadOnCloudinary(resumeLocalPath)

    if( !resume ) {
        throw new ApiError(500, "Error while uploading resume")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                resume: resume.url
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Resume updated successfully")
    )

})

const updateUserAvatar = asyncHandler ( async (req, res) => {

    const avatarLocalPath = req.file?.path

    if( !avatarLocalPath ) {
        throw new ApiError(400, "Avatar is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if( !avatar ) {
        throw new ApiError(500, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profilePicture: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
})


export{
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentUserPassword,
    updateUserProfile,
    updateUserResume,
    updateUserAvatar
}