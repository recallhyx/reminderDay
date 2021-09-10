import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { EDayTag, ICreateDay } from '../../../types/type'

export default class Index extends Component {
  state = {
    context: {}
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getLogin = async () => {
    // Taro.cloud
    //   .callFunction({
    //     name: "login",
    //     data: {}
    //   })
    //   .then(res => {
    //     this.setState({
    //       context: res.result
    //     })
    //     console.log(res);
    //   })
    const testDate: ICreateDay = {
      day: new Date().toString(),
      title: 'ceshi',
      isTop: false,
      tag: EDayTag.LOVE
    }
    try {
      const res = await Taro.cloud.callFunction({
        name: 'createDay',
        data: testDate
      })
      console.log(res);
    } catch(error) {
      console.log(error)
    }

  }

  render() {
    return (
      <View className='index'>
        <Button onClick={this.getLogin}>获取登录云函数</Button>
        <Button openType="getUserInfo">aaa</Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
      </View>
    )
  }
}
