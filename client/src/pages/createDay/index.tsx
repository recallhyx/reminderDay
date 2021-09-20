import React, { useCallback, useEffect, useState } from 'react'
import Taro, { navigateBack, useRouter } from '@tarojs/taro'
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
  const { params } = useRouter();
  const [createDay, setCreateDay] = useState<ICreateDay>()

  useEffect(() => {
    if (!params.data) {
        return;
    }
    const data = JSON.parse(decodeURIComponent(params.data)) as ICreateDay;
    console.log(data)
    setCreateDay(data)
}, [params.data])

  const create = useCallback(async (data:ICreateDay) => {
    console.log(data);
    try {
      Taro.showLoading({
        title: '创建中',
      })
      const now = new Date();
      await Taro.cloud.callFunction({
        name: 'createDay',
        data: {
          ...data,
          createTime: now,
          modifyTime: now,
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

  const onCancel = useCallback(() => {
    if (!createDay) {
      Taro.navigateBack()
      return;
    }
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }, [JSON.stringify(createDay)])

  return (
    <EditDay
      type={EDayType.CREATE}
      data={createDay || newData}
      onClick={create}
      onCancel={onCancel}
    />
  )
}