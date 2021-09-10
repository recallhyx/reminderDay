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

export enum EDayType {
  CREATE,
  EDIT,
}