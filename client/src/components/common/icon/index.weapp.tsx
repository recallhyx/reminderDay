import React, { Component, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default function Icon(props) {
  const {src, backgroundColor} = props;
  return (
    <View className="customIconWrapper" style={{backgroundColor}}>
      <Image className="customIcon" src={src}/>
    </View>
  )
}