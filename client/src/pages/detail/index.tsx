import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'

import './index.scss'
import { EDayUnit, EDisplayType, IDayCard } from '../../../types/type';
import dayjs from 'dayjs';
import preciseDiff from '../../utils/precise-range'
import { DAY, HOUR, TODAY, TRANSLATE } from '../../utils/const';

dayjs.extend(preciseDiff);

type FullDay = {
    years: number,
    months: number,
    days: number,
}

export default function Detail(props) {
    const { params } = useRouter();
    const [displayMode, setDisplayMode] = useState<EDisplayType>(EDisplayType.ONLY_DAY);
    const [fullDay, setFullDay] = useState<FullDay>({
        years: 0,
        months: 0,
        days: 0,
    });
    const [showDay, setShowDay] = useState<IDayCard>();

    useEffect(() => {
        if (!params.data) {
            Taro.showToast({
                title: '出错了，请重试',
            })
            return;
        }
        const data = JSON.parse(decodeURIComponent(params.data)) as IDayCard;
        console.log(data)
        setShowDay(data)
    }, [params.data])

    useEffect(() => {
        console.log(showDay)
        if (!showDay) {
            return;
        }
        if (displayMode === EDisplayType.YEAR_MONTH_DAY) {
            const date = dayjs(showDay.day);
            const now = dayjs();
            console.log(now, date)
            const diff = (dayjs as any).preciseDiff(now, date, true);
            const { years, months, days } = diff
            console.log(diff)
            setFullDay({
                years,
                months,
                days,
            })
        }
    }, [displayMode, showDay])

    useShareAppMessage(() => {
        if (!showDay) {
            return {
                path: '/pages/createDay'
            };
        }
        const { day, title, isTop, isRepeat, tag, _id } = showDay;
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

    const setMode = () => {
        console.log(showDay)
        if (!showDay || showDay.isRepeat || showDay.exactDay === TODAY || showDay.unit === EDayUnit.HOUR) {
            return;
        }
        if (displayMode === EDisplayType.ONLY_DAY) {
            setDisplayMode(EDisplayType.YEAR_MONTH_DAY)
        } else {
            setDisplayMode(EDisplayType.ONLY_DAY)
        }
    }

    const fullDayShow = useCallback(() => {
        const keyArr = Object.keys(fullDay);
        return (
            <View className="detailFullDay">
                {
                    keyArr.map((key) => (
                        <View>
                            {
                                fullDay[key] !== 0 && (
                                    <View>
                                        <Text className="detailFullDayExact">{fullDay[key]}</Text>
                                        <Text className="detailFullDayUnit">{TRANSLATE[key]}</Text>
                                    </View>
                                )
                            }
                        </View>
                    ))
                }
            </View>
        )
    }, [JSON.stringify(fullDay)])

    return (
        <View className="detailDay">
            <View className="detailDayWrapper" onClick={() => setMode()} style={{ background: showDay?.backgroundColor }}>
                <View className="detailDayTitleWrapper">
                    <View className="detailDayTitle">{showDay?.title}</View>
                    <View className="detailDayDay">{`${showDay?.day} ${showDay?.week}`}</View>
                </View>
                <Image className="detailDayIcon" src={showDay?.icon || ''} />
                <View className="detailDayExactWrapper">
                    <View className="deatailDayDesc">{showDay?.dayDesc}</View>
                    {
                        displayMode === EDisplayType.ONLY_DAY ? (
                            <View className="detailDayExactDayWrapper">
                                <Text className="detailDayExact">{showDay?.exactDay}</Text>
                                <Text className='deatailDayDesc'>
                                    {
                                        showDay?.exactDay !== TODAY && (showDay?.unit === EDayUnit.DAY ? DAY : HOUR)
                                    }
                                </Text>
                            </View>
                        ) : (
                                <View>
                                    {fullDayShow()}
                                </View>
                            )
                    }
                </View>
            </View>

        </View>
    )
}