import React, { Component, useCallback, useEffect, useRef, useState } from 'react'
import Taro, { Config, useDidShow, usePullDownRefresh, useReady, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, ScrollView, Image } from '@tarojs/components'
import './index.scss'
import { EDayTag, EDayUnit, IDay, IDayCard, IDayCardList, IDayList } from '../../../types/type';
import {useCloudFunction} from '../../hooks/useCloudFunction'
import Icon from '../../components/common/icon/index.weapp';
import dayjs from 'dayjs'

import add from '../../assets/icon/add.svg';
import noData from '../../assets/image/noData.svg';

import { getIcon } from '../../utils/getIcon';
import { DAY, DAY_DESC_SINCE, DAY_DESC_TODAY, DAY_DESC_UNTIL, getBackground, HOUR, NO_DATA, NO_DATA_TEXT, TODAY, WEEK } from '../../utils/const';
import Card from '../../components/common/card/index.weapp';
import CustomActionSheet from '../../components/common/actionSheet/index.weapp';

export default function Index() {
  const [show, setShow] = useState<boolean>(false);
  const [list, setList] = useState<IDayCardList>([]);
  const [top, setTop] = useState<IDayCard>();

  const selectedCard = useRef<IDayCard>()
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
      setTop(undefined);
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
      let unit = EDayUnit.DAY;
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
          const temp = Math.abs(now.diff(day, 'day'));
          if (!temp) {
            unit = EDayUnit.HOUR;
            exactDay = Math.abs(now.diff(day, 'hours'));
          } else {
            exactDay = temp;
          }
        }
      } else {
        if (now.isSame(day, 'day')) {
          dayDesc = DAY_DESC_TODAY
          exactDay = TODAY
        } else {
          const temp = Math.abs(now.diff(day, 'day'));
          if (!temp) {
            unit = EDayUnit.HOUR;
            exactDay = Math.abs(now.diff(day, 'hours'))
          } else {
            exactDay = temp;
          }
          dayDesc = day.isBefore(now) ? DAY_DESC_SINCE : DAY_DESC_UNTIL;
        }
      }
      
      const week = `${WEEK[dayjs(item.day).day()]}`

      return {
        ...item,
        icon,
        dayDesc,
        week,
        backgroundColor,
        exactDay,
        unit,
      }
    })
    console.log('cardlist', cardList)

    const topIndex = cardList.findIndex((date) => date.isTop);
    let nowTop:IDayCard | undefined = undefined;
    if (topIndex !== -1) {
      nowTop = cardList.splice(topIndex, 1)[0];
    }
    const res = cardList.sort((a, b) => new Date(b.modifyTime).getTime() - new Date(a.modifyTime).getTime());

    if (nowTop) {
      setTop(nowTop)
    } else {
      setTop(cardList.splice(0, 1)[0]);
    }

    setList(res);
    console.log(res)
  }, [result])

  const onIconClick = (e:Event, item:IDayCard) => {
    e.stopPropagation();
    setShow(true);
    selectedCard.current = item;
  }

  const onCardClick = (item:IDayCard) => {
    console.log(item, JSON.stringify(item))
    Taro.navigateTo({
      url: `/pages/detail/index?data=${encodeURIComponent(JSON.stringify(item))}`
    })
  }

  const onEditClick = () => {
    const day = {
      ...selectedCard.current,
      icon: '',
    }
    Taro.navigateTo({
      url: `../modifyDay/index?data=${encodeURIComponent(JSON.stringify(day))}`
    })
  }

  const onSetTopClick = async (isTop:boolean | undefined) => {
    if (!selectedCard.current || isTop === undefined) {
      return;
    }
    Taro.showLoading({
      title: isTop ? '正在置顶中' : '正在取消置顶'
    })
    console.log('isTop', isTop)
    await Taro.cloud.callFunction({
      name: 'setTopDay',
      data: {
        _id: selectedCard.current._id,
        top: isTop,
      }
    })
    Taro.hideLoading();
    fetch();
  }

  const onDeleteClick = async () => {
    Taro.showModal({
      content: `确定要删除 “${selectedCard.current?.title}” 吗？`,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }).then(async (res) => {
      if (res.confirm) {
        if (!selectedCard.current) {
          return;
        }
        Taro.showLoading({
          title: '正在删除中'
        })
        await Taro.cloud.callFunction({
          name: 'deleteDay',
          data: {
            _id: selectedCard.current._id,
          }
        })
        Taro.hideLoading();
        fetch();
      }
    })
  }

  useReady(() => {
    Taro.hideShareMenu();
  })

  usePullDownRefresh(async () => {
    await fetch();
    Taro.stopPullDownRefresh();
  })

  useDidShow(() => {
    fetch();
  })

  useShareAppMessage(() => {
    if (!selectedCard.current) {
      return {
        path: '/pages/createDay'
      };
    }
    const { day, title, isTop, isRepeat, tag, _id } = selectedCard.current;
    const modifyDayData = {
      day,
      title,
      isTop,
      isRepeat,
      tag,
    };
    return {
      title,
      path: `/pages/createDay/index?data=${encodeURIComponent(JSON.stringify(modifyDayData))}`,
    }
  })

  return (
    <View className='index'>
      {
        !list.length && !top ? (
          <View className="noData">
             <Image className="noDataImage" src={noData} />
             <Text className="noDataTitle">{NO_DATA}</Text>
             <Text className="noDataText">{NO_DATA_TEXT}</Text>
             <Button className="noDataButton" onClick={() => {Taro.navigateTo({url: '../createDay/index'})}}>添加</Button>
          </View>
        ) : (
          <View className="dayListWrapper">
            <View className='topDayWrapper' onClick={(e) => {e.stopPropagation(); onCardClick(top!)}}>
              <View className='topDay'>
                <View>
                  <Text className='topDayTitle'>{top?.title}</Text>
                  <Text className='topDayDesc'>{top?.dayDesc}</Text>
                </View>
                <View onClick={(e) => {e.stopPropagation(); Taro.navigateTo({url: '../createDay/index'})}}>
                  <Icon src={add} background="linear-gradient(to right, #bdc3c7, #2c3e50);"/>
                </View>
              </View>
              <View className='topDayCount'>
                <Text className='topDayExact'>{top?.exactDay}</Text>
                {
                  top?.exactDay !== TODAY && (
                    <Text className='topDayText'>{top?.unit === EDayUnit.HOUR ? HOUR : DAY}</Text>
                  )
                }
                
              </View>
              <View className='topDayInfo'>
                <Text className="topDayDay">{`${top?.day} ${top?.week}`}</Text>
                <Icon src={top!.icon} onClick={(e) => onIconClick(e, top!)} background={top!.backgroundColor} />
              </View>
            </View>
            <ScrollView className='scrollView' scrollY>
            {
              list.map((item) => (
                <View className='dayCardWrapper'>
                  <Card key={item._id} data={item} onClick={() => onCardClick(item)} onIconClick={(e) => onIconClick(e ,item)}/>
                </View>
              ))
            }
            </ScrollView>
          </View>
        )
      }
      <CustomActionSheet actionShow={show} onChange={(show) => setShow(show)}>
        <Button className="actionSheetButton" onClick={onEditClick}>编辑</Button>
        <Button className="actionSheetButton" onClick={() => onSetTopClick(!selectedCard.current?.isTop)}>
          {selectedCard.current?.isTop ? '取消置顶' : '置顶'}
        </Button>
        <Button className="actionSheetButton" openType='share'>分享</Button>
        <Button className="actionSheetDangerButton" onClick={onDeleteClick}>删除</Button>
      </CustomActionSheet>
    </View>
  )
}
