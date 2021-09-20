import React, { Component, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'
import { EDayUnit, IDayCard } from '../../../../types/type'
import Icon from '../icon/index.weapp'

import operation from '../../../assets/icon/operation.svg'
import { DAY, HOUR, TODAY } from '../../../utils/const'

type Props = {
    data: IDayCard;
    onClick?: (data?:any) => void;
    onIconClick?: (data?:any) => void;
}

export default function Card(props:Props) {
    const {dayDesc, day, icon, title, backgroundColor, exactDay, isRepeat, week, unit} = props.data;
    const suffix = exactDay === TODAY ? '' : unit === EDayUnit.HOUR ? HOUR : DAY
    return (
        <View className="cardWrapper" onClick={props.onClick} style={{background: backgroundColor}}>
            <View className="cardTitleWrapper">
                <Text>{title}</Text>
                <Icon src={operation} onClick={props.onIconClick} background='none'/>
            </View>
            <View className='cardDay'>{`${day} ${week}`}</View>
            <View className='cardExact'>
                <Icon src={icon} background={backgroundColor}/>
                <View className='cardExactDayWrapper'>
                    <Text className='cardExactDesc'>{dayDesc}</Text>
                    <Text className='cardExactDay'>{exactDay}</Text>
                    <Text className='cardExactDesc'>{suffix}</Text>
                </View>
            </View>
        </View>
    )
}