import { EDayTag } from "../../types/type"

export const CARD_BACKGROUND = {
    BIRTHDAY: 'linear-gradient(347deg, #ff5530, #fe8041, #f9a353, #f2c466)',
    LOVE: 'linear-gradient(-20deg, #ff0844 0%, #ffb199 100%)',
    WORK: 'linear-gradient(348deg, #0027f3, #3d62f8, #4995fc, #3ec7ff)'
}

export const getBackground = (tag:EDayTag) => {
    switch(tag) {
        case EDayTag.BIRTHDAY: {
            return CARD_BACKGROUND.BIRTHDAY
        }
        case EDayTag.LOVE: {
            return CARD_BACKGROUND.LOVE
        }
        case EDayTag.WORK: {
            return CARD_BACKGROUND.WORK
        }
    }
}

export const TODAY = '今天'
export const DAY = '天'
export const HOUR = '小时'

export const NO_DATA = '暂无数据'
export const NO_DATA_TEXT = '还没有任何日子哦，\n点击下方按钮添加吧'

export const DAY_DESC_UNTIL = '还有'
export const DAY_DESC_SINCE = '已经'
export const DAY_DESC_TODAY = '就是'

export const WEEK = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六',]

export const TRANSLATE = {
    years: '年',
    months: '月',
    days: '日',
    hours: '小时',
}