<template>
  <div class="dashboard-container">
    <Sidebar />

    <main class="main-content">
      <header class="top-bar">
        <div class="top-menu">
          <a href="#" class="active">All</a>
          <a href="#">Movie</a>
          <a href="#">Series</a>
        </div>
        <div class="top-actions">
          <div class="search-wrapper">
            <i class="fas fa-search"></i>
            <input v-model="searchQuery" type="text" placeholder="Search..." />
          </div>
        </div>
      </header>

      <section class="recommended-section">
        <div class="section-header">
          <h2>Movie Catalog</h2>
        </div>
        
        <div class="movie-grid">
          <div v-for="movie in filteredMovies" :key="movie._id" class="movie-card">
            <div class="card-image">
              <img src="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" alt="Poster" />
              <div class="card-overlay">
                 <router-link :to="`/movie/${movie._id}`">
                    <button class="btn-view">View Movie</button>
                 </router-link>
              </div>
              <div class="rating-pill"><i class="fas fa-star"></i> {{ movie.year }}</div>
            </div>
            <div class="card-info">
              <h3>{{ movie.title }}</h3>
              <p>{{ movie.genre }}</p>
            </div>
          </div>
        </div>
        <p v-if="filteredMovies.length === 0" style="color:#666; margin-top:20px;">No movies found.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api, { notyf } from '../utils/api';
import Sidebar from '../components/Sidebar.vue'; // SIDEBAR IMPORTED

const movies = ref([]);
const searchQuery = ref('');

const fetchMovies = async () => {
  try {
    const res = await api.get('/movies/getMovies'); 
    movies.value = res.data.movies || res.data;
  } catch (err) {
    console.error(err);
    notyf.error('Failed to load movies');
  }
};

const filteredMovies = computed(() => {
  return movies.value.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    movie.genre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(fetchMovies);
</script>

<style scoped>
/* === LAYOUT === */
.dashboard-container { 
  display: flex; 
  height: 100vh; 
  width: 100%; 
  background-color: black; 
  overflow: hidden; 
}

.main-content { 
  flex: 1; 
  padding: 2rem; 
  overflow-y: auto; 
  position: relative; 
  height: 100%;
}

/* === TOP BAR === */
.top-bar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem; 
  flex-wrap: wrap; 
  gap: 15px; 
}

.top-menu a { 
  color: #888; 
  margin-right: 25px; 
  text-decoration: none; 
  cursor: pointer; 
  transition: 0.3s;
}
.top-menu a.active, .top-menu a:hover { 
  color: #ffbf00; 
  font-weight: bold; 
}

/* === SEARCH === */
.search-wrapper { 
  background: #1e1e1e; 
  padding: 8px 15px; 
  border-radius: 20px; 
  display: flex; 
  align-items: center; 
  color: #666; 
  border: 1px solid #333;
}
.search-wrapper input { 
  background: transparent; 
  border: none; 
  color: white; 
  margin-left: 10px; 
  outline: none; 
  width: 100%; 
}

/* === GRID === */
.movie-grid { 
  display: grid; 
  /* Responsive columns */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  gap: 20px; 
}

/* === CARDS === */
.card-image { 
  position: relative; 
  border-radius: 15px; 
  overflow: hidden; 
  aspect-ratio: 2/3; 
  background: #222; 
}
.card-image img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.card-overlay { 
  position: absolute; 
  top: 0; left: 0; 
  width: 100%; height: 100%; 
  background: rgba(0,0,0,0.6); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  opacity: 0; 
  transition: 0.3s; 
}
.card-image:hover .card-overlay { opacity: 1; }

.btn-view { 
  background: #ff0000; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 20px; 
  cursor: pointer; 
  font-weight: bold; 
}
.btn-view:hover { background: #cc0000; }

.rating-pill { 
  position: absolute; 
  top: 10px; left: 10px; 
  background: rgba(0,0,0,0.7); 
  padding: 2px 8px; 
  border-radius: 5px; 
  font-size: 0.8rem; 
  color: #ffbf00; 
}

.card-info h3 { margin: 10px 0 5px 0; font-size: 1rem; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-info p { color: #666; font-size: 0.85rem; margin: 0; }

/* === MOBILE RESPONSIVENESS === */
@media (max-width: 768px) {
  /* Ensure main content takes full width since Sidebar is off-canvas */
  .dashboard-container {
    flex-direction: column; 
  }

  .main-content {
    width: 100%;
    padding: 1.5rem;
    padding-top: 4rem; /* Space for hamburger button */
  }

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .top-actions, .search-wrapper {
    width: 100%;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); 
    gap: 15px;
  }
  
  .btn-view {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>