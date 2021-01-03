export default {
  state() {
    return {
      userId: null,
      token: null,
      tokenExp: null
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.tokenExp = payload.tokenExpiration;
    }
  },
  actions: {
    login() {},
    async signup(context, payload) {
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAL7QfJFfLyeHWGmYmpuYdTOCDk25xvv_s',
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            password: payload.pass,
            returnSecureToken: true
          })
        }
      );
      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.message || 'Failed to authanticate.');
        throw error;
      }

      context.commit('setUser', {
        token: data.idToken,
        userId: data.localId,
        tokenExpiration: data.expiresIn
      });
    }
  },
  getters: {
    userId(state) {
      return state.userId;
    }
  }
};
