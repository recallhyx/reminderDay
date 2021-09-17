import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

type Props = {
    actionShow: boolean;
    children: React.ReactChild
}

export default function customActionSheet(props: Props) {
    const [show, setShow] = useState<boolean>(false);
    const [maskAnimation, setMaskAnimation] = useState<string>();
    const [animation, setAnimation] = useState<string>();

    useEffect(() => {
        setShow(props.actionShow)
        setAnimation(props.actionShow === true ? 'show-action-sheet' : 'hide-action-sheet')
        setMaskAnimation(props.actionShow === true ? 'show-mask-animation': 'hide-mask-animation')
    }, [props.actionShow])

    const cancelAction = () => {

        setMaskAnimation('hide-mask-animation')
        setAnimation('hide-action-sheet')

        setTimeout(() => {
            setShow(false)
        }, 300);
    }

    return (
        <View className={`action-sheet ${maskAnimation}`} hidden={show}>
            <View className={`container ${animation}`}>
                {props.children}
                <Button className="cancel" onClick={cancelAction}>取消</Button>
            </View>
        </View>
    )
}