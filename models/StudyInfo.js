const mongoose = require("mongoose");
const dayjs = require("dayjs");

const studyInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // 关联 User 模型的 _id
    ref: "User", // 指向 User 模型
    required: true,
  },
  lastLearningDate: { type: Date }, // 上次学习时间(h)
  finishedProject: { type: Number }, // 完成训练多少篇
  allLearningTimeSpan: { type: Number }, // 总学习时长(h)
  lastLearningTimeSpan: { type: Number }, // 最后一次学习时长(h)
  lastWeekLearningTimeSpan: { type: Number }, // 最近一周学习时长(h)
  lastMonthLearningTimeSpan: { type: Number }, // 最近30天学习时长(h)
  learningProgress: { type: Array }, // 学习进度 TODO:看一下怎么定义数组元素的类型
  progress: {
    type: Map, // 灵活存储课程进度，如 { "course1": 80%, "course2": 30% }
    of: Number,
    default: {},
  },
});

// 创建并导出 StudyInfo 模型
module.exports = mongoose.model("StudyInfo", studyInfoSchema);
