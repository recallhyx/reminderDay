export enum EDayTag {
  LOVE,
  BIRTHDAY,
  WORK,
}

export interface ICreateDay {
  day: string,
  title: string,
  isTop: boolean,
  tag: EDayTag,
};

export interface IDay extends ICreateDay {
  _id: string,
  createTime: Date,
}

export type IDayList = Array<IDay>;

export enum EDayType {
  CREATE,
  EDIT,
}