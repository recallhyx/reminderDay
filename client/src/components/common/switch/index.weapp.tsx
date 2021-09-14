import React, { Component, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'

type Props = {
  check: boolean,
  checkText: string,
  notCheckText: string,
  onChange: (check:boolean) => void,
}

export default function CustomSwitch(props:Props) {
  const {check, checkText, notCheckText, onChange} = props;
  return (
    <View className="customSwitch">
      <view className="switchBox" data-checked={check} onClick={() => onChange(!check)}>
          <view className={`switch ${check ? 'switchChecked' : ''}`}>
              <view></view>
          </view>
          <Text className={`switchFalseText ${!check ? 'highlight' : ''}`}>{notCheckText}</Text>
          <Text className={`switchTrueText ${check ? 'highlight' : ''}`}>{checkText}</Text>
      </view>
    </View>
  )
}