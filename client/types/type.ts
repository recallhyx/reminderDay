export enum EDayTag {
  BIRTHDAY,
  LOVE,
  WORK,
}

export enum EDayCount {
  UNTIL,
  SINCE,
}

export interface ICreateDay {
  day: string,
  title: string,
  isTop: boolean,
  isRepeat: boolean,
  tag: EDayTag,
};

export interface IDay extends ICreateDay {
  _id: string,
  createTime: Date,
}

export type IDayList = Array<IDay>;

export interface IDayCard {
  createTime: Date,
  dayDesc: string,
  day: string,
  backgroundColor: string,
  icon: string,
  title: string,
  isTop: boolean,
  exactDay: string,
  isRepeat: boolean,
  tag: EDayTag,
  _id: string,
}

export type IDayCardList = Array<IDayCard>

export enum EDayType {
  CREATE,
  EDIT,
}