import mongoose from "mongoose";

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
            required: true
        },
        aboutCompany: {
            type: String,
            required: true
        },
        additionalInfo: {
            type: String,
            required: true
        },
        postedBy: [
            {
            type: Schema.Types.ObjectId,
            ref: "Recruiter"
            }
        ],
        appliedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
)


export const Job = mongoose.model('Job', jobSchema)