// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { _id} = event;
    try {
        await db.collection('anniversary').doc(_id).remove()
        console.log(event)
      } catch (error) {
        console.log(error)
    }
}