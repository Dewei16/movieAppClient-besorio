<template>
  <button class="mobile-toggle-btn" @click="toggleSidebar">
    <i class="fas fa-bars"></i>
  </button>

  <div 
    class="sidebar-overlay" 
    :class="{ 'show': isSidebarOpen }" 
    @click="closeSidebar"
  ></div>

  <aside class="sidebar" :class="{ 'mobile-open': isSidebarOpen }">
    
    <button class="close-sidebar-btn" @click="closeSidebar">
      <i class="fas fa-times"></i>
    </button>

    <div class="brand">
      <h1 class="logo">Movie<span class="gold">Studio</span></h1>
      
      <div class="user-status" :class="isAdmin ? 'admin-status' : 'regular-status'">
        <i class="fas" :class="isAdmin ? 'fa-user-shield' : 'fa-user'"></i>
        <span>{{ isAdmin ? 'ADMIN' : 'USER' }}</span>
      </div>
    </div>

    <nav class="side-nav">
      <div class="nav-section">
        <p class="section-title">Menu</p>
        
        <router-link 
          v-if="isAdmin" 
          to="/admin" 
          class="nav-item" 
          :class="{ active: route.path === '/admin' }"
        >
          <i class="fas fa-th-large"></i> Dashboard
        </router-link>

        <router-link 
          to="/movies" 
          class="nav-item" 
          :class="{ active: route.path.startsWith('/movie') }"
        >
          <i class="fas fa-compass"></i> Catalog
        </router-link>
        
        <template v-if="!isAdmin">
          <a href="#" class="nav-item"><i class="fas fa-heart"></i> Watchlist</a>
        </template>
      </div>

      <div class="nav-section">
        <p class="section-title">General</p>
        <a href="#" class="nav-item"><i class="fas fa-blog"></i> Blog</a>
        <a href="#" class="nav-item"><i class="fas fa-phone-alt"></i> Contact Us</a>
        <a href="#" class="nav-item"><i class="fas fa-cog"></i> Setting</a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <button @click="logout" class="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isAdmin = localStorage.getItem('isAdmin') === 'true';

// --- Mobile Sidebar Logic ---
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Automatically close sidebar when route changes (user clicks a link)
watch(route, () => {
  closeSidebar();
});

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<style scoped>
/* === DEFAULT (DESKTOP) STYLES === */
.sidebar {
  width: 250px;
  background-color: var(--medium-grey);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  height: 100vh;
  flex-shrink: 0;
  transition: transform 0.3s ease-in-out; /* Smooth slide effect */
  z-index: 1000; /* Ensure it sits on top */
}

/* Hide Mobile Elements on Desktop */
.mobile-toggle-btn, .close-sidebar-btn, .sidebar-overlay {
  display: none;
}

.brand { margin-bottom: 2rem; }
.brand .logo { font-size: 1.8rem; margin: 0 0 10px 0; color: var(--primary-gold); font-weight: bold; }
.brand .gold { color: white; }

.user-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}
.admin-status { background-color: rgba(255, 191, 0, 0.2); color: var(--primary-gold); border: 1px solid var(--primary-gold); }
.regular-status { background-color: rgba(255, 255, 255, 0.1); color: #aaa; border: 1px solid #555; }

.section-title { color: #666; font-size: 0.85rem; margin-bottom: 1rem; text-transform: uppercase; margin-top: 1.5rem; }

.nav-item {
  display: flex; align-items: center; gap: 15px;
  color: #888; padding: 12px 0; font-size: 1rem; transition: 0.3s;
  text-decoration: none;
  border-right: 3px solid transparent;
}
.nav-item:hover, .nav-item.active { color: var(--primary-gold); border-right: 3px solid var(--primary-gold); }

.sidebar-footer { margin-top: auto; }
.logout-link {
  background: transparent; border: none; color: #666;
  cursor: pointer; width: 100%; text-align: left; display: flex; gap: 10px; align-items: center;
  font-size: 1rem; transition: 0.3s;
}
.logout-link:hover { color: var(--primary-red); }

/* === MOBILE & TABLET STYLES (Max Width 768px) === */
@media (max-width: 768px) {
  /* 1. Show the Toggle Button */
  .mobile-toggle-btn {
    display: block;
    position: fixed;
    top: 15px;
    left: 15px;
    background: #222;
    color: var(--primary-gold);
    border: 1px solid #333;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1100; /* Higher than sidebar to be clickable if needed */
    font-size: 1.2rem;
  }

  /* 2. Sidebar goes Off-Canvas */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 260px; /* Slightly wider on mobile for better touch targets */
    transform: translateX(-100%); /* Hide by default */
    box-shadow: 2px 0 10px rgba(0,0,0,0.5);
  }

  /* 3. Class added via JS to slide it in */
  .sidebar.mobile-open {
    transform: translateX(0);
  }

  /* 4. Close Button inside Sidebar */
  .close-sidebar-btn {
    display: block;
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
  }

  /* 5. Overlay Backdrop */
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 900; /* Below sidebar, above content */
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
    backdrop-filter: blur(2px);
  }

  .sidebar-overlay.show {
    opacity: 1;
    visibility: visible;
  }
}
</style>