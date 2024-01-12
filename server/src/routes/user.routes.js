import { Router } from 'express'
import { changeCurrentUserPassword, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { verifyUserJWT } from '../middlewares/auth.middleware.js'


const router = Router()

// TODO: Register
router.route('/register').post(registerUser)
// TODO: Login
router.route('/login').post(loginUser)
// TODO: Logout
router.route('/logout').post(verifyUserJWT, logoutUser)
// TODO: Change Password
router.route('/change-password').post(verifyUserJWT, changeCurrentUserPassword);

// TODO: Update Profile
// TODO: Change Profile Picture

// TODO: Apply Job
// TODO: View Applied Jobs
// TODO: Search Jobs based on skills


export default router