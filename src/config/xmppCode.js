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
 * to: 单向订阅, 在线状态我方订阅，对方未订阅
 * from：单向订阅, 在线状态，对方订阅，我放没订阅
 * none: 初始值无
 */
export const ITEM_SUB_TYPE = {
    BOTH: 'both',
    TO: 'to',
    FROM: 'from',
    NONE: 'none',
    REMOVE: 'remove'
}


/**
 * IQ_TYPE:
 * get: get请求
 * set: 更改如更改花名册
 * result
 */
export const IQ_TYPE = {
    RESULT:'result',
    ERROR: 'error',
    GET:'get',
    SET: 'set',
}

/**
 * presence type：
 * subscribe: 订阅
 * subscribed: 已订阅
 * unsubscribed: 拒绝订阅
 * error: 失败
 * UNAVAILABLE: 不可用状态
 */
export const PRESENCE_TYPE = {
    SUBSCRIBE: 'subscribe',
    SUBSCRIBED:'subscribed',
    UNSUBSCRIBED: 'unsubscribed',
    ERROR: 'error',
    UNAVAILABLE: 'unavailable'
}

/**
 * massageType:
 * chat, groupchat
 */
export const MASSAGE_TYPE = {
    CHAT:'chat',
    GROUP_CHAT:'groupchat'
}