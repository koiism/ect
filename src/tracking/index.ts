import { TrackEvents } from './config';
import { Tracker as TrackerProvider } from './withTracking';

export const Tracker = TrackerProvider<TrackEvents>;
