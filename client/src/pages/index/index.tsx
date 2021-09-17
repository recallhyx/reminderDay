import React, { Component, useCallback, useEffect, useState } from 'react'
import Taro, { Config, useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import './index.scss'
import { EDayTag, IDay, IDayCard, IDayCardList, IDayList } from '../../../types/type';
import {useCloudFunction} from '../../hooks/hook'
import Icon from '../../components/common/icon/index.weapp';
import dayjs from 'dayjs'

import add from '../../assets/icon/add.svg';
import { getIcon } from '../../utils/getIcon';
import { getBackground } from '../../utils/const';
import Card from '../../components/common/card/index.weapp';

const DAY_DESC_UNTIL = '还有'
const DAY_DESC_SINCE = '已经'
const DAY_DESC_TODAY = '就是'
const TODAY = '今天'
const DAY = '天'

export default function Index() {
  console.log('enter')
  const [list, setList] = useState<IDayCardList>([]);
  const [top, setTop] = useState<IDayCard>();
  const [loading, fetch, result] = useCloudFunction<void, IDayList>('getDayList');

  useEffect(() => {
    console.log('loading', loading)
    if (loading) {
      Taro.showLoading({
        title: '正在获取数据',
      })
      return;
    }
    Taro.hideLoading();

  }, [loading]);

  useEffect(() => {
    if (!result || !result.length) {
      setList([]);
      return;
    }
    console.log(result)

    const cardList:IDayCardList = result.map((item) => {
      const icon = getIcon(item.tag);
      const backgroundColor = getBackground(item.tag);
      const now = dayjs();
      let day = dayjs(item.day);
      let dayDesc;
      let exactDay;
      if (item.isRepeat) {
        dayDesc = DAY_DESC_UNTIL;
        // 重复 需要将年设置为当前年
        day = day.year(now.year());
        if (now.month() === day.month() && now.date() === day.date()) {
          dayDesc = '';
          exactDay = TODAY;
        } else if (day.isBefore(now)){
          day = day.add(1, 'year');
          exactDay = Math.abs(now.diff(day, 'day'));
        } else {
          exactDay = Math.abs(now.diff(day, 'day'));
        }
      } else {
        if (now.isSame(day, 'day')) {
          dayDesc = DAY_DESC_TODAY
          exactDay = TODAY
        } else {
          exactDay = Math.abs(now.diff(day, 'day'));
          dayDesc = day.isBefore(now) ? DAY_DESC_SINCE : DAY_DESC_UNTIL;
        }
      }
      
      return {
        title: item.title,
        createTime: item.createTime,
        icon,
        dayDesc,
        day: item.day,
        backgroundColor,
        isTop: item.isTop,
        exactDay,
        isRepeat: item.isRepeat,
        tag: item.tag,
        _id: item._id,
      }
    })
    console.log('cardlist', cardList)

    const topIndex = cardList.findIndex((date) => date.isTop);
    let nowTop:IDayCard | undefined = undefined;
    if (topIndex !== -1) {
      nowTop = cardList.splice(topIndex, 1)[0];
    }
    const res = cardList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

    if (nowTop) {
      setTop(nowTop)
    } else {
      setTop(cardList.splice(0, 1)[0]);
    }

    setList(res);
    console.log(res)
  }, [result])

  const onIconClick = (item:IDayCard) => {
    Taro.showActionSheet({
      itemList: ['置顶', '编辑', '分享']
    }).then(async (res) => {
      switch(res.tapIndex) {
        case 0: {
          Taro.showLoading({
            title: '正在置顶中'
          })
          await Taro.cloud.callFunction({
            name: 'setTopDay',
            data: {
              _id: item._id,
            }
          })
          Taro.hideLoading();
          fetch();
          return;
        }
        case 1: {
          console.log(item)
          const day = {
            ...item,
            icon: '',
          }
          Taro.navigateTo({
            url: `../ModifyDay/index?data=${JSON.stringify(day)}`
          })
          return;
        }
        case 2: {
          Taro.useShareAppMessage
          return;
        }
      }
    })
  }
  usePullDownRefresh(() => {
    fetch();
  })

  useDidShow(() => {
    fetch();
  })

  return (
    <View className='index'>
      {
        !list.length && !top ? (
          <View>
             <Button onClick={() => {Taro.navigateTo({url: '../createDay/index'})}}>添加</Button>
          </View>
        ) : (
          <View className="dayListWrapper">
            <View className='topDayWrapper'>
              <View className='topDay'>
                <View>
                  <Text className='topDayTitle'>{top?.title}</Text>
                  <Text className='topDayDesc'>{top?.dayDesc}</Text>
                </View>
                <View onClick={() => {Taro.navigateTo({url: '../createDay/index'})}}>
                  <Icon src={add} background="linear-gradient(to right, #bdc3c7, #2c3e50);"/>
                </View>
              </View>
              <View className='topDayCount'>
                <Text className='topDayExact'>{top?.exactDay}</Text>
                <Text className='topDayText'>{top?.exactDay === TODAY ? '' : DAY}</Text>
              </View>
              <View className='topDayInfo'>
                <Text className="topDayDay">{top?.day}</Text>
                <Icon src={top!.icon} background={top!.backgroundColor} />
              </View>
            </View>
            <ScrollView className='scrollView' scrollY>
            {
              list.map((item) => (
                <View className='dayCardWrapper'>
                  <Card key={item._id} data={item} onIconClick={() => onIconClick(item)}/>
                </View>
              ))
            }
            </ScrollView>
          </View>
        )
      }
    </View>
  )
}
