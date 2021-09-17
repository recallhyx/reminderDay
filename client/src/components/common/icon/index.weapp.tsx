import React, { Component, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

type Props = {
  src: string,
  background: string
}

export default function Icon(props:Props) {
  const {src, background} = props;
  return (
    <View className="customIconWrapper" style={{background}}>
      <Image className="customIcon" src={src}/>
    </View>
  )
}