var mongoose = require('mongoose');

// 定义数据库模式
module.exports = mongoose.model('User', {
  
  // 学生学号
  id: {
    type: String,
    default: ''
  },

  // 学生姓名
  name: {
    type: String,
    default: ''
  },

  // 学生性别
  gender: {
    type: String,
    default: ''
  },

  // 学生年级
  grade: {
    type: Number,
    default: 2019
  },

  // 学生学院
  college: {
    type: String,
    default: ''
  },

  // 学生专业
  major: {
    type: String,
    default: ''
  },

  // 学生住址
  address: {
    type: String,
    default: ''
  },

  // 学生电话
  phone: {
    type: String,
    default: ''
  },

  // 学生邮件
  email: {
    type: String,
    default: ''
  },

  // 第一志愿
  first_choice: {
    type: String,
    default: ''
  },

  // 第二志愿
  second_choice: {
    type: String,
    default: ''
  },

  // 自我介绍
  introduction: {
    type: String,
    default: ''
  },
});