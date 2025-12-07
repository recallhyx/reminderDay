import { Component } from 'react'
import Taro from '@tarojs/taro'
import { signInWithWechat } from './services'

import './app.scss'

class App extends Component {

  componentDidMount () {
    // 只在微信小程序环境下初始化登录
    if (process.env.TARO_ENV === 'weapp') {
      this.initAuth();
    }
  }

  /**
   * 初始化认证（自动登录）
   * 每次启动时都重新验证，防止用户切换微信账号后使用旧的 openid 导致数据越权
   */
  initAuth = async () => {
    try {
      // 获取当前微信账号的 openid（每次启动都重新验证）
      const { openid: currentOpenid } = await signInWithWechat();
      
      // 检查本地存储是否有旧的 openid
      const storedOpenid = Taro.getStorageSync('openid');
      
      if (storedOpenid && storedOpenid !== currentOpenid) {
        // 如果 openid 不一致，说明切换了微信账号
        // 清空可能存在的旧数据缓存（如果有的话）
        // 这里可以根据需要清空其他缓存数据
      }
      
      // 更新为当前账号的 openid
      Taro.setStorageSync('openid', currentOpenid);
      
    } catch (error: any) {
      console.error('[App] ❌ 自动登录失败:', error);
      
      // 处理不同类型的错误对象
      let errorMessage = '未知错误';
      let errorStack: string | undefined = undefined;
      
      if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack;
      } else if (error && typeof error === 'object') {
        // Taro 错误对象通常包含 errMsg
        const errMsg = error.errMsg || error.message || error.error;
        if (errMsg) {
          errorMessage = typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg);
        } else {
          errorMessage = JSON.stringify(error, null, 2);
        }
        errorStack = error.stack;
      } else {
        errorMessage = String(error);
      }
      
      console.error('[App] 错误详情:', {
        message: errorMessage,
        stack: errorStack,
        rawError: error
      });
      
      // 登录失败不影响应用启动，只记录错误
      // 用户可以在需要时手动登录
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
