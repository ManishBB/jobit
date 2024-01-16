import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        skillsRequired: {
            type: Array,
        },
        company: {
            type: String,
            required: true
        },
        companyLogo: {
            type: String,
        },
        aboutCompany: {
            type: String,
            required: true
        },
        additionalInfo: {
            type: String,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "Recruiter"
        }
    },
    {
        timestamps: true
    }
)


export const Job = mongoose.model('Job', jobSchema)