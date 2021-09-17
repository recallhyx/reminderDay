import React, { Component, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import { IDayCard } from '../../../../types/type'
import Icon from '../icon/index.weapp'

import operation from '../../../assets/icon/operation.svg'

type Props = {
    data: IDayCard;
    onIconClick: (data?:any) => void;
}

const DAY = '天'

export default function Card(props:Props) {
    const {dayDesc, day, icon, title, backgroundColor, exactDay, isRepeat} = props.data;
    return (
        <View className="cardWrapper" style={{background: backgroundColor}}>
            <View className="cardTitleWrapper" onClick={props.onIconClick}>
                <Text>{title}</Text>
                <Icon src={operation} background='none'/>
            </View>
            <View className='cardDay'>{day}</View>
            <View className='cardExact'>
                <Icon src={icon} background={backgroundColor}/>
                <View className='cardExactDayWrapper'>
                    <Text className='cardExactDesc'>{dayDesc}</Text>
                    <Text className='cardExactDay'>{exactDay}</Text>
                    <Text className='cardExactDesc'>{DAY}</Text>
                </View>
            </View>
        </View>
    )
}