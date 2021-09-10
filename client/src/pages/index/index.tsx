import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

import Login from '../../components/login/index.weapp'

export default function Index() {
  return (
    <View className='index'>
      <Button onClick={() => {Taro.navigateTo({url: '../createDay/index'})}}>添加</Button>
    </View>
  )
}
