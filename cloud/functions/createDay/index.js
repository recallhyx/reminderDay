// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { day, title, isTop, type, tag, createTime, isRepeat} = event;
  const wxContext = cloud.getWXContext();
  try {
    if (isTop) {
      await db.collection('anniversary').
        where({_openid: wxContext.OPENID}).
        update({
          data: {
            isTop: false,
          }
        })
    }
    await db.collection('anniversary').add({
      // data 字段表示需新增的 JSON 数据
      data: { day, title, isTop, type, tag, createTime, modifyTime:createTime, isRepeat, _openid: wxContext.OPENID},
    })
    console.log(event)
  } catch (error) {
    console.log(error)
  }
}