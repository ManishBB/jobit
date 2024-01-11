import { Router } from 'express';
import { loginRecruiter, registerRecruiter } from '../controllers/recruiter.controller.js';

const router = Router()

router.route("/register").post(registerRecruiter)
router.route("/login").post(loginRecruiter)


export default router;