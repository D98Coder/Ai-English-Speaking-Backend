// import testService from "../services/test.service.js";
// import AppError from "../utils/AppError.js";
// import {
//     createTestSchema,
//     getTestsQuerySchema,
//     submitTestSchema,
//     updateTestSchema,
// } from "../validations/test.validation.js";

// /**
//  * Create new test (Admin only)
//  */
// export const createTest = async (req, res, next) => {
//   try {
//     const { error } = createTestSchema.validate(req.body);
//     if (error) {
//       throw new AppError(error.details[0].message, 400);
//     }

//     const test = await testService.createTest(req.body);

//     res.status(201).json({
//       success: true,
//       message: "Test created successfully",
//       data: test,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Get all tests with filters
//  */
// export const getTests = async (req, res, next) => {
//   try {
//     const { error, value } = getTestsQuerySchema.validate(req.query);
//     if (error) {
//       throw new AppError(error.details[0].message, 400);
//     }

//     const { level, isActive, page = 1, limit = 10 } = value;

//     const result = await testService.getTests(
//       { level, isActive },
//       parseInt(page),
//       parseInt(limit),
//     );

//     res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Get test by ID
//  */
// export const getTestById = async (req, res, next) => {
//   try {
//     const { testId } = req.params;
//     const isAdmin = req.user.role === "admin";

//     const test = await testService.getTestById(testId, req.user._id, isAdmin);

//     res.status(200).json({
//       success: true,
//       data: test,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Update test (Admin only)
//  */
// export const updateTest = async (req, res, next) => {
//   try {
//     const { error } = updateTestSchema.validate(req.body);
//     if (error) {
//       throw new AppError(error.details[0].message, 400);
//     }

//     const { testId } = req.params;
//     const test = await testService.updateTest(testId, req.body);

//     res.status(200).json({
//       success: true,
//       message: "Test updated successfully",
//       data: test,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Delete test (Admin only)
//  */
// export const deleteTest = async (req, res, next) => {
//   try {
//     const { testId } = req.params;
//     await testService.deleteTest(testId);

//     res.status(200).json({
//       success: true,
//       message: "Test deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Submit test answers
//  */
// export const submitTest = async (req, res, next) => {
//   try {
//     const { error } = submitTestSchema.validate(req.body);
//     if (error) {
//       throw new AppError(error.details[0].message, 400);
//     }

//     const { testId, answers, timeSpent } = req.body;
//     const result = await testService.submitTest(
//       req.user._id,
//       testId,
//       answers,
//       timeSpent,
//     );

//     res.status(200).json({
//       success: true,
//       message: "Test submitted successfully",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Get user's test results
//  */
// export const getUserResults = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const results = await testService.getUserResults(
//       req.user._id,
//       parseInt(page),
//       parseInt(limit),
//     );

//     res.status(200).json({
//       success: true,
//       ...results,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Get test statistics (Admin only)
//  */
// export const getTestStatistics = async (req, res, next) => {
//   try {
//     const { testId } = req.params;
//     const statistics = await testService.getTestStatistics(testId);

//     res.status(200).json({
//       success: true,
//       data: statistics,
//     });
//   } catch (error) {
//     next(error);
//   }
// };




// Mock tests data
const tests = [
  {
    _id: '1',
    title: 'Basic Grammar Test',
    description: 'Test your basic English grammar skills',
    level: 'basic',
    timeLimit: 30,
    questions: [
      {
        questionText: 'I ___ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 0,
        points: 1
      },
      {
        questionText: 'She ___ playing piano.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'They ___ watching TV now.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 2,
        points: 1
      },
      {
        questionText: '___ you like ice cream?',
        options: ['Does', 'Do', 'Is', 'Are'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'He ___ to the park yesterday.',
        options: ['go', 'goes', 'went', 'going'],
        correctAnswer: 2,
        points: 1
      }
    ]
  },
  {
    _id: '2',
    title: 'Intermediate Grammar Test',
    description: 'Test your intermediate English grammar skills',
    level: 'intermediate',
    timeLimit: 30,
    questions: [
      {
        questionText: 'If I ___ you, I would study harder.',
        options: ['was', 'were', 'am', 'is'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'She ___ already finished her homework.',
        options: ['has', 'have', 'is', 'are'],
        correctAnswer: 0,
        points: 1
      },
      {
        questionText: 'They have been waiting ___ 2 hours.',
        options: ['since', 'for', 'from', 'during'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: "I'm looking forward ___ you again.",
        options: ['to see', 'to seeing', 'seeing', 'see'],
        correctAnswer: 1,
        points: 1
      },
      {
        questionText: 'The movie was ___ than I expected.',
        options: ['good', 'well', 'better', 'best'],
        correctAnswer: 2,
        points: 1
      }
    ]
  }
];

const results = [];

export const getTests = async (req, res) => {
  try {
    const userTests = tests.map(test => ({
      ...test,
      questions: test.questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        points: q.points
      }))
    }));
    
    res.json({ success: true, tests: userTests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = tests.find(t => t._id === req.params.testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const { testId, answers, timeSpent } = req.body;
    
    const test = tests.find(t => t._id === testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    
    let score = 0;
    const details = [];
    
    answers.forEach(answer => {
      const question = test.questions[answer.questionIndex];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score += question.points;
      
      details.push({
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      });
    });
    
    const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    
    const result = {
      _id: Date.now().toString(),
      user: req.user._id,
      test: testId,
      score,
      percentage,
      details,
      completedAt: new Date()
    };
    
    results.push(result);
    
    res.json({
      success: true,
      data: {
        score: percentage,
        totalQuestions: test.questions.length,
        correctAnswers: details.filter(d => d.isCorrect).length,
        details
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const userResults = results.filter(r => r.user === req.user._id);
    res.json({ success: true, results: userResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};