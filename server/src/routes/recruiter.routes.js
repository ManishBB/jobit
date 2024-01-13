import { Router } from 'express';
import { changeCurrentRecruiterPassword, loginRecruiter, logoutRecruiter, registerRecruiter, updateRecruiterAvatar, updateRecruiterProfile } from '../controllers/recruiter.controller.js';
import { verifyRecruiterJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router()

router.route("/register").post(registerRecruiter)
router.route("/login").post(loginRecruiter)
router.route("/logout").post(verifyRecruiterJWT, logoutRecruiter)
router.route("/change-password").post(verifyRecruiterJWT, changeCurrentRecruiterPassword)

router.route("/update-account").patch(verifyRecruiterJWT, updateRecruiterProfile)
router.route("/update-avatar").patch(verifyRecruiterJWT, upload.single("avatar"), updateRecruiterAvatar)

// TODO: Create new Job
// TODO: Edit Job
// TODO: Delete Job

// TODO: View Posted Jobs
// TODO: View Specific posted jobs
// TODO: View Applications
// TODO: View Applicant's Profile
// TODO: 
// TODO:
// TODO:
// TODO:


export default router;