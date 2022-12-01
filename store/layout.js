export const state = () => ({
  navigationDrawer: false
})

export const getters = {
  navigationDrawer: state => state.navigationDrawer
}

export const mutations = {
  setNavigationDrawer (state, drawer) {
    state.navigationDrawer = drawer
  }
}

export const actions = {
  setNavigationDrawer ({ commit }, drawer) {
    commit('setNavigationDrawer', drawer)
  }
}
