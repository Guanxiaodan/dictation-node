const User = require("../models/User");
const StudyInfo = require("../models/StudyInfo");

// 创建或初始化学习记录
const createStudyInfo = async (userId) => {
  try {
    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) throw new Error("用户不存在");

    // 创建学习记录
    const studyInfo = new StudyInfo({ userId });
    await studyInfo.save();
    return studyInfo;
  } catch (err) {
    throw err;
  }
};

// 更新学习进度
const updateStudyProgress = async (userId, courseId, progressPercent) => {
  try {
    // 使用 findOneAndUpdate 实现原子操作
    const updatedInfo = await StudyInfo.findOneAndUpdate(
      { userId },
      {
        $inc: { finishedProject: 1 }, // 课程完成数 +1
        $set: {
          lastLearningDate: Date.now(),
          [`progress.${courseId}`]: progressPercent,
        },
      },
      { new: true } // 返回更新后的文档
    );

    if (!updatedInfo) throw new Error("学习记录不存在");
    return updatedInfo;
  } catch (err) {
    throw err;
  }
};

// 查询用户学习数据（包含用户基本信息）
const getStudyInfo = async (userId) => {
  try {
    const studyInfo = await StudyInfo.findOne({ userId })
      .populate("userId", "userName userEmail") // 数据关联查询，关联查询用户信息 TODO:populate是干什么的
      .lean(); // TODO:lean是干什么的
    if (!studyInfo) throw new Error("学习记录不存在");
    return studyInfo;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getStudyInfo,
  updateStudyProgress,
  createStudyInfo,
};
