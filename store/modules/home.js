const state = ()=> ({
  menu: [],
  hotActi: []
})

const mutations  = {
  setMenu(state, val){
    state.menu = val
  },
  setHotActi(state, val){
    state.hotActi = val
  }
}

const actions = {
  setMenu: ({ commit }, menu) => {
    commit('setMenu', menu)
  },
  setHotActi: ({ commit }, hotActi) => {
    commit('setHotActi', hotActi)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
