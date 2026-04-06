import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts
  message: 'Too many authentication attempts. Please try again after 15 minutes.'
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many requests. Please slow down.'
});