import React, { Component, useEffect, useState } from 'react'
import Taro, { Config, useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'
import { IDayList } from 'types/type';
import {useCloudFunction} from '../../hooks/hook'

const getListData = async () => {
  try {
    Taro.showLoading({
      title: '正在获取数据',
    })
    await Taro.cloud.callFunction({
      name: 'getList',
    })

  } catch (error) {
    Taro.showToast({
      title: '请求失败，请下拉刷新重试',
      icon: 'none',
    })
  }
}

export default function Index() {
  console.log('enter')
  const [list, setList] = useState<IDayList>([]);
  const [loading, fetch, result] = useCloudFunction('getDayList');
  useEffect(() => {
    console.log('loading', loading)
    if (loading) {
      Taro.showLoading({
        title: '正在获取数据',
      })
      return;
    }
    Taro.hideLoading();
    console.log('result', result);
  }, [loading, result]);
  usePullDownRefresh(() => {
    fetch();
  })

  useDidShow(() => {
    fetch();
  })

  return (
    <View className='index'>
      {
        !list.length ? (
          <View>
             <Button onClick={() => {Taro.navigateTo({url: '../createDay/index'})}}>添加</Button>
          </View>
        ) : (
          <View>
          </View>
        )
      }
    </View>
  )
}
