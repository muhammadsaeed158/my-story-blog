// ==========================
// ✅ Supabase Setup
// ==========================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ynvhluadxmsjoihdjmky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================
// ✅ Backend Setup
// ==========================
const BACKEND_URL = 'https://myblog-backend.muhammadsaeed158.deno.net/';

// ==========================
// ✅ Containers
// ==========================
const storiesContainer = document.getElementById('stories-container');
const postsContainer = document.getElementById('posts-container');

// ==========================
// ✅ Fetch stories from Supabase
// ==========================
async function fetchStories() {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        short_intro,
        content,
        image_url,
        created_at,
        author 
      `)
      .order('id', { ascending: false });

    if (error) throw error;

    displayStories(data);
  } catch (err) {
    console.error('⚠️ Error fetching stories:', err.message);
    storiesContainer.innerHTML = `<p style="color:red;">Failed to load stories.</p>`;
  }
}

// ✅ Display Supabase stories
function displayStories(stories) {
  storiesContainer.innerHTML = '';

  if (!stories || stories.length === 0) {
    storiesContainer.innerHTML = '<p>No stories found.</p>';
    return;
  }

  stories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <div class="story-img-box">
        <img src="${story.image_url || 'images/default.jpg'}" alt="${story.title}" class="story-img"/>
      </div>
      <div class="story-content-box">
        <h2 class="story-title">${story.title}</h2>
        <p class="story-author">👤 By: ${story.users?.name || 'Unknown Author'}</p>
        <p class="story-date">🕓 ${new Date(story.created_at).toLocaleDateString()}</p>
        <p class="story-intro">${story.short_intro || ''}</p>
        <p class="story-full">${story.content}</p>
      </div>
    `;
    storiesContainer.appendChild(card);
  });
}

// ==========================
// ✅ Fetch posts from backend
// ==========================
async function fetchPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/posts`);
    const data = await res.json();

    postsContainer.innerHTML = '';

    data.posts.forEach(post => {
      const div = document.createElement('div');
      div.className = 'post-card';
      div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p>Author: ${post.author}</p>
      `;
      postsContainer.appendChild(div);
    });

  } catch (err) {
    console.error('⚠️ Error fetching posts:', err);
    postsContainer.innerHTML = `<p style="color:red;">Failed to load posts.</p>`;
  }
}

// ==========================
// ✅ Add story to backend
// ==========================
async function addStoryToBackend(story) {
  try {
    const res = await fetch(`${BACKEND_URL}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    });

    const data = await res.json();
    console.log('New story added:', data);
    alert('Story added successfully!');
    
    fetchPosts(); // Refresh posts list
  } catch (err) {
    console.error('⚠️ Error adding story:', err);
    alert('Failed to add story.');
  }
}

// ==========================
// ✅ Footer year update
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  fetchStories();
  fetchPosts();
});