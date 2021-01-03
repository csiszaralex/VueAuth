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
    async login(context, payload) {
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAL7QfJFfLyeHWGmYmpuYdTOCDk25xvv_s',
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
        throw new Error(data.error.message || 'Failed to authanticate.');
      }
      context.commit('setUser', {
        token: data.idToken,
        userId: data.localId,
        tokenExpiration: data.expiresIn
      });
    },
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
        const error = new Error(
          data.error.message || 'Failed to authanticate.'
        );
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
    },
    token(state) {
      return state.token;
    },
    isAuthed(state) {
      return !!state.token
    }
  }
};
