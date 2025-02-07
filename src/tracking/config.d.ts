import { BaseTrackEvents } from './Tracker'

export interface TrackEvents extends BaseTrackEvents {
  pageView: {
    pageName: string;
    pageType: string;
    title: string;
  }
  pageLeave: {
    pageName: string;
    pageType: string;
    title: string;
    duration: number;
  }
  buttonClick: {
    buttonName: string;
    source: string;
    extra?: Record<string, any>;
  }
}
