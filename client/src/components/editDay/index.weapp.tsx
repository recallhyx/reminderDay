import React, { Component, useCallback, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button, Picker, Switch, Image } from '@tarojs/components'
import { EDayTag, EDayType, ICreateDay } from '../../../types/type'
import './index.scss'
import CustomInput from '../common/input/index.weapp'

import dayjs from 'dayjs'

import birthday from '../../assets/icon/birthday.svg';
import love from '../../assets/icon/love.svg'
import work from '../../assets/icon/work.svg'
import Icon from '../common/icon/index.weapp'

type Props = {
  type: EDayType,
  data: ICreateDay,
  onClick: (data: ICreateDay) => {},
}

const CREATE_DAY = '创建纪念日'
const EDIT_DAY = '修改纪念日'
const TOP = '置顶'
const NOT_TOP = '不置顶'

const TagBackgroundColor = {
  [EDayTag.BIRTHDAY]: `background: linear-gradient(-40deg, #acb6e5, #86fde8);`,
  [EDayTag.LOVE]: `background: linear-gradient(322deg, #ff2049, #ff7763, #ffaf7f, #ffe29d)`,
  [EDayTag.WORK]: `background: linear-gradient(338deg, #1900a7, #3c57c5, #409be2, #00e1fe)`
}

const ICON_GROUP = [
  {icon: birthday, backgroundColor: '#fa8c16', text: '生日', tag: EDayTag.BIRTHDAY},
  {icon: love, backgroundColor: '#eb2f96', text: '纪念日', tag: EDayTag.LOVE},
  {icon: work, backgroundColor: '#1890ff', text: '工作', tag: EDayTag.WORK},
]

export default function EditDay(props:Props) {
  const {type, data, onClick} = props;
  const [editData, setEditData] = useState<ICreateDay>(data);
  const [buttonColor, setButtonColor] = useState<string>();

  const {day, title, isTop, tag} = editData;

  useEffect(() => {
    const item = ICON_GROUP.find((value) => value.tag === tag);
    setButtonColor(item?.backgroundColor);
  }, [tag])

  const onChange = (name, event, value?) => {
    console.log('enter', name);
    if (name === 'day') {
      setEditData({
        ...editData,
        day: dayjs(!event ? value : event.detail.value).format('YYYY-MM-DD'),
      })
    } else {
      setEditData({
        ...editData,
        [name]: !event ? value : event.detail.value,
      })
    }

  }

  const onConfirm = useCallback(() => {
    if (!title) {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none',
      })
      return;
    }
    onClick(editData);
  }, [title])

  return (
    <View className='editWrapper'>
      <View className="editTitle">{type === EDayType.CREATE ? CREATE_DAY : EDIT_DAY }</View>
      <View className="editInput">
        <CustomInput title="标题" value={title} onChange={(event) => onChange('title', event)} type='normal'/>
      </View>
      <View className="editInput">
        <CustomInput title="日期" value={day} onChange={(event) => onChange('day', event)} type='date'/>
      </View>
      <View className="editSwitchWrapper">
        <View className="editSwitch">
          <view className="switchBox" data-checked={isTop} onClick={() => onChange('isTop', null, !isTop)}>
              <view className={`switch ${isTop ? 'switchChecked' : ''}`}>
                  <view></view>
              </view>
              <Text className={`switchFalseText ${!isTop ? 'highlight' : ''}`}>{NOT_TOP}</Text>
              <Text className={`switchTrueText ${isTop ? 'highlight' : ''}`}>{TOP}</Text>
          </view>
        </View>
      </View>
      <View className="editTagGroup">
        {
          ICON_GROUP.map((item) => (
            <View
              className={`editTag ${tag === item.tag ? 'edtiTagSelected' : ''}`}
              onClick={() => onChange('tag', null, item.tag)}
            >
              <Icon src={item.icon} backgroundColor={item.backgroundColor}/>
              <Text>{item.text}</Text>
            </View>
          ))
        }
      </View>
      <View className="editOperation">
        <Button
          style={{backgroundColor: buttonColor}}
          className="editConfirm" onClick={onConfirm}>{type === EDayType.CREATE ? '创建' : '确定' }</Button>
        <Text className="editCancel" onClick={() => Taro.navigateBack()}>取消</Text>
      </View>
    </View>
  )
}