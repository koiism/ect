'use client'

import React, { useRef, useEffect } from 'react';
import {
  TrackerContext,
  TrackParams,
  TrackEventWithParams,
  BaseTrackEvents
} from './Tracker';
import { useTracker, useExposureTracking, useClickTracking, handleTrackEvents } from './hooks';
import { TrackEvents } from './config';

interface WithTrackingProps<T extends BaseTrackEvents & Partial<TrackEvents>, P = TrackParams<T>> {
  params?: P;
  exposure?: TrackEventWithParams<T, TrackParams<T>>;
  click?: TrackEventWithParams<T, TrackParams<T>>;
  pageLoad?: TrackEventWithParams<T, TrackParams<T>>;
  pageLeave?: TrackEventWithParams<T, TrackParams<T>>;
  children: React.ReactNode;
  className?: string;
}

// 用于存储已经触发过pageLoad的页面URL
const pageLoadTracked = new Set<string>();

// 检查umami是否加载完成
const waitForUmami = (timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 如果umami已经存在，直接返回
    if (typeof window !== 'undefined' && window.umami) {
      resolve();
      return;
    }

    const startTime = Date.now();

    const checkUmami = () => {
      // 如果超时，则放弃等待
      if (Date.now() - startTime > timeout) {
        reject(new Error('Umami SDK load timeout'));
        return;
      }

      // 检查umami是否存在
      if (typeof window !== 'undefined' && window.umami) {
        resolve();
      } else {
        // 每100ms检查一次
        setTimeout(checkUmami, 100);
      }
    };

    checkUmami();
  });
};

export function Tracker<T extends BaseTrackEvents & Partial<TrackEvents>>({
  children,
  params,
  exposure,
  click,
  pageLoad,
  pageLeave,
  className,
  ...props
}: WithTrackingProps<T>) {
  const tracker = useTracker<T>(params);
  const componentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedRef = useRef(false);

  useExposureTracking<T>(tracker, exposure, componentRef);
  const handleClick = useClickTracking<T>(tracker, click);

  // 页面加载埋点
  useEffect(() => {
    const handlePageLoad = async () => {
      if (!pageLoad || !tracker.current) return;

      // 获取当前页面的唯一标识（URL + 时间戳）
      const pageKey = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '';

      // 如果已经触发过pageLoad，则不再触发
      if (hasTrackedRef.current || pageLoadTracked.has(pageKey)) {
        return;
      }

      try {
        await waitForUmami();
        handleTrackEvents(tracker.current, pageLoad);
        // 标记该页面已经触发过pageLoad
        pageLoadTracked.add(pageKey);
        hasTrackedRef.current = true;
      } catch (error) {
        console.warn('Failed to track pageLoad:', error);
      }
    };

    handlePageLoad();

    // 组件卸载时清理该页面的标记
    return () => {
      const pageKey = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '';
      pageLoadTracked.delete(pageKey);
    };
  }, [pageLoad, tracker]);

  // 页面离开埋点
  useEffect(() => {
    const currentTracker = tracker.current;
    const startTime = startTimeRef.current;

    const handleBeforeUnload = async () => {
      if (pageLeave && currentTracker) {
        try {
          await waitForUmami(1000); // 页面离开时使用更短的超时时间
          const duration = Date.now() - startTime;
          handleTrackEvents(currentTracker, {
            ...pageLeave,
          }, {
            duration,
          });
        } catch (error) {
          console.warn('Failed to track pageLeave:', error);
        }
      }
    };

    // 监听页面离开事件
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 组件卸载时也触发埋点
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TrackerContext.Provider value={tracker.current} {...props}>
      <div ref={componentRef} onClick={handleClick} className={className} >
        {children}
      </div>
    </TrackerContext.Provider>
  );
}
