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
import CustomSwitch from '../common/switch/index.weapp'
import { CARD_BACKGROUND } from '../../utils/const'

type Props = {
  type: EDayType;
  data: ICreateDay;
  onClick: (data: ICreateDay) => {};
  onCancel?: () => void;
}

const CREATE_DAY = '创建日子'
const EDIT_DAY = '修改日子'
const TOP = '置顶'
const NOT_TOP = '不置顶'
const NOT_REPEAT = '不重复'
const REPEAT_YEAR = '每年'

const ICON_GROUP = [
  {icon: birthday, background: CARD_BACKGROUND.BIRTHDAY, buttonColor: '#f9a353', text: '生日', tag: EDayTag.BIRTHDAY},
  {icon: love, background: CARD_BACKGROUND.LOVE, buttonColor: '#ff0844', text: '纪念日', tag: EDayTag.LOVE},
  {icon: work, background: CARD_BACKGROUND.WORK, buttonColor: '#3d62f8', text: '工作', tag: EDayTag.WORK},
]

export default function EditDay(props:Props) {
  const {type, data, onClick} = props;
  console.log(data)
  const [editData, setEditData] = useState<ICreateDay>(data);
  const [buttonColor, setButtonColor] = useState<string>();

  const {day, title, isTop, tag, isRepeat} = editData;

  useEffect(() => {
    setEditData(data);
  }, [data])

  useEffect(() => {
    const item = ICON_GROUP.find((value) => value.tag === tag);
    setButtonColor(item?.buttonColor);
  }, [tag])

  const onChange = (name, event, value?) => {
    console.log('enter', name, value);
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
    console.log(editData);
    onClick(editData);
  }, [title, editData])

  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel();
      return;
    }
    Taro.navigateBack();
  }

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
        <CustomSwitch 
          check={isTop}
          checkText={TOP}
          notCheckText={NOT_TOP}
          onChange={(check) => {onChange('isTop', null, check)}}
        />
        <CustomSwitch 
          check={isRepeat}
          checkText={REPEAT_YEAR}
          notCheckText={NOT_REPEAT}
          onChange={(check) => {onChange('isRepeat', null, check)}}
        />
      </View>
      <View className="editTagGroup">
        {
          ICON_GROUP.map((item) => (
            <View
              className={`editTag ${tag === item.tag ? 'edtiTagSelected' : ''}`}
              onClick={() => onChange('tag', null, item.tag)}
            >
              <Icon src={item.icon} background={item.background}/>
              <Text>{item.text}</Text>
            </View>
          ))
        }
      </View>
      <View className="editOperation" style={{transition: `all 0.5s cubic-bezier(0.45, 1, 0.4, 1)`}}>
        <Button
          className="editConfirm" 
          style={{background: buttonColor}}
          onClick={onConfirm}>{type === EDayType.CREATE ? '创建' : '确定' }</Button>
        <Text className="editCancel" onClick={onCancel}>取消</Text>
      </View>
    </View>
  )
}