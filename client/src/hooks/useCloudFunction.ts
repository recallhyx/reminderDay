import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import Taro from '@tarojs/taro'

export const useCloudFunction = <T, R>(functionName: string, data?: T) : [boolean, () => Promise<void>, R|undefined] => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<R>();
  const fetch = async () => {
    try {
      setLoading(true)
      const res: any = await Taro.cloud.callFunction({
        name: functionName,
        data,
      })
      setLoading(false);
      console.log(res);
      setResult(res.result);
    } catch(error) {
      setLoading(false);
      Taro.showToast({
        title: '请求出错，请下拉刷新重试~'
      })
      console.log(error)
    }
  }
  useEffect(() => {
    fetch();
  }, []);

  return [loading, fetch, result]
}