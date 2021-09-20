import React, { useCallback, useEffect, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'
import EditDay from '../../components/editDay/index.weapp'
import { EDayTag, EDayType, ICreateDay, IDayCard } from '../../../types/type'

import dayjs from 'dayjs';

const newData: ICreateDay = {
  day: dayjs().format('YYYY-MM-DD'),
  title: '',
  isTop: false,
  isRepeat: false,
  tag: EDayTag.BIRTHDAY,
}

export default function ModifyDay() {
  const { params } = useRouter();
  const ID = useRef<string>();
  const [modifyDay, setModifyDay] = useState<ICreateDay>();

  useEffect(() => {
    if (!params.data) {
      return;
    }
    console.log(params.data)
    const data = JSON.parse(decodeURIComponent(params.data)) as IDayCard;
    const { day, title, isTop, isRepeat, tag, _id } = data;
    ID.current = _id;
    const modifyDayData = {
      day,
      title,
      isTop,
      isRepeat,
      tag,
    };
    setModifyDay(modifyDayData)
  }, [params.data])

  const modify = useCallback(async (data: ICreateDay) => {
    console.log(data);
    try {
      Taro.showLoading({
        title: '修改中',
      })
      await Taro.cloud.callFunction({
        name: 'modifyDay',
        data: {
          ...data,
          _id: ID.current,
          modifyTime: new Date(),
        },
      })
      Taro.hideLoading();
      Taro.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000,
      })
      setTimeout(() => {
        Taro.hideToast();
        Taro.navigateBack();
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }, []);

  return (
    <EditDay
      type={EDayType.EDIT}
      data={modifyDay || newData}
      onClick={modify}
    />
  )
}