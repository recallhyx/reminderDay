// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { day, title, isTop, type, tag, createTime, } = event;
  const wxContext = cloud.getWXContext();
  try {
    await db.collection('anniversary').add({
      // data 字段表示需新增的 JSON 数据
      data: { day, title, isTop, type, tag, createTime, _openid: wxContext.OPENID},
    })
    console.log(event)
  } catch (error) {
    console.log(error)
  }
}