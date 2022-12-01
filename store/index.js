export const state = () => ({
  accountResource: null,
  account: null,
});

export const getters = {
  accountResource: (state) => state.accountResource,
  account: (state) => state.account,
};

export const mutations = {
  setAccountResource(state, resource) {
    state.accountResource = resource;
    resource !== null
      ? localStorage.setItem("account-resource", resource)
      : localStorage.removeItem("account-resource");
  },

  setAccount(state, account) {
    state.account = account;
  },
};

export const actions = {
  async nuxtClientInit({ dispatch }) {
    const resource = localStorage.getItem("account-resource");
    if (resource !== null) {
      const account = await dispatch("fetchAccount", resource);
      dispatch("setAccount", account);
    }
  },

  setAccountResource({ commit }, resource) {
    commit("setAccountResource", resource);
  },

  setAccount({ commit }, account) {
    commit("setAccount", account);
  },

  async fetchAccount(context, resource) {
    const { data } = await this.$axios.get(resource);

    return data;
  },
};
