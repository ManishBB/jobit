import { Router } from 'express';
import { loginRecruiter, registerRecruiter } from '../controllers/recruiter.controller.js';

const router = Router()

router.route("/register").post(registerRecruiter)
router.route("/login").post(loginRecruiter)

// TODO: Update Profile
// TODO: Reset Password

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