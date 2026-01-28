<template>
  <div class="container">
    <Sidebar class="fixed-sidebar" />
    
    <div class="content-area" v-if="movie">
      <router-link to="/movies" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to Catalog
      </router-link>

      <div class="movie-details-container">
        
        <div class="poster-wrapper">
          <img 
            src="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" 
            alt="Movie Poster" 
            class="poster-image"
          />
        </div>

        <div class="info-wrapper">
          <div class="movie-header">
            <h1>{{ movie.title }}</h1>
            <div class="meta">
              <span class="highlight">{{ movie.year }}</span>
              <span class="dot">•</span>
              <span class="genre">{{ movie.genre }}</span>
              <span class="dot">•</span>
              <span>Dir: {{ movie.director }}</span>
            </div>
          </div>

          <div class="movie-body">
            <h3 class="section-label">Synopsis</h3>
            <p class="description">{{ movie.description }}</p>
          </div>

          <div class="comments-section">
            <h3 class="section-label">Reviews & Comments ({{ movie.comments ? movie.comments.length : 0 }})</h3>
            
            <div class="add-comment-box">
              <input v-model="newComment" placeholder="Add a public comment..." />
              <button id="addComment" @click="postComment">Post</button>
            </div>

            <div class="comment-list" v-if="movie.comments && movie.comments.length">
              <div v-for="comment in movie.comments" :key="comment._id" class="comment-item">
                <div class="comment-avatar"><i class="fas fa-user"></i></div>
                <div class="comment-text">
                  <p class="comment-body">{{ comment.comment }}</p>
                  <small class="date">{{ new Date(comment.createdAt).toLocaleDateString() }}</small>
                </div>
              </div>
            </div>
            <div v-else class="no-comments">No comments yet. Be the first to review!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api, { notyf } from '../utils/api';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const movie = ref(null);
const newComment = ref('');

const fetchMovie = async () => {
  try {
    const res = await api.get(`/movies/getMovie/${route.params.id}`);
    movie.value = res.data;
  } catch (err) {
    notyf.error('Failed to load movie');
  }
};

const postComment = async () => {
  if (!newComment.value) return;
  try {
    // FIX: Using PLURAL '/movies'
    await api.patch(`/movies/addComment/${route.params.id}`, { 
      comment: newComment.value 
    });
    
    notyf.success('Comment added');
    newComment.value = '';
    fetchMovie(); // Refresh data
  } catch (err) {
    notyf.error('Failed to add comment');
  }
};

onMounted(fetchMovie);
</script>

<style scoped>
/* === MAIN LAYOUT === */
.container { display: flex; height: 100vh; background: #000; color: white; overflow: hidden; width: 100%; }
.fixed-sidebar { flex-shrink: 0; }
.content-area { flex: 1; padding: 3rem; overflow-y: auto; height: 100%; position: relative; }

/* === NAVIGATION === */
.back-link { 
  color: #888; text-decoration: none; font-size: 0.9rem; 
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 2rem; 
  transition: 0.3s; 
}
.back-link:hover { color: #ffbf00; }

/* === MOVIE DETAILS LAYOUT === */
.movie-details-container { display: flex; gap: 40px; max-width: 1200px; }

/* Poster */
.poster-wrapper { flex: 0 0 300px; }
.poster-image { 
  width: 100%; border-radius: 12px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
  border: 1px solid #333;
}

/* Info */
.info-wrapper { flex: 1; }

.movie-header h1 { font-size: 3rem; margin: 0 0 10px 0; line-height: 1.1; font-weight: 800; }
.meta { color: #aaa; font-size: 1rem; display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; flex-wrap: wrap; }
.highlight { color: #ffbf00; font-weight: bold; font-size: 1.1rem; border: 1px solid #ffbf00; padding: 2px 8px; border-radius: 4px; }
.genre { color: #fff; font-style: italic; }
.dot { color: #444; }

.section-label { color: #ffbf00; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px; display: inline-block; }
.description { line-height: 1.6; color: #ddd; font-size: 1.1rem; margin-bottom: 3rem; }

/* === COMMENTS === */
.comments-section { background: #111; padding: 20px; border-radius: 12px; border: 1px solid #222; }
.add-comment-box { display: flex; gap: 10px; margin-bottom: 20px; }
.add-comment-box input { 
  flex: 1; padding: 12px; background: #222; border: 1px solid #333; 
  color: white; border-radius: 6px; outline: none; 
}
.add-comment-box input:focus { border-color: #ffbf00; }
.add-comment-box button { 
  padding: 0 25px; background: #ffbf00; border: none; 
  color: black; font-weight: bold; border-radius: 6px; cursor: pointer; 
}
.add-comment-box button:hover { background: white; }

.comment-item { 
  display: flex; gap: 15px; margin-bottom: 15px; padding-bottom: 15px; 
  border-bottom: 1px solid #222; 
}
.comment-avatar { 
  width: 40px; height: 40px; background: #333; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; color: #ffbf00; flex-shrink: 0;
}
.comment-text p { margin: 0 0 5px 0; color: #eee; word-break: break-word; }
.date { color: #555; font-size: 0.75rem; }
.no-comments { color: #666; font-style: italic; text-align: center; padding: 20px; }

/* === RESPONSIVE BREAKPOINTS === */

/* Tablet & Smaller Laptops (Max Width: 1024px) */
@media (max-width: 1024px) {
  .content-area { padding: 2rem; }
  .movie-header h1 { font-size: 2.5rem; }
  .poster-wrapper { flex: 0 0 250px; }
}

/* Mobile & Small Tablets (Max Width: 768px) */
@media (max-width: 768px) {
  /* Stack Content below Sidebar (if sidebar isn't absolute) */
  .container { flex-direction: column; } 
  
  /* NOTE: Because Sidebar.vue now handles mobile as an overlay, 
     the fixed-sidebar will disappear from flow. 
     We just ensure content area takes full width. */
  .content-area { width: 100%; padding: 1.5rem; padding-top: 4rem; /* Add top padding for hamburger menu */ }

  /* Stack Poster and Info */
  .movie-details-container { flex-direction: column; gap: 20px; }
  
  /* Center Poster */
  .poster-wrapper { width: 100%; max-width: 300px; margin: 0 auto; }
  
  /* Typography Adjustments */
  .movie-header h1 { font-size: 2rem; text-align: center; }
  .meta { justify-content: center; }
  .description { font-size: 1rem; text-align: justify; }
  
  /* Comment Box */
  .add-comment-box { flex-direction: column; }
  .add-comment-box button { width: 100%; padding: 12px; }
}
</style>