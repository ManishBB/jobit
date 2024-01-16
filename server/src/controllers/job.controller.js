import { asyncHandler } from "../utils/asyncHandler.js"
import { Job } from "../models/job.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createJob = asyncHandler ( async (req, res) => {

    const {title, description, salary, location, skillsRequired, company, companyLogo, aboutCompany, additionalInfo, postedBy} = req.body

    if( [title, description, salary, location].some((field) => field?.trim() === "") ){
        throw new ApiError(400, "Some fields are required")
    }

    const newJob = await Job.create({
        title,
        description,
        salary,
        location,
        skillsRequired, 
        company,
        companyLogo,
        aboutCompany,
        additionalInfo,
        postedBy: req.recruiter?._id
    })

    if(!newJob) throw new ApiError(500, "Something went wrong while posting a new Job")

    return res.status(200).json(
        new ApiResponse(200, newJob, "Job posted successfully")
    )

})

//  TODO: This should be done by EOD
const updateJob = asyncHandler ( async (req, res) => {
    const {jobId, title, description, salary, location, skillsRequired, company, companyLogo, aboutCompany, additionalInfo} = req.body

    const job = await Job.findByIdAndUpdate(
        jobId,
        {
            $set: {
                title, 
                description, 
                salary, 
                location, 
                skillsRequired, 
                company, 
                companyLogo, 
                aboutCompany, 
                additionalInfo
            }
        },
        { new: true }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, job, "Job details updated successfully")
    )

})

const deleteJob = asyncHandler ( async (req, res) => {

    const { jobId } = req.body

    await Job.findByIdAndDelete(jobId)

    return res.status(200).json(new ApiResponse(200, "",  "Job deleted successfully"))

})

const addCompanyLogo = asyncHandler ( async (req, res) => {

    const logoLocalPath = req.file?.path

    if( !logoLocalPath ) {
        throw new ApiError(400, "Logo is missing!")
    }

    const logo = await uploadOnCloudinary(logoLocalPath)

    if(!logo) {
        throw new ApiError(500, "Error while uploading logo!")
    }

    const { jobId } = req.body

    const job = await Job.findByIdAndUpdate(
        jobId,
        {
            $set: {
                companyLogo: logo.url
            }
        },
        { new: true }
    )

    return res.status(200).json( new ApiResponse(200, job, "Company logo added successfully"))

})

export {
    createJob,
    updateJob,
    deleteJob,
    addCompanyLogo
}