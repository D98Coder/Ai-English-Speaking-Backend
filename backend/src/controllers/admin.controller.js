import adminService from "../services/admin.service.js";
import AppError from "../utils/AppError.js";

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const {
      role,
      englishLevel,
      isActive,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await adminService.getAllUsers(
      { role, englishLevel, isActive, search },
      parseInt(page),
      parseInt(limit),
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user details with activity
 */
export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userDetails = await adminService.getUserDetails(userId);

    res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status (activate/deactivate)
 */
export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      throw new AppError("isActive must be a boolean", 400);
    }

    const user = await adminService.updateUserStatus(userId, isActive);

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user and all associated data
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      throw new AppError("You cannot delete your own admin account", 400);
    }

    await adminService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all conversations (Admin view)
 */
export const getAllConversations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await adminService.getAllConversations(
      parseInt(page),
      parseInt(limit),
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all messages with filters
 */
export const getAllMessages = async (req, res, next) => {
  try {
    const { userId, role, conversationId, page = 1, limit = 10 } = req.query;

    const result = await adminService.getAllMessages(
      { userId, role, conversationId },
      parseInt(page),
      parseInt(limit),
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get platform analytics
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard statistics (quick overview)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const analytics = await adminService.getAnalytics();

    const dashboardStats = {
      totalUsers: analytics.overview.totalUsers,
      activeUsers: analytics.overview.activeUsers,
      totalTests: analytics.overview.totalTests,
      totalConversations: analytics.overview.totalConversations,
      totalMessages: analytics.overview.totalMessages,
      averageTestScore: analytics.overview.averageTestScore,
      usersByLevel: analytics.usersByLevel,
      recentActivity: analytics.activityLast7Days.slice(-7),
    };

    res.status(200).json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    next(error);
  }
};