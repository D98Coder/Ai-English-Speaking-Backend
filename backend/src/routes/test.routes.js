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
