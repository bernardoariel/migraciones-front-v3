import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(userData: any) {
      this.user = userData;
    },
    clearUser() {
      this.user = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    fullName: (state) => (state.user ? `${state.user.nombre} ${state.user.apellido}` : ''),
  },
});
