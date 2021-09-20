export enum EDayTag {
  BIRTHDAY,
  LOVE,
  WORK,
}

export enum EDayCount {
  UNTIL,
  SINCE,
}

export enum EDayUnit {
  DAY,
  HOUR,
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
  modifyTime: Date,
}

export type IDayList = Array<IDay>;

export interface IDayCard {
  createTime: Date,
  modifyTime: Date,
  dayDesc: string,
  day: string,
  week: string,
  backgroundColor: string,
  icon: string,
  title: string,
  isTop: boolean,
  exactDay: string,
  isRepeat: boolean,
  tag: EDayTag,
  unit: EDayUnit,
  _id: string,
}

export type IDayCardList = Array<IDayCard>

export enum EDayType {
  CREATE,
  EDIT,
}

export enum EDisplayType {
  ONLY_DAY,
  YEAR_MONTH_DAY,
}