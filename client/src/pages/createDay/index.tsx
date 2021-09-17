import React, { useCallback } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import EditDay from '../../components/editDay/index.weapp'
import { EDayTag, EDayType, ICreateDay } from '../../../types/type'

import dayjs from 'dayjs';

const newData: ICreateDay = {
  day: dayjs().format('YYYY-MM-DD'),
  title: '',
  isTop: false,
  isRepeat: false,
  tag: EDayTag.BIRTHDAY,
}

export default function CreateDay() {
  const create = useCallback(async (data:ICreateDay) => {
    console.log(data);
    try {
      Taro.showLoading({
        title: '创建中',
      })  
      await Taro.cloud.callFunction({
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
        duration: 2000,
      })
      setTimeout(() => {
        Taro.hideToast();
        Taro.navigateBack();
      }, 2000)
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