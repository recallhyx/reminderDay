// 认证相关服务
import Taro from '@tarojs/taro';
import { WECHAT_AUTH_URL, SUPABASE_ANON_KEY } from './config';

/**
 * 完整的微信小程序登录认证流程 (Taro 版本)
 * @returns {Promise<{ openid: string }>} 返回包含 openid 的对象
 */
export async function signInWithWechat(): Promise<{ openid: string }> {
    // 1. 获取微信 Code (使用 Taro.login)
    const loginRes = await Taro.login();
    
    if (!loginRes.code) {
        console.error('[signInWithWechat] Taro.login 失败，未获取到 code');
        throw new Error('Taro.login failed to get code.');
    }
    const code = loginRes.code;

    try {
        // 2. 将 Code 发送到 Edge Function 换取 JWT (使用 Taro.request)
        const requestHeaders = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        };
        
        let tokenResponse: Taro.request.SuccessCallbackResult<{ supabase_token?: string, openid?: string, error?: string }>;
        try {
            tokenResponse = await Taro.request<{ supabase_token?: string, openid?: string, error?: string }>({
                url: WECHAT_AUTH_URL,
                method: 'POST',
                header: requestHeaders,
                data: { code }
            });
        } catch (requestError: any) {
            const errMsg = requestError?.errMsg || requestError?.message || JSON.stringify(requestError);
            console.error('[signInWithWechat] 网络请求失败:', errMsg);
            throw new Error(`网络请求失败: ${errMsg}`);
        }

        // 检查响应状态码
        if (tokenResponse.statusCode !== 200) {
            console.error('[signInWithWechat] Edge Function 返回非200状态码:', tokenResponse.statusCode);
            throw new Error(`Edge Function 返回错误状态码: ${tokenResponse.statusCode}`);
        }

        const { openid, error: edgeError } = tokenResponse.data || {};

        if (edgeError || !openid) {
            console.error('[signInWithWechat] Edge Function 错误或缺少 openid:', edgeError);
            throw new Error(`Failed to get openid from Edge Function: ${edgeError || 'No openid returned'}`);
        }

        // 3. 不再登录 Supabase，直接返回 openid
        return { openid };

    } catch (e) {
        console.error('[signInWithWechat] ❌ 登录流程失败:', e);
        throw e;
    }
}

