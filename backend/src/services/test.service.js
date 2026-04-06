import Result from "../models/Result.model.js";
import Test from "../models/Test.model.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import { calculateScore } from "../utils/helpers.js";
import logger from "../utils/logger.js";

class TestService {
  /**
   * Create a new test
   */
  async createTest(testData) {
    try {
      const test = await Test.create(testData);
      logger.info(`Test created: ${test._id}`);
      return test;
    } catch (error) {
      logger.error("Create test error:", error);
      throw error;
    }
  }

  /**
   * Get all tests with filters
   */
  async getTests(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};

      if (filters.level) query.level = filters.level;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;

      const tests = await Test.find(query)
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-questions.correctAnswer"); // Don't send correct answers in list

      const total = await Test.countDocuments(query);

      return {
        tests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get tests error:", error);
      throw error;
    }
  }

  /**
   * Get test by ID (with answers for admin, without for users)
   */
  async getTestById(testId, userId = null, isAdmin = false) {
    try {
      const test = await Test.findById(testId);

      if (!test) {
        throw new AppError("Test not found", 404);
      }

      // If user is not admin, remove correct answers
      if (!isAdmin) {
        const testWithoutAnswers = test.toObject();
        testWithoutAnswers.questions = testWithoutAnswers.questions.map(
          (q) => ({
            ...q,
            correctAnswer: undefined,
          }),
        );
        return testWithoutAnswers;
      }

      return test;
    } catch (error) {
      logger.error("Get test by ID error:", error);
      throw error;
    }
  }

  /**
   * Update test
   */
  async updateTest(testId, updateData) {
    try {
      const test = await Test.findByIdAndUpdate(testId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!test) {
        throw new AppError("Test not found", 404);
      }

      logger.info(`Test updated: ${testId}`);
      return test;
    } catch (error) {
      logger.error("Update test error:", error);
      throw error;
    }
  }

  /**
   * Delete test
   */
  async deleteTest(testId) {
    try {
      const test = await Test.findByIdAndDelete(testId);

      if (!test) {
        throw new AppError("Test not found", 404);
      }

      // Also delete all results for this test
      await Result.deleteMany({ test: testId });

      logger.info(`Test deleted: ${testId}`);
      return test;
    } catch (error) {
      logger.error("Delete test error:", error);
      throw error;
    }
  }

  /**
   * Submit test answers and calculate score
   */
  async submitTest(userId, testId, answers, timeSpent = 0) {
    try {
      // Get test with correct answers
      const test = await Test.findById(testId);

      if (!test) {
        throw new AppError("Test not found", 404);
      }

      if (!test.isActive) {
        throw new AppError("This test is not available", 400);
      }

      // Check if user already submitted this test
      const existingResult = await Result.findOne({
        user: userId,
        test: testId,
      });
      if (existingResult) {
        throw new AppError("You have already taken this test", 400);
      }

      // Prepare answers array
      const formattedAnswers = new Array(test.questions.length).fill(null);
      answers.forEach((answer) => {
        if (
          answer.questionIndex >= 0 &&
          answer.questionIndex < test.questions.length
        ) {
          formattedAnswers[answer.questionIndex] = answer.selectedAnswer;
        }
      });

      // Calculate score
      const { score, totalPoints, percentage, answerDetails } = calculateScore(
        test.questions,
        formattedAnswers,
      );

      // Save result
      const result = await Result.create({
        user: userId,
        test: testId,
        answers: answerDetails,
        score,
        percentage,
        timeSpent,
      });

      // Update user's average score
      const userResults = await Result.find({ user: userId });
      const avgScore =
        userResults.reduce((sum, r) => sum + r.percentage, 0) /
        userResults.length;

      await User.findByIdAndUpdate(userId, {
        averageScore: Math.round(avgScore * 100) / 100,
        $inc: { totalPracticeSessions: 1 },
      });

      logger.info(
        `Test submitted: User ${userId}, Test ${testId}, Score ${percentage}%`,
      );

      return {
        result,
        score: percentage,
        totalQuestions: test.questions.length,
        correctAnswers: answerDetails.filter((a) => a.isCorrect).length,
        details: answerDetails,
      };
    } catch (error) {
      logger.error("Submit test error:", error);
      throw error;
    }
  }

  /**
   * Get user's test results
   */
  async getUserResults(userId, page = 1, limit = 10) {
    try {
      const results = await Result.find({ user: userId })
        .populate("test", "title level")
        .sort("-completedAt")
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Result.countDocuments({ user: userId });

      return {
        results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get user results error:", error);
      throw error;
    }
  }

  /**
   * Get test statistics (admin)
   */
  async getTestStatistics(testId) {
    try {
      const test = await Test.findById(testId);
      if (!test) {
        throw new AppError("Test not found", 404);
      }

      const results = await Result.find({ test: testId }).populate(
        "user",
        "name email",
      );

      const totalAttempts = results.length;
      const averageScore =
        totalAttempts > 0
          ? results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts
          : 0;

      const highestScore =
        totalAttempts > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

      const lowestScore =
        totalAttempts > 0 ? Math.min(...results.map((r) => r.percentage)) : 0;

      // Question-wise statistics
      const questionStats = test.questions.map((question, idx) => {
        let correctCount = 0;
        results.forEach((result) => {
          const answer = result.answers.find((a) => a.questionIndex === idx);
          if (answer && answer.isCorrect) correctCount++;
        });

        return {
          questionText: question.questionText,
          correctCount,
          incorrectCount: totalAttempts - correctCount,
          successRate:
            totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0,
        };
      });

      return {
        test,
        totalAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
        questionStats,
      };
    } catch (error) {
      logger.error("Get test statistics error:", error);
      throw error;
    }
  }
}

export default new TestService();
