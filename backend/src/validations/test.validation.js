import Joi from 'joi';

export const createTestSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  level: Joi.string().valid('basic', 'intermediate', 'advanced').required(),
  questions: Joi.array().items(
    Joi.object({
      questionText: Joi.string().required(),
      options: Joi.array().items(Joi.string()).length(4).required(),
      correctAnswer: Joi.number().min(0).max(3).required(),
      explanation: Joi.string(),
      points: Joi.number().min(1).max(10).default(1)
    })
  ).min(1).max(50).required(),
  timeLimit: Joi.number().min(5).max(120).default(30),
  isActive: Joi.boolean().default(true)
});

export const updateTestSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  level: Joi.string().valid('basic', 'intermediate', 'advanced'),
  questions: Joi.array().items(
    Joi.object({
      questionText: Joi.string(),
      options: Joi.array().items(Joi.string()).length(4),
      correctAnswer: Joi.number().min(0).max(3),
      explanation: Joi.string(),
      points: Joi.number().min(1).max(10)
    })
  ).min(1).max(50),
  timeLimit: Joi.number().min(5).max(120),
  isActive: Joi.boolean()
});

export const submitTestSchema = Joi.object({
  testId: Joi.string().required(),
  answers: Joi.array().items(
    Joi.object({
      questionIndex: Joi.number().required(),
      selectedAnswer: Joi.number().min(0).max(3).required()
    })
  ).required(),
  timeSpent: Joi.number().min(0).default(0)
});

export const getTestsQuerySchema = Joi.object({
  level: Joi.string().valid('basic', 'intermediate', 'advanced'),
  isActive: Joi.boolean(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sortBy: Joi.string().valid('createdAt', 'title', 'level'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});