# Supabase Edge Function 示例代码

## 问题
当前遇到 502 错误，说明 `wechat-auth` Edge Function 尚未在 Supabase 中创建或部署。

## 解决方案

### 1. 在 Supabase 项目中创建 Edge Function

在 Supabase 项目根目录下创建以下结构：

```
supabase/
  functions/
    wechat-auth/
      index.ts
```

### 2. Edge Function 代码示例

创建 `supabase/functions/wechat-auth/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 获取请求体中的 code
    const { code } = await req.json()
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: '缺少 code 参数' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 使用微信 API 将 code 换取 openid 和 session_key
    // 注意：这里需要您的微信小程序 AppID 和 AppSecret
    const WECHAT_APPID = Deno.env.get('WECHAT_APPID') || ''
    const WECHAT_SECRET = Deno.env.get('WECHAT_SECRET') || ''
    
    if (!WECHAT_APPID || !WECHAT_SECRET) {
      return new Response(
        JSON.stringify({ error: '微信配置未设置' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 调用微信 API 获取 openid
    const wechatResponse = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`
    )
    
    const wechatData = await wechatResponse.json()
    
    if (wechatData.errcode) {
      return new Response(
        JSON.stringify({ error: `微信 API 错误: ${wechatData.errmsg || wechatData.errcode}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { openid, session_key } = wechatData

    // 创建 Supabase 客户端
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 使用 openid 创建或获取用户，并生成 JWT token
    // 这里使用 Supabase 的 admin API 创建自定义 token
    const { data: authData, error: authError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: `${openid}@wechat.local`, // 使用 openid 作为唯一标识
    })

    if (authError) {
      // 如果用户不存在，创建一个新用户
      const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
        email: `${openid}@wechat.local`,
        email_confirm: true,
        user_metadata: {
          openid: openid,
          provider: 'wechat'
        }
      })

      if (userError) {
        return new Response(
          JSON.stringify({ error: `创建用户失败: ${userError.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // 为用户生成 token
      const { data: tokenData, error: tokenError } = await supabaseClient.auth.admin.generateLink({
        type: 'magiclink',
        email: `${openid}@wechat.local`,
      })

      if (tokenError) {
        return new Response(
          JSON.stringify({ error: `生成 token 失败: ${tokenError.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // 从链接中提取 token（这里需要根据实际情况调整）
      const token = tokenData.properties?.hashed_token || ''

      return new Response(
        JSON.stringify({ 
          supabase_token: token,
          openid: openid 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 返回 token 和 openid
    return new Response(
      JSON.stringify({ 
        supabase_token: authData.properties?.hashed_token || '',
        openid: openid 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

### 3. 部署 Edge Function

使用 Supabase CLI 部署：

```bash
# 安装 Supabase CLI（如果还没有）
npm install -g supabase

# 登录 Supabase
supabase login

# 链接到您的项目
supabase link --project-ref vicmggqyztwzneirxvmj

# 部署 Edge Function
supabase functions deploy wechat-auth
```

### 4. 设置环境变量

在 Supabase Dashboard 中设置以下环境变量：
- `WECHAT_APPID`: 您的微信小程序 AppID
- `WECHAT_SECRET`: 您的微信小程序 AppSecret
- `SUPABASE_URL`: 您的 Supabase 项目 URL（通常自动设置）
- `SUPABASE_SERVICE_ROLE_KEY`: 您的 Supabase Service Role Key（用于 admin API）

### 5. 注意事项

1. **Service Role Key**: 需要使用 Service Role Key 而不是 Anon Key，因为需要创建用户
2. **Token 生成**: 上面的代码示例可能需要根据您的实际需求调整 token 生成方式
3. **用户标识**: 使用 `openid@wechat.local` 作为邮箱格式，您可以根据需要调整
4. **安全性**: 确保 Service Role Key 只在服务器端使用，不要暴露给客户端

## 简化版本（如果只需要返回 openid）

如果您只需要获取 openid 并在客户端处理认证，可以使用更简单的版本：

```typescript
// 导入 Deno 环境依赖
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { create as createJwt, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";
// 从环境变量中获取配置 (同步读取)
const WECHAT_APP_ID = Deno.env.get('WECHAT_APPID');
const WECHAT_APP_SECRET = Deno.env.get('WECHAT_APPSECRET');
const SUPABASE_JWT_SECRET = Deno.env.get('JWT_SECRET');
const WECHAT_LOGIN_API = (code)=>`https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
// 使用 IIFE 来处理初始化和启动
(async ()=>{
  // --- 修复关键点：将 await 移入 async 块中 ---
  // 将 Secret 转换为 Web Crypto Key
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(SUPABASE_JWT_SECRET), {
    name: "HMAC",
    hash: "SHA-256"
  }, true, [
    "sign",
    "verify"
  ]);
  // 启动服务
  serve(async (req)=>{
    if (req.method !== 'POST') return new Response('Method Not Allowed', {
      status: 405
    });
    try {
      const { code } = await req.json();
      if (!code) throw new Error('Missing code');
      // --- 1. & 2. 调用微信 API 获取 openid ---
      const wechatRes = await fetch(WECHAT_LOGIN_API(code));
      const wechatData = await wechatRes.json();
      if (wechatData.errcode) throw new Error(`WeChat Error: ${wechatData.errmsg}`);
      const { openid } = wechatData;
      // --- 3. Edge Function 自行签名自定义 JWT ---
      const payload = {
        aud: "authenticated",
        role: "authenticated",
        openid: openid,
        iss: "supabase",
        exp: getNumericDate(60 * 60 * 24 * 7),
        iat: getNumericDate(new Date())
      };
      // 使用已经准备好的 key 同步签名
      const token = await createJwt({
        alg: "HS256",
        typ: "JWT"
      }, payload, key);
      // --- 4. 返回 JWT ---
      return new Response(JSON.stringify({
        supabase_token: token,
        openid: openid,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Function error:', error.message);
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  });
})();

```



