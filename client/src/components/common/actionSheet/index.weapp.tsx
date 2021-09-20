import React, { Component, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import './index.scss'


type Props = {
    actionShow: boolean;
    children: React.ReactNode;
    onChange: (show:boolean) => void;
    render?: React.ReactNode;
}

export default function CustomActionSheet(props: Props) {
    const [show, setShow] = useState<boolean>(false);
    const [maskAnimation, setMaskAnimation] = useState<string>();
    const [animation, setAnimation] = useState<string>();

    useEffect(() => {
        console.log('action show', props.actionShow)
        setShow(props.actionShow)
        setAnimation(props.actionShow === true ? 'show-action-sheet' : 'hide-action-sheet')
        setMaskAnimation(props.actionShow === true ? 'show-mask-animation': 'hide-mask-animation')
    }, [props.actionShow])

    const cancelAction = () => {

        setMaskAnimation('hide-mask-animation')
        setAnimation('hide-action-sheet')

        setTimeout(() => {
            setShow(false)
            props.onChange(false);
        }, 300);
    }

    return (
        <View className={`action-sheet ${maskAnimation}`} onClick={cancelAction} style={{visibility: show ? 'visible' : 'hidden'}}>
            <View className={`container ${animation}`}>
                {props.render || props.children}
                <Button className="cancel" onClick={cancelAction}>取消</Button>
            </View>
        </View>
    )
}