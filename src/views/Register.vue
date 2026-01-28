<template>
  <div class="split-screen">
    <div class="left-pane">
      <div class="overlay"></div>
    </div>
    
    <div class="right-pane">
      <div class="curve-container">
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="curve">
            <path d="M100 0 C 0 0 0 100 100 100 Z" fill="#000000"/>
         </svg>
      </div>

      <div class="form-container">
        <h2 class="form-title">Register</h2>
        <form @submit.prevent="handleRegister">
          
          <div class="input-group">
            <label>Username</label>
            <div class="input-wrapper">
               <input v-model="username" type="text" placeholder="Choose a username" required />
               <i class="fas fa-user icon"></i>
            </div>
          </div>
          
          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
               <input v-model="email" type="email" placeholder="Type your email" required />
               <i class="fas fa-envelope icon"></i>
            </div>
          </div>
          
          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
               <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Create a password" 
                  required 
               />
               <i 
                  class="fas icon toggle-password"
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                  @click="showPassword = !showPassword"
               ></i>
            </div>
          </div>
          
          <button type="submit" class="btn-login">Create Account</button>
        </form>

        <div class="social-section">
          <p>Create with</p>
          <div class="social-icons">
            <button class="social-btn google"><i class="fab fa-google"></i></button>
            <button class="social-btn apple"><i class="fab fa-apple"></i></button>
            <button class="social-btn facebook"><i class="fab fa-facebook-f"></i></button>
          </div>
        </div>

        <p class="bottom-text">Have an account? <router-link to="/login" class="highlight-link">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// IMPORT THE CENTRALIZED API UTILITY (uses .env)
import api, { notyf } from '../utils/api';

const username = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();

const handleRegister = async () => {
  try {
    // Uses the baseURL from .env automatically
    await api.post('/users/register', { 
      username: username.value, 
      email: email.value, 
      password: password.value 
    });
    
    notyf.success('Registration successful!');
    router.push('/login');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Registration failed');
  }
};
</script>

<style scoped>
/* Exact same styling as Login.vue */
.split-screen { display: flex; height: 100vh; width: 100vw; background: #000; overflow: hidden; }

.left-pane { 
  flex: 1.5; 
  position: relative; 
  background: url('https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg') center/cover no-repeat; 
}
.left-pane .overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 191, 0, 0.4);
  mix-blend-mode: multiply;
}

.right-pane { 
  flex: 1; background: #000; display: flex; 
  align-items: center; justify-content: center; 
  position: relative; color: white;
}

.curve-container {
  position: absolute; top: 0; left: -100px;
  width: 101px; height: 100%; z-index: 2;
}
.curve path { fill: #000; }

.form-container { width: 350px; z-index: 3; position: relative; }
.form-title { font-size: 2.5rem; text-align: center; margin-bottom: 2rem; font-weight: bold; }

.input-group { margin-bottom: 1.5rem; }
.input-group label { display: block; color: #aaa; margin-bottom: 8px; font-size: 0.9rem; }
.input-wrapper { position: relative; border-bottom: 1px solid #444; }
.input-wrapper input { 
  width: 100%; background: transparent; border: none; 
  color: white; padding: 10px 35px 10px 0; outline: none; 
}
.input-wrapper .icon { position: absolute; right: 5px; top: 10px; color: #666; }
.toggle-password { cursor: pointer; transition: 0.3s; z-index: 5; }
.toggle-password:hover { color: #ffbf00; }

.btn-login { 
  width: 100%; background: #ccc; color: #000; border: none; 
  padding: 12px; border-radius: 25px; cursor: pointer; 
  font-weight: bold; font-size: 1rem; transition: 0.3s; 
}
.btn-login:hover { background: #ffbf00; }

.social-section { text-align: center; margin-top: 2rem; border-top: 1px solid #222; padding-top: 1.5rem; }
.social-section p { color: #666; font-size: 0.8rem; margin-bottom: 1rem; }
.social-icons { display: flex; justify-content: center; gap: 15px; }
.social-btn { 
  width: 45px; height: 45px; border-radius: 12px; 
  background: #1a1a1a; border: none; color: white; 
  cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.3s;
}
.social-btn:hover { background: #333; }

.bottom-text { text-align: center; margin-top: 2rem; color: #666; font-size: 0.9rem; }
.highlight-link { color: #ffbf00; font-weight: bold; text-decoration: none; }

@media (max-width: 768px) { 
  .left-pane, .curve-container { display: none; } 
  .right-pane { flex: 1; }
}
</style>