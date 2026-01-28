<template>
  <div class="admin-container">
    <Sidebar class="admin-sidebar" />
    
    <div class="admin-content">
      <div class="header">
        <h2>Admin Dashboard</h2>
        <button id="addMovie" @click="openCreate" class="btn-add">
          <i class="fas fa-plus"></i> Add Movie
        </button>
      </div>

      <div class="table-wrapper">
        <table class="movie-table">
          <thead>
            <tr>
              <th width="80">Image</th>
              <th width="150">Title</th>
              <th width="120">Director</th>
              <th width="80">Year</th>
              <th width="100">Genre</th>
              <th>Description</th>
              <th width="160">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in movies" :key="m._id">
              <td>
                <div class="img-wrapper">
                    <img src="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" alt="Poster" />
                </div>
              </td>
              <td class="text-white font-bold">{{ m.title }}</td>
              <td class="text-gray">{{ m.director }}</td>
              <td class="text-gray">{{ m.year }}</td>
              <td class="text-gold">{{ m.genre }}</td>
              <td class="desc-cell" :title="m.description">
                {{ m.description }}
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEdit(m)" class="btn-update">Update</button>
                  <button @click="deleteMovie(m._id)" class="btn-delete">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="movies.length === 0">
               <td colspan="7" class="empty-state">No movies found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
            <h3>{{ isEditing ? 'Update Movie' : 'Create Movie' }}</h3>
            <form @submit.prevent="saveMovie">
                <input v-model="form.title" placeholder="Title" required />
                <input v-model="form.director" placeholder="Director" required />
                <input v-model="form.year" placeholder="Year" type="number" required />
                <input v-model="form.genre" placeholder="Genre" required />
                <textarea v-model="form.description" placeholder="Description" required rows="4"></textarea>
                
                <div class="modal-actions">
                    <button type="submit" class="btn-save">Save</button>
                    <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api, { notyf } from '../utils/api';
import Sidebar from '../components/Sidebar.vue';

const movies = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const form = reactive({ title: '', director: '', year: '', genre: '', description: '' });

const fetchMovies = async () => {
    try {
        const res = await api.get('/movies/getMovies');
        movies.value = res.data.movies || res.data;
    } catch(e) { console.error(e); }
};

const deleteMovie = async (id) => {
    if(!confirm("Are you sure you want to delete this movie?")) return;
    try {
        await api.delete(`/movies/deleteMovie/${id}`);
        fetchMovies();
        notyf.success("Movie deleted");
    } catch(e) { notyf.error("Failed to delete"); }
};

const openCreate = () => {
    isEditing.value = false;
    Object.assign(form, { title: '', director: '', year: '', genre: '', description: '' });
    showModal.value = true;
};

const openEdit = (m) => {
    Object.assign(form, m);
    editingId.value = m._id;
    isEditing.value = true;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    isEditing.value = false;
    Object.assign(form, { title: '', director: '', year: '', genre: '', description: '' });
};

const saveMovie = async () => {
    try {
        // Prepare Data (Ensure year is a number)
        const payload = { ...form, year: Number(form.year) };

        if(isEditing.value) {
            await api.patch(`/movies/updateMovie/${editingId.value}`, payload);
        } else {
            await api.post('/movies/addMovie', payload);
        }
        closeModal();
        fetchMovies();
        notyf.success(isEditing.value ? "Movie updated" : "Movie created");
    } catch(e) { 
        console.error(e);
        notyf.error(e.response?.data?.message || "Operation failed"); 
    }
};

onMounted(fetchMovies);
</script>

<style scoped>
/* === MAIN LAYOUT === */
.admin-container { 
  display: flex; 
  height: 100vh; 
  width: 100%; 
  background: #000; 
  color: white; 
  overflow: hidden; /* Prevent double scroll */
}

.admin-sidebar {
  flex-shrink: 0;
}

.admin-content { 
  flex: 1; 
  padding: 2rem; 
  overflow-y: auto; 
  height: 100%;
}

/* === HEADER === */
.header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem; 
}
.header h2 { margin: 0; color: white; font-size: 1.8rem; }

.btn-add { 
  background: #ffbf00; border: none; padding: 10px 20px; 
  font-weight: bold; cursor: pointer; border-radius: 5px; 
  color: black; transition: 0.2s; display: flex; align-items: center; gap: 8px;
}
.btn-add:hover { background: white; }

/* === RESPONSIVE TABLE === */
.table-wrapper { 
  border: 1px solid #333; 
  border-radius: 8px; 
  overflow-x: auto; /* CRITICAL: Enables Horizontal Scroll */
  background: #111;
  width: 100%;
}

.movie-table { 
  width: 100%; 
  border-collapse: collapse; 
  font-size: 0.9rem; 
  min-width: 800px; /* Force minimum width to trigger scroll */
}

.movie-table th { 
  background: #222; padding: 12px; text-align: left; 
  color: #ffbf00; border-bottom: 1px solid #444; white-space: nowrap;
}

.movie-table td { 
  padding: 12px; border-bottom: 1px solid #333; 
  vertical-align: middle; 
}

/* Columns */
.img-wrapper { width: 50px; height: 75px; border-radius: 4px; overflow: hidden; background: #333; }
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.text-white { color: white; }
.text-gray { color: #aaa; }
.text-gold { color: #ffbf00; font-style: italic; }

.desc-cell { 
  max-width: 200px; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  color: #888; 
}

/* Actions */
.action-buttons { display: flex; gap: 5px; }
.btn-update { 
  background: transparent; border: 1px solid #ffbf00; color: #ffbf00; 
  padding: 6px 10px; cursor: pointer; border-radius: 4px; font-size: 0.8rem; white-space: nowrap;
}
.btn-update:hover { background: #ffbf00; color: black; }

.btn-delete { 
  background: #ff0000; border: 1px solid #ff0000; color: white; 
  padding: 6px 10px; cursor: pointer; border-radius: 4px; font-size: 0.8rem; white-space: nowrap;
}
.btn-delete:hover { background: #cc0000; }

.empty-state { text-align: center; color: #666; padding: 2rem; font-style: italic; }

/* === MODAL === */
.modal-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0,0,0,0.85); display: flex; 
  justify-content: center; align-items: center; z-index: 100; padding: 20px;
}
.modal { 
  background: #111; padding: 2rem; width: 100%; max-width: 450px; 
  border: 1px solid #ffbf00; border-radius: 10px; 
}
.modal h3 { color: #ffbf00; margin-top: 0; margin-bottom: 1.5rem; text-align: center; }

.modal input, .modal textarea { 
  width: 100%; margin-bottom: 15px; padding: 12px; 
  background: #222; border: 1px solid #444; color: white; 
  border-radius: 5px; outline: none; box-sizing: border-box;
}
.modal input:focus, .modal textarea:focus { border-color: #ffbf00; }

.modal-actions { display: flex; gap: 10px; margin-top: 10px; }
.btn-save { flex: 1; background: #ffbf00; border: none; padding: 12px; cursor: pointer; border-radius: 5px; font-weight: bold; }
.btn-cancel { flex: 1; background: #333; border: none; color: white; padding: 12px; cursor: pointer; border-radius: 5px; }
.btn-cancel:hover { background: #444; }

/* === MOBILE RESPONSIVENESS === */
@media (max-width: 768px) {
  /* Stack Layout: Sidebar Top (or Hidden), Content Below */
  .admin-container {
    flex-direction: column; 
  }
  
  /* Make sidebar compact or hide on mobile (optional: adjust your Sidebar component styling if needed) */
  .admin-sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-right: none;
    border-bottom: 1px solid #333;
  }

  /* Adjust Header for mobile */
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .btn-add {
    width: 100%;
    justify-content: center;
  }

  /* Modal responsiveness */
  .modal {
    width: 90%;
  }
}
</style>