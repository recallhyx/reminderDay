import React, { Component, useCallback, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, Input, Picker } from '@tarojs/components'

import './index.scss'

type Props = {
  title,
  type: 'normal' | 'date',
  onChange: () => {},
  value,
}

export default function CustomInput(props) {
  const {title, type, onChange, value} = props;

  const renderInput = useCallback(() => {
    switch(type) {
      case 'normal': {
        return (
          <View>
            <View className="customInputTitle">{title}</View>
            <Input className="customInput" value={value} onInput={onChange} maxlength={15}/>
          </View>
        )
      }
      case 'date': {
        return (
          <View>
            <Text className="customInputTitle">{title}</Text>
            <View className="customInput">
              <Picker className="customPicker" value={value} mode='date' start="1900-01-01" onChange={onChange}>
                <View className='picker'>
                  {value}
                </View>
              </Picker>
            </View>
          </View>
        )
      }
    }
  }, [title, type, onChange, value])

  return (
    <View className="customInputWrapper">
      {renderInput()}
    </View>
  )
}