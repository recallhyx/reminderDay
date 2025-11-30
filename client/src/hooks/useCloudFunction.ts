import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import Taro, { useReady } from '@tarojs/taro'

export const useCloudFunction = <T, R>(functionName: string, data?: T) : [boolean, () => Promise<void>, R|undefined] => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<R>();
  const [isReady, setIsReady] = useState(false);
  const hasCalledRef = useRef(false);
  
  const fetch = useCallback(async () => {
    // 确保云函数已初始化
    if (process.env.TARO_ENV === 'weapp') {
      if (!Taro.cloud || typeof Taro.cloud.callFunction !== 'function') {
        console.warn('云函数未初始化，请稍后重试');
        // 延迟重试
        setTimeout(() => {
          if (Taro.cloud && typeof Taro.cloud.callFunction === 'function') {
            fetch();
          }
        }, 500);
        return;
      }
    }
    
    try {
      setLoading(true)
      const res: any = await Taro.cloud.callFunction({
        name: functionName,
        data: data as any,
      })
      setLoading(false);
      console.log('云函数调用成功:', res);
      setResult(res.result);
    } catch(error: any) {
      setLoading(false);
      console.error('云函数调用失败:', error);
      // 设置空数组作为默认值，确保页面能正常显示
      setResult([] as any);
      // 只在非超时错误时显示提示
      if (error?.errMsg && !error.errMsg.includes('timeout') && !error.errMsg.includes('timedout')) {
        Taro.showToast({
          title: '请求出错，请下拉刷新重试~',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }, [functionName, data]);

  // 使用 useReady 确保页面准备好后再调用
  useReady(() => {
    setIsReady(true);
  });

  useEffect(() => {
    // 只在页面准备好且未调用过时才调用
    if (isReady && !hasCalledRef.current) {
      hasCalledRef.current = true;
      // 延迟一点确保云函数初始化完成
      setTimeout(() => {
        fetch();
      }, 500);
    }
  }, [isReady, fetch]);

  return [loading, fetch, result]
}