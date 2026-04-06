import crypto from 'crypto';

/**
 * Generate a random OTP
 * @param {number} length - Length of OTP
 * @returns {string} - Generated OTP
 */
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Generate a random token
 * @param {number} length - Length of token
 * @returns {string} - Generated token
 */
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Calculate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} - Pagination metadata
 */
export const paginate = (page = 1, limit = 10, total = 0) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  const totalPages = Math.ceil(total / limitNum);

  return {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
    startIndex,
    endIndex,
    hasNext: endIndex < total,
    hasPrev: startIndex > 0
  };
};

/**
 * Format response data
 * @param {boolean} success - Success status
 * @param {any} data - Response data
 * @param {string} message - Response message
 * @returns {object} - Formatted response
 */
export const formatResponse = (success, data = null, message = '') => {
  return {
    success,
    ...(message && { message }),
    ...(data && { data })
  };
};

/**
 * Calculate test score
 * @param {array} questions - Test questions
 * @param {array} answers - User answers
 * @returns {object} - Score details
 */
export const calculateScore = (questions, answers) => {
  let totalPoints = 0;
  let earnedPoints = 0;
  const answerDetails = [];

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const points = isCorrect ? question.points : 0;
    
    totalPoints += question.points;
    earnedPoints += points;
    
    answerDetails.push({
      questionIndex: index,
      selectedAnswer: userAnswer,
      isCorrect,
      pointsEarned: points
    });
  });

  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  return {
    score: earnedPoints,
    totalPoints,
    percentage: Math.round(percentage * 100) / 100,
    answerDetails
  };
};

/**
 * Sanitize user data (remove sensitive fields)
 * @param {object} user - User object
 * @returns {object} - Sanitized user object
 */
export const sanitizeUser = (user) => {
  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  delete sanitized.__v;
  return sanitized;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after sleep
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};