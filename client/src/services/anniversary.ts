// 纪念日相关服务
import Taro from '@tarojs/taro';
import { supabase } from './config';

/**
 * 生成 32 位十六进制 ID（类似 MD5 格式）
 */
function generateId(): string {
    // 生成 32 位随机十六进制字符串
    const chars = '0123456789abcdef';
    let id = '';
    for (let i = 0; i < 32; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

/**
 * 获取当前用户的 OpenID
 */
function getOpenId() {
    const openid = Taro.getStorageSync('openid');
    if (!openid) {
        console.error('未找到 openid，请先登录');
        throw new Error('未找到用户信息，请重新登录');
    }
    return openid;
}

/**
 * 获取纪念日列表 (替代云函数 getDayList)
 * @returns {Promise<Array>} 返回格式化的纪念日列表
 */
export async function getDayList() {
    const openid = getOpenId();
    
    // 使用 openid 过滤数据
    const { data, error } = await supabase
        .from('anniversary')
        .select('id, title, event_date, is_top, is_repeat, tag_id, created_at, modified_at')
        .eq('openid', openid)
        .order('event_date', { ascending: true });

    if (error) {
        console.error('[getDayList] 查询数据失败:', error);
        console.error('[getDayList] 错误详情:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        throw error;
    }

    // 转换为前端期望的格式
    return (data || []).map(item => ({
        _id: item.id,
        day: item.event_date,
        title: item.title,
        isTop: item.is_top,
        tag: item.tag_id,
        isRepeat: item.is_repeat,
        createTime: item.created_at ? new Date(item.created_at) : new Date(),
        modifyTime: item.modified_at ? new Date(item.modified_at) : new Date(),
    }));
}

/**
 * 创建纪念日 (替代云函数 createDay)
 * @param {Object} record - 纪念日数据
 * @param {string} record.day - 日期
 * @param {string} record.title - 标题
 * @param {boolean} record.isTop - 是否置顶
 * @param {number} record.tag - 标签ID
 * @param {boolean} record.isRepeat - 是否重复
 * @param {Date} record.createTime - 创建时间（可选）
 */
export async function createDay(record: { 
    day: string,
    title: string,
    isTop: boolean,
    tag: number,
    isRepeat: boolean,
    createTime?: Date
}) {
    const openid = getOpenId();

    try {
        // 如果设置为置顶，先取消其他记录的置顶状态
        if (record.isTop) {
            const { error: updateError } = await supabase
                .from('anniversary')
                .update({ is_top: false })
                .eq('openid', openid)
                .eq('is_top', true); // 更新所有已置顶的记录

            if (updateError) {
                console.error('取消其他置顶记录失败:', updateError);
                // 不抛出错误，继续执行创建操作
            }
        }

        // 映射字段到 Supabase 列名
        const recordToInsert: any = {
            id: generateId(), // 生成 32 位十六进制 ID
            openid: openid, // 关键：插入 openid
            title: record.title,
            event_date: record.day,     
            tag_id: record.tag,
            is_repeat: record.isRepeat,
            is_top: record.isTop,
        };

        // 如果有创建时间，添加到记录中（Supabase 通常会自动处理时间戳）
        if (record.createTime) {
            recordToInsert.created_at = record.createTime.toISOString();
            recordToInsert.modified_at = record.createTime.toISOString();
        }
        
        const { data, error } = await supabase
            .from('anniversary')
            .insert([recordToInsert])
            .select();

        if (error) {
            console.error('插入新记录失败:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('创建纪念日失败:', error);
        throw error;
    }
}

/**
 * 修改纪念日 (替代云函数 modifyDay)
 * @param {Object} record - 纪念日数据
 * @param {string} record._id - 记录ID
 * @param {string} record.day - 日期
 * @param {string} record.title - 标题
 * @param {boolean} record.isTop - 是否置顶
 * @param {number} record.tag - 标签ID
 * @param {boolean} record.isRepeat - 是否重复
 * @param {Date} record.modifyTime - 修改时间（可选）
 */
export async function modifyDay(record: {
    _id: string,
    day: string,
    title: string,
    isTop: boolean,
    tag: number,
    isRepeat: boolean,
    modifyTime?: Date
}) {
    const openid = getOpenId();

    try {
        // 如果设置为置顶，先取消其他记录的置顶状态
        if (record.isTop) {
            const { error: updateError } = await supabase
                .from('anniversary')
                .update({ is_top: false })
                .eq('openid', openid)
                .neq('id', record._id) // 排除当前记录
                .eq('is_top', true); // 只更新已置顶的记录

            if (updateError) {
                console.error('取消其他置顶记录失败:', updateError);
                // 不抛出错误，继续执行更新操作
            }
        }

        // 映射字段到 Supabase 列名
        const recordToUpdate: any = {
            title: record.title,
            event_date: record.day,
            tag_id: record.tag,
            is_repeat: record.isRepeat,
            is_top: record.isTop,
        };

        // 如果有修改时间，更新 modified_at
        if (record.modifyTime) {
            recordToUpdate.modified_at = record.modifyTime.toISOString();
        }
        
        const { data, error } = await supabase
            .from('anniversary')
            .update(recordToUpdate)
            .eq('id', record._id)
            .eq('openid', openid) // 确保只能修改自己的数据
            .select();

        if (error) {
            console.error('更新记录失败:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('修改纪念日失败:', error);
        throw error;
    }
}

/**
 * 设置置顶 (替代云函数 setTopDay)
 * @param {string} _id - 记录ID
 * @param {boolean} top - 是否置顶
 */
export async function setTopDay(_id: string, top: boolean) {
    const openid = getOpenId();

    try {
        if (top) {
            // 先取消所有其他记录的置顶状态
            const { error: updateAllError } = await supabase
                .from('anniversary')
                .update({ is_top: false })
                .eq('openid', openid)
                .neq('id', _id) // 排除当前记录
                .eq('is_top', true); // 只更新已置顶的记录

            if (updateAllError) {
                console.error('取消其他置顶记录失败:', updateAllError);
                // 不抛出错误，继续执行
            }

            // 设置当前记录为置顶
            const { data, error } = await supabase
                .from('anniversary')
                .update({ is_top: true })
                .eq('id', _id)
                .eq('openid', openid)
                .select();

            if (error) {
                console.error('设置置顶失败:', error);
                throw error;
            }

            return data;
        } else {
            // 取消置顶
            const { data, error } = await supabase
                .from('anniversary')
                .update({ is_top: false })
                .eq('id', _id)
                .eq('openid', openid)
                .select();

            if (error) {
                console.error('取消置顶失败:', error);
                throw error;
            }

            return data;
        }
    } catch (error) {
        console.error('设置置顶失败:', error);
        throw error;
    }
}

/**
 * 删除纪念日 (替代云函数 deleteDay)
 * @param {string} _id - 记录ID
 */
export async function deleteDay(_id: string) {
    const openid = getOpenId();

    try {
        const { data, error } = await supabase
            .from('anniversary')
            .delete()
            .eq('id', _id)
            .eq('openid', openid) // 确保只能删除自己的数据
            .select();

        if (error) {
            console.error('删除记录失败:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('删除纪念日失败:', error);
        throw error;
    }
}

