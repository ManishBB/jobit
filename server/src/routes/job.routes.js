import { Router } from "express";
import { addCompanyLogo, createJob, deleteJob, updateJob } from "../controllers/job.controller.js";
import { verifyRecruiterJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-job").post(verifyRecruiterJWT, createJob)
// TODO: Edit Job
router.route("/update-job").patch(verifyRecruiterJWT, updateJob)
// TODO: Delete Job
router.route("/delete-job").delete(verifyRecruiterJWT, deleteJob)
// TODO: Add Company logo
router.route("/add-company-logo").post(verifyRecruiterJWT, upload.single("companyLogo"), addCompanyLogo)

export default router;