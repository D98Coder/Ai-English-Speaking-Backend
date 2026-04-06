// import express from "express";
// import {
//     createTest,
//     deleteTest,
//     getTestById,
//     getTests,
//     getTestStatistics,
//     getUserResults,
//     submitTest,
//     updateTest,
// } from "../controllers/test.controller.js";
// import { protect, restrictTo } from "../middleware/auth.middleware.js";
// import validate from "../middleware/validation.middleware.js";
// import {
//     createTestSchema,
//     submitTestSchema,
//     updateTestSchema,
// } from "../validations/test.validation.js";

// const router = express.Router();

// // Public test routes (authenticated users)
// router.use(protect);

// // Test submission and results
// router.post("/submit", validate(submitTestSchema), submitTest);
// router.get("/results", getUserResults);

// // Test listing and details
// router.get("/", getTests);
// router.get("/:testId", getTestById);

// // Admin only routes
// router.use(restrictTo("admin"));

// router.post("/", validate(createTestSchema), createTest);
// router.put("/:testId", validate(updateTestSchema), updateTest);
// router.delete("/:testId", deleteTest);
// router.get("/:testId/statistics", getTestStatistics);

// export default router;





import express from 'express';
import {
    getTestById,
    getTests,
    getUserResults,
    submitTest
} from '../controllers/test.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTests);
router.get('/:testId', getTestById);
router.post('/submit', submitTest);
router.get('/results/my', getUserResults);

export default router;