import React, { Component, useCallback } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import EditDay from '../../components/editDay/index.weapp'
import { EDayTag, EDayType, ICreateDay } from '../../../types/type'

import dayjs from 'dayjs';

const newData = {
  day: dayjs().format('YYYY-MM-DD'),
  title: '',
  isTop: false,
  tag: EDayTag.BIRTHDAY,
}

export default function CreateDay() {
  const create = useCallback(async (data:ICreateDay) => {
    console.log(data);
    try {
      Taro.showLoading({
        title: '创建中',
      })  
      const res = await Taro.cloud.callFunction({
        name: 'createDay',
        data: {
          ...data,
          createTime: new Date(),
        },
      })
      Taro.hideLoading();
      Taro.showToast({
        title: '创建成功',
        icon: 'success',
      })
      Taro.navigateBack();
      console.log(res);
    } catch(error) {
      console.log(error)
    }
  }, []);

  return (
    <EditDay
      type={EDayType.CREATE}
      data={newData}
      onClick={create}
    />
  )
}