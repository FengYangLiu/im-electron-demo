// ============ s SPACE 以这个为开头的全是命名空间相关 =======================

/* ping的命名空间 */
export const SPACE_PING = 'urn:xmpp:ping';

/* IQ的花名册命名空间 */
export const SPACE_IQ_ROSTER = 'jabber:iq:roster';

/* IQ最后的数据 */
export const SPACE_IQ_LAST = 'jabber:iq:last';

// ============ s SPACE 以这个为开头的全是命名空间相关 =========================


/** 
 * ITEM订阅状态 subscription 
 * both:双向订阅
 * to: 单向订阅
 * from：无双向订阅
 */
export const ITEM_SUB_TYPE = {
    BOTH: 'both',
    TO: 'to',
    FROM: 'from'
}


/**
 * IQ_TYPE:
 * get: get请求
 * result
 */
export const IQ_TYPE = {
    RESULT:'result',
    GET:'get'
}

/**
 * massageType:
 * chat, groupchat
 */
export const MASSAGE_TYPE = {
    CHAT:'chat',
    GROUP_CHAT:'groupchat'
}