import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const recruiterSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        mobileNumber: {
            type: Number,
        },
        profilePicture: {
            type: String,
        },
        companyName: {
            type: String,
            required: [true, "Company Name is required"]
        },
        postedJobs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Job"
            }
        ] ,
        refreshToken: {
            type: String
        }   
    },
    {
        timestamps: true
    }
)

recruiterSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

recruiterSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

recruiterSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

recruiterSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Recruiter = mongoose.model('Recruiter', recruiterSchema)