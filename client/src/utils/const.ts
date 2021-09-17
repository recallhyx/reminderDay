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