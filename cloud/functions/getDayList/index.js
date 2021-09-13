// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext.OPENID)
  const res = await db.collection('anniversary').where({
    _openid: wxContext.OPENID,
  }).get();
  console.log(res);
  return {
    list: res.data,
  }
}