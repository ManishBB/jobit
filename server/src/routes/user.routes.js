import { Router } from 'express'
import { changeCurrentUserPassword, loginUser, logoutUser, registerUser, updateUserAvatar, updateUserProfile, updateUserResume } from '../controllers/user.controller.js'
import { verifyUserJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'


const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyUserJWT, logoutUser)
router.route('/change-password').post(verifyUserJWT, changeCurrentUserPassword);

router.route('update-account').patch(verifyUserJWT, updateUserProfile)
router.route('/update-resume').patch(verifyUserJWT, upload.single('resume'), updateUserResume)
router.route("/avatar").patch(verifyUserJWT, upload.single("avatar"), updateUserAvatar)

// TODO: Apply Job
// TODO: View Applied Jobs
// TODO: Search Jobs based on skills


export default router