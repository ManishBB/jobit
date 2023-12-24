import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
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
            required: [true, "Mobile Number is required"]
        },
        appliedJobs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Job"
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            name: this.name 
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return token
}

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign(
        { 
            _id: this._id,
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return token
}

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    return token
}

export const User = mongoose.model('User', userSchema)
