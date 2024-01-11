import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async (req, res) => {
    
    const { name, email, password, mobileNumber } = req.body
    console.log(name, email, password, mobileNumber);
    return res
})

export { registerUser }