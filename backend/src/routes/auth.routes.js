// import express from "express";
// import { login, signup } from "../controllers/auth.controller.js";
// import { authLimiter } from "../middleware/rateLimiter.middleware.js";
// import validate from "../middleware/validation.middleware.js";
// import { loginSchema, signupSchema } from "../validations/auth.validation.js";

// const router = express.Router();

// router.post("/signup", authLimiter, validate(signupSchema), signup);
// router.post("/login", authLimiter, validate(loginSchema), login);

// export default router;




import express from 'express';
import { login, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;