import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.model.js";
import Result from "../models/Result.model.js";
import Test from "../models/Test.model.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

class AdminService {
  /**
   * Get all users with filters
   */
  async getAllUsers(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};

      if (filters.role) query.role = filters.role;
      if (filters.englishLevel) query.englishLevel = filters.englishLevel;
      if (filters.isActive !== undefined) query.isActive = filters.isActive;
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } },
        ];
      }

      const users = await User.find(query)
        .select("-password")
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await User.countDocuments(query);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get all users error:", error);
      throw error;
    }
  }

  /**
   * Get user details with activity
   */
  async getUserDetails(userId) {
    try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Get user statistics
      const totalTests = await Result.countDocuments({ user: userId });
      const averageScore = await Result.aggregate([
        { $match: { user: user._id } },
        { $group: { _id: null, avg: { $avg: "$percentage" } } },
      ]);

      const totalConversations = await Conversation.countDocuments({
        user: userId,
      });
      const totalMessages = await Message.countDocuments({ user: userId });

      const recentResults = await Result.find({ user: userId })
        .populate("test", "title")
        .sort("-completedAt")
        .limit(5);

      const recentConversations = await Conversation.find({ user: userId })
        .sort("-lastMessageAt")
        .limit(5);

      return {
        user,
        statistics: {
          totalTests,
          averageScore: averageScore[0]?.avg || 0,
          totalConversations,
          totalMessages,
        },
        recentActivity: {
          results: recentResults,
          conversations: recentConversations,
        },
      };
    } catch (error) {
      logger.error("Get user details error:", error);
      throw error;
    }
  }

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(userId, isActive) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true },
      ).select("-password");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      logger.info(`User ${userId} status updated to ${isActive}`);
      return user;
    } catch (error) {
      logger.error("Update user status error:", error);
      throw error;
    }
  }

  /**
   * Get all conversations (admin view)
   */
  async getAllConversations(page = 1, limit = 10) {
    try {
      const conversations = await Conversation.find()
        .populate("user", "name email")
        .sort("-lastMessageAt")
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Conversation.countDocuments();

      return {
        conversations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get all conversations error:", error);
      throw error;
    }
  }

  /**
   * Get all messages with filters
   */
  async getAllMessages(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};

      if (filters.userId) query.user = filters.userId;
      if (filters.role) query.role = filters.role;
      if (filters.conversationId) query.conversation = filters.conversationId;

      const messages = await Message.find(query)
        .populate("user", "name email")
        .populate("conversation", "title")
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Message.countDocuments(query);

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get all messages error:", error);
      throw error;
    }
  }

  /**
   * Get platform analytics
   */
  async getAnalytics() {
    try {
      const [
        totalUsers,
        activeUsers,
        totalTests,
        totalConversations,
        totalMessages,
        averageTestScore,
        usersByLevel,
        usersByRole,
        activityLast7Days,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Test.countDocuments(),
        Conversation.countDocuments(),
        Message.countDocuments(),
        Result.aggregate([
          { $group: { _id: null, avg: { $avg: "$percentage" } } },
        ]),
        User.aggregate([
          { $group: { _id: "$englishLevel", count: { $sum: 1 } } },
        ]),
        User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
        Result.aggregate([
          {
            $match: {
              completedAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
              },
              count: { $sum: 1 },
              avgScore: { $avg: "$percentage" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      return {
        overview: {
          totalUsers,
          activeUsers,
          totalTests,
          totalConversations,
          totalMessages,
          averageTestScore: averageTestScore[0]?.avg || 0,
        },
        usersByLevel,
        usersByRole,
        activityLast7Days,
      };
    } catch (error) {
      logger.error("Get analytics error:", error);
      throw error;
    }
  }

  /**
   * Delete user and all associated data
   */
  async deleteUser(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Delete all user data
      await Result.deleteMany({ user: userId });
      await Message.deleteMany({ user: userId });
      await Conversation.deleteMany({ user: userId });
      await User.findByIdAndDelete(userId);

      logger.info(`User ${userId} and all associated data deleted`);
      return { success: true };
    } catch (error) {
      logger.error("Delete user error:", error);
      throw error;
    }
  }
}

export default new AdminService();
