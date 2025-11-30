import React, { Component } from 'react'
import Taro from '@tarojs/taro'

import './app.scss'

class App extends Component {

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      try {
        Taro.cloud.init({
          traceUser: true
        })
        console.log('云函数初始化成功');
      } catch (error) {
        console.error('云函数初始化失败:', error);
      }
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
