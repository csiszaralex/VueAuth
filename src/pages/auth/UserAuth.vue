<template>
  <div>
    <base-dialog :show="!!error" title="An error occured" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed :show="isLoading" title="Authenticating...">
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="passwd">Password</label>
          <input type="password" id="passwd" v-model.trim="pass" />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password eith least 6 charter.
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      pass: '',
      formIsValid: true,
      mode: 'login',
      isLoading: false,
      error: null
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') return 'Login';
      else return 'Signup';
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') return 'Signup instead';
      else return 'Login instead';
    }
  },
  methods: {
    async submitForm() {
      //*Form validálás
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.pass.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;

      const actPayload = {
            email: this.email,
            pass: this.pass
          };

      try {
        if (this.mode === 'login') {
          await this.$store.dispatch('login', actPayload);
        } else {
          await this.$store.dispatch('signup', actPayload);
        }

        const redirect = "/" + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirect)
      } catch (error) {
        this.error = error.message || 'Failed to login.try later.';
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === 'login') this.mode = 'signup';
      else this.mode = 'login';
    },
    handleError() {
      this.error = null;
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
