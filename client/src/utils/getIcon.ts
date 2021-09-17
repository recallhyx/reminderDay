import { EDayTag } from "../../types/type"
import birthday from '../assets/icon/birthday.svg'
import love from '../assets/icon/love.svg'
import work from '../assets/icon/work.svg'

export const getIcon = (tag:EDayTag) => {
    switch(tag) {
      case EDayTag.BIRTHDAY: {
        return birthday
      }
      case EDayTag.LOVE: {
          return love
      }
      case EDayTag.WORK: {
          return work
      }
    }
}