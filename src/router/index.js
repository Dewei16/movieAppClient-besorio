import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import UserMovies from '../views/UserMovies.vue';
import SingleMovie from '../views/SingleMovie.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/movies', component: UserMovies },
    { path: '/movie/:id', component: SingleMovie },
    { 
      path: '/admin', 
      component: AdminDashboard,
      meta: { requiresAdmin: true } 
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  // Check string value 'true'
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (to.meta.requiresAdmin && (!token || !isAdmin)) {
    return next('/movies');
  }
  next();
});

export default router;