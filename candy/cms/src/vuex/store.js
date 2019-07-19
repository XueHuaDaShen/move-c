import Vuex from 'vuex'
import Vue from 'vue'
import {toThousands} from '@/lib/utils/toThousands.js';
const formatMenuFn = function(index1, index2, url) {
  let menus = JSON.parse(localStorage.getItem('cms-user-menu'));
  //cms-user-menu
  let titleName, routerArr=[];
  menus[index1].child[index2].child.filter((v, vi) => {
    let o = new Object();
    if (v.url === url) {
      titleName = v.menu_name;
    }
    o.title = v.menu_name;
    o.name = v.url;
    o.checked = false;
    routerArr.push(o);
  })
  routerArr.filter(v => {
    if (titleName === v.title) {
      v.checked = true;
    } else {
      v.checked = false;
    }
  });
  return {titleName, routerArr}
};
const state = {
  menus: [],
  formatMenuFn: formatMenuFn,
  toThousands: toThousands,

  iframeJson: {
    show: false,
    url: '',
    data: null
  }
}
// console.log(state)
const mutations = {
  changeMenus (state, menus) {
    state.menus = menus
  },
  changeIframeJson (state, iframeJson) {
    state.iframeJson = iframeJson
  },
}

const getters = {
  lotteryArr: state => {
    return state.lotteryArr.filter(lotteryArr => lotteryArr)
  }
}

const actions = {
  setMenus ({ commit }, menus) {
    commit('changeMenus', menus)
  },
  setIframeJson ({ commit }, iframeJson) {
    commit('changeIframeJson', iframeJson)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
