import { useCallback, useEffect, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'
import EditDay from '../../components/editDay/index.weapp'
import { EDayTag, EDayType, ICreateDay, IDayCard } from '../../../types/type'
import { modifyDay as modifyDayService } from '../../services'

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
    if (!ID.current) {
        console.error('缺少 ID');
        return;
    }

    try {
      Taro.showLoading({
        title: '修改中',
      })
      await modifyDayService({
        ...data,
        _id: ID.current,
        modifyTime: new Date(),
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
      Taro.hideLoading();
      Taro.showToast({
        title: '修改失败',
        icon: 'none'
      })
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