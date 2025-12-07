import { useCallback, useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'
import EditDay from '../../components/editDay/index.weapp'
import { EDayTag, EDayType, ICreateDay } from '../../../types/type'
import { createDay as createDayService } from '../../services'

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
  const [createDayData, setCreateDayData] = useState<ICreateDay>()

  useEffect(() => {
    if (!params.data) {
        return;
    }
    const data = JSON.parse(decodeURIComponent(params.data)) as ICreateDay;
    setCreateDayData(data)
}, [params.data])

  const create = useCallback(async (data:ICreateDay) => {
    try {
      Taro.showLoading({
        title: '创建中',
      })
      const now = new Date();
      await createDayService({
        ...data,
        createTime: now,
      })
      Taro.hideLoading();
      Taro.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000,
      })
      setTimeout(() => {
        Taro.hideToast();
        if (!createDayData) {
          Taro.navigateBack()
          return;
        }
        Taro.redirectTo({
          url: '/pages/index/index'
        })
      }, 2000)
    } catch(error) {
      Taro.hideLoading();
      Taro.showToast({
        title: '创建失败',
        icon: 'none'
      })
    }
  }, [JSON.stringify(createDayData)]);

  const onCancel = useCallback(() => {
    if (!createDayData) {
      Taro.navigateBack()
      return;
    }
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }, [JSON.stringify(createDayData)])

  return (
    <EditDay
      type={EDayType.CREATE}
      data={createDayData || newData}
      onClick={create}
      onCancel={onCancel}
    />
  )
}