import { createContext } from 'react';

// 基础事件类型接口
export interface BaseTrackEvents {}

// 埋点公参类型
export type TrackParams<T extends BaseTrackEvents> = keyof T extends never ? any : Partial<T[keyof T]>
export type TrackEventName<T extends BaseTrackEvents> = keyof T;
export type TrackEventParams<T extends BaseTrackEvents, E extends TrackEventName<T>> = T[E];
export type TrackEvent<T extends BaseTrackEvents> = {
  [K in TrackEventName<T>]?: TrackEventParams<T, K>
}

type HasAllRequiredParams<T, P> = T extends { [K in keyof P]: P[K] } ? true : false;

export type TrackEventWithParams<T extends BaseTrackEvents, P extends TrackParams<T>> = {
  [K in TrackEventName<T>]?: HasAllRequiredParams<TrackEventParams<T, K>, P> extends true
    ? boolean | Partial<TrackEventParams<T, K>>
    : Omit<TrackEventParams<T, K>, keyof P>
}

export class Tracker<T extends BaseTrackEvents> {
  private params: TrackParams<T>;
  private parent: Tracker<T> | null;

  constructor(params: TrackParams<T> = {}, parent: Tracker<T> | null = null) {
    this.params = params;
    this.parent = parent;
  }

  getAllParams(): TrackParams<T> {
    const parentParams = this.parent ? this.parent.getAllParams() : {};
    return {
      ...parentParams,
      ...this.params
    };
  }

  track<E extends TrackEventName<T>>(eventName: E, eventParams: Partial<TrackEventParams<T, E>> | boolean = {}) {
    const allParams = {
      ...this.getAllParams(),
      ...(typeof eventParams === 'object' ? eventParams : {}),
      eventName
    };

    console.log('Track Event:', allParams);
    umami.track(eventName as string, allParams);
  }
}

export const TrackerContext = createContext<Tracker<BaseTrackEvents> | null>(null);
