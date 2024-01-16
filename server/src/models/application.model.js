import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    job: {
        type: Schema.Types.ObjectId, 
        ref: "Job"
    },
}, {timestamps: true})

export const Application = mongoose.model('Application', applicationSchema);