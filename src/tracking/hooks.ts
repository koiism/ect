import { useContext, useEffect, useRef } from 'react';
import {
  Tracker,
  TrackerContext,
  TrackEventName,
  TrackEventWithParams,
  TrackParams,
  BaseTrackEvents,
  TrackEventParams
} from './Tracker';

export function handleTrackEvents<T extends BaseTrackEvents>(
  tracker: Tracker<T>,
  events?: TrackEventWithParams<T, TrackParams<T>>,
  extraParams?: Record<string, any>
) {
  if (!events) return;

  for (const eventName in events) {
    const params = events[eventName];
    tracker.track(
      eventName as TrackEventName<T>,
      {
        ...params as Partial<TrackEventParams<T, TrackEventName<T>>>,
        ...extraParams,
      }
    );
  }
}

export function useTracker<T extends BaseTrackEvents>(trackingParams: TrackParams<T> = {}) {
  const parentTracker = useContext(TrackerContext) as Tracker<T> | null;
  return useRef(new Tracker<T>(trackingParams, parentTracker));
}

export function useExposureTracking<T extends BaseTrackEvents>(
  tracker: React.RefObject<Tracker<T>>,
  trackExposure?: TrackEventWithParams<T, TrackParams<T>>,
  elementRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!trackExposure || !elementRef?.current || !tracker.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleTrackEvents(tracker.current!, trackExposure);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [tracker, trackExposure, elementRef]);
}

export function useClickTracking<T extends BaseTrackEvents>(
  tracker: React.RefObject<Tracker<T>>,
  trackClick?: TrackEventWithParams<T, TrackParams<T>>
) {
  return (e: React.MouseEvent) => {
    if (tracker.current) {
      handleTrackEvents(tracker.current, trackClick);
    }
  };
}
