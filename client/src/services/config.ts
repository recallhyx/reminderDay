// Supabase 配置
// 根据环境使用不同的 Supabase 客户端
// H5 环境使用 @supabase/supabase-js
// 小程序环境使用 supabase-wechat-stable-v2（避免 .mjs 文件编译问题）

// ⚠️ 替换为您的 Supabase 项目 URL 和 Anon Key
const SUPABASE_URL = 'https://vicmggqyztwzneirxvmj.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpY21nZ3F5enR3em5laXJ4dm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Njg5OTQsImV4cCI6MjA4MDA0NDk5NH0.qavV59BkrqODrVXAduNzity1QrR1POL1hrj1xVO1PzY';

// ⚠️ 替换为您的 Edge Function URL
// 使用与 SUPABASE_URL 相同的项目引用
export const WECHAT_AUTH_URL = 'https://vicmggqyztwzneirxvmj.supabase.co/functions/v1/wechat-auth';

// 根据环境选择不同的 Supabase 客户端
// 使用动态导入避免编译时的模块解析问题
let supabase: any;

if (process.env.TARO_ENV === 'h5') {
  // H5 环境使用标准的 @supabase/supabase-js
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // 小程序环境使用 supabase-wechat-stable-v2
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('supabase-wechat-stable-v2');
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase };
export { SUPABASE_ANON_KEY };

