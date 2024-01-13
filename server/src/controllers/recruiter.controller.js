import { asyncHandler } from "../utils/asyncHandler.js"
import { Recruiter } from "../models/recruiter.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generateAccessAndRefreshToken = async ( recruiterId ) => {
    try {

        const recruiter = await Recruiter.findById(recruiterId)

        const accessToken = recruiter.generateAccessToken()

        const refreshToken = recruiter.generateRefreshToken()

        recruiter.refreshToken = refreshToken

        await recruiter.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerRecruiter = asyncHandler ( async (req, res) => {

    const {name, email, password, mobileNumber, companyName} = req.body

    console.log(name, email, password, mobileNumber, companyName);

    if([name, email, password, companyName].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Recruiter.findOne({ email: email })

    if(existedUser) throw new ApiError(409, "User already exists")

    const newRecruiter = await Recruiter.create({
        name,
        email,
        password,
        mobileNumber,
        companyName
    })

    const createdRecruiter = await Recruiter.findById(newRecruiter._id).select("-password -refreshToken")

    if(!createdRecruiter) throw new ApiError(500, "Something went wrong while registering a new Recruiter")

    return res.status(200).json(
        new ApiResponse(200, createdRecruiter.email, createdRecruiter, "Recruiter registration completed successfully")
    )

})

const loginRecruiter = asyncHandler ( async(req, res) => {
    const { email, password } = req.body

    if(!email || !password) throw new ApiError(400, "Email or Password is required")

    const recruiter = await Recruiter.findOne({email: email})

    if(!recruiter) throw new ApiError(404, "Recruiter does not exist")

    const isPasswordCorrect = await recruiter.isPasswordCorrect(password)

    if(!isPasswordCorrect) throw new ApiError(401, "Invalid credentials")

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(recruiter._id)

    const loggerdInRecruiter = Recruiter.findById(recruiter._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {recruiter: recruiter, accessToken, refreshToken}, 
            "User logged in successfully"
        )
    )
})

const changeCurrentRecruiterPassword = asyncHandler ( async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const recruiter = await Recruiter.findById(req.recruiter?._id)

    const isPasswordCorrect = await recruiter.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid old password")

    recruiter.password = newPassword

    await recruiter.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Password updated successfully")
    )
})

const logoutRecruiter = asyncHandler ( async (req, res) => {
    await Recruiter.findByIdAndUpdate(
        req.recruiter?._id,
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
    .json(new ApiResponse(200, {}, "Recruiter logged out"))
})

// TODO: This should take necessary arguments and update the document partially based on the given options 
const updateRecruiterProfile = asyncHandler ( async (req, res) => {

    const { name, mobileNumber, companyName, profilePicture } = req.body
    
    if(!name || !mobileNumber || !profilePicture || !companyName) {
        throw new ApiError(400, "All fields are required")
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
        req.recruiter?._id,
        {
            $set: {
                name,
                mobileNumber,
                profilePicture,
                companyName
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, recruiter, "Account details updated successfully")
    )
})

const updateRecruiterAvatar = asyncHandler ( async (req, res) => {

    const avatarLocalPath = req.file?.path

    if( !avatarLocalPath ) {
        throw new ApiError(400, "Avatar is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if( !avatar ) {
        throw new ApiError(500, "Error while uploading avatar")
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
        req.recruiter?._id,
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
        new ApiResponse(200, recruiter, "Avatar updated successfully")
    )
})


export {
    registerRecruiter,
    loginRecruiter,
    changeCurrentRecruiterPassword,
    logoutRecruiter,
    updateRecruiterProfile,
    updateRecruiterAvatar
}