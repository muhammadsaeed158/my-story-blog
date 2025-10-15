import { supabase } from './supabase.js';

const BACKEND_URL = 'https://myblog-backend.muhammadsaeed158.deno.net';

// Set footer year dynamically
document.getElementById('year').textContent = new Date().getFullYear();

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async () => {
  try {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout failed:', err);
  }
});

// -------------------- FETCH STORIES --------------------
const storiesContainer = document.getElementById('stories-container');
async function fetchStories() {
  try {
    // Supabase stories
    const { data: sbStories, error: sbError } = await supabase
      .from('stories')
      .select('*')
      .order('id', { ascending: false });
    if (sbError) throw sbError;

    // Backend stories
    const res = await fetch(`${BACKEND_URL}/stories`);
    const backendStoriesJson = await res.json();
    const backendStories = backendStoriesJson.stories || [];

    // Combine both sources
    const allStories = [...sbStories, ...backendStories];

    // Render
    storiesContainer.innerHTML = '';
    if (allStories.length === 0) {
      storiesContainer.innerHTML = '<p>No stories found.</p>';
      return;
    }

    allStories.forEach(story => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${story.image_url || 'images/default.jpg'}" alt="${story.title}">
        <div class="content">
          <h3 class="title">${story.title}</h3>
          <p class="intro">${story.short_intro || ''}</p>
          <div class="meta">
            <span>👤 ${story.users?.name || story.author || 'Unknown'}</span>
            <span>🕓 ${new Date(story.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      `;
      storiesContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching stories:', err);
    storiesContainer.innerHTML = '<p style="color:red;">Failed to load stories.</p>';
  }
}
fetchStories();

// -------------------- FETCH ARTICLES --------------------
const articlesContainer = document.getElementById('articles-container');
async function fetchArticles() {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;

    articlesContainer.innerHTML = '';
    if (!articles || articles.length === 0) {
      articlesContainer.innerHTML = '<p>No articles found.</p>';
      return;
    }

    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${article.image_url || 'images/default.jpg'}" alt="${article.title}">
        <div class="content">
          <h3 class="title">${article.title}</h3>
          <p class="intro">${article.short_intro || ''}</p>
        </div>
      `;
      articlesContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching articles:', err);
    articlesContainer.innerHTML = '<p style="color:red;">Failed to load articles.</p>';
  }
}
fetchArticles();

// -------------------- FETCH VIDEOS --------------------
const videosContainer = document.getElementById('videos-container');
async function fetchVideos() {
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;

    videosContainer.innerHTML = '';
    if (!videos || videos.length === 0) {
      videosContainer.innerHTML = '<p>No videos found.</p>';
      return;
    }

    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${video.thumbnail_url || 'images/default.jpg'}" alt="${video.title}">
        <div class="content">
          <h3 class="title">${video.title}</h3>
        </div>
      `;
      videosContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching videos:', err);
    videosContainer.innerHTML = '<p style="color:red;">Failed to load videos.</p>';
  }
}
fetchVideos();