/**
 * Created by wangleping on 2017/5/2.
 */
export const num = (state = ['0'], action) => {
    // "use strict";
    switch (action.type) {
        case 'ACTIVE_NUM':
            return action.num;
        // case 'OPEN_SUB':
        //     return action.opensub;
        default:
            return state;
    }

};

export const opensub = (state = [''], action) => {
    // "use strict";
    switch (action.type) {
        case 'OPEN_SUB':
            return action.opensub;
        default:
            return state;
    }
}