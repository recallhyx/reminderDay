// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { _id, top } = event;
  try {
    if (top) {
      await db.collection('anniversary').
        where({ _openid: wxContext.OPENID }).
        update({
          data: {
            isTop: false,
          }
        })
      await db.collection('anniversary').doc(_id).update({
        data: {
          isTop: true,
        }
      })
    } else {
      await db.collection('anniversary').doc(_id).update({
        data: {
          isTop: false,
        }
      })
    }

    console.log(event)
  } catch (error) {
    console.log(error)
  }
}