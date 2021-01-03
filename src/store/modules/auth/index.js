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
      return context.dispatch('auth', { ...payload, mode: 'login' });
    },
    async signup(context, payload) {
      return context.dispatch('auth', { ...payload, mode: 'signup' });
    },
    async auth(context, payload) {
      const mode = payload.mode;
      let url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAL7QfJFfLyeHWGmYmpuYdTOCDk25xvv_s';
      if (mode === 'signup') {
        url =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAL7QfJFfLyeHWGmYmpuYdTOCDk25xvv_s';
      }

      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.pass,
          returnSecureToken: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message || 'Failed to authanticate.');
      }

      localStorage.setItem('token', data.idToken);
      localStorage.setItem('userId', data.userId);

      context.commit('setUser', {
        token: data.idToken,
        userId: data.localId,
        tokenExpiration: data.expiresIn
      });
    },
    autoLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token && userId) {
        context.commit('setUser', {
          token,
          userId,
          tokenExpiration: null
        });
      }
    },
    logout(context) {
      context.commit('setUser', {
        token: null,
        userId: null,
        tokenExpiration: null
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
      return !!state.token;
    }
  }
};
