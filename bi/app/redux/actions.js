/**
 * Created by wangleping on 2017/5/2.
 */
export const activePage = (num) => {
    return {
        type: 'ACTIVE_NUM',
        num: [String(num)]
    };
};
export const openSub = (sub) => {
    return {
        type: 'OPEN_SUB',
        opensub: [String(sub)]
    };
};