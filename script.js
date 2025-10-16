import { supabase } from './supabase.js'; // Supabase client file

const BACKEND_URL = 'https://my-blog-api.deno.dev';

// -------------------- FOOTER YEAR --------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------------------- LOGOUT --------------------
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    } catch (err) {
      console.error('Logout failed:', err.message);
      alert('Logout failed. Please try again.');
    }
  });
}

// -------------------- CREATE CARD --------------------
function createCard(item, type) {
  const card = document.createElement('div');
  card.className = 'card';

  let imgSrc = 'images/default.jpg';
  let title = '';
  let intro = '';
  let media = '';

  switch(type) {
    case 'story':
      imgSrc = item.image_url || imgSrc;
      title = item.title;
      intro = item.short_intro || '';
      media = `<span>👤 ${item.users?.name || item.author || 'Unknown'}</span>
               <span>🕓 ${new Date(item.created_at).toLocaleDateString()}</span>`;
      break;
    case 'article':
      imgSrc = item.image_url || imgSrc;
      title = item.title;
      intro = item.short_intro || '';
      media = '';
      break;
    case 'video':
      imgSrc = item.thumbnail_url || imgSrc;
      title = item.title;
      media = `<video src="${item.video_url}" controls></video>`;
      intro = '';
      break;
  }

  card.innerHTML = `
    <img src="${imgSrc}" alt="${title}" class="card-img">
    <div class="content">
      <h3 class="title">${title}</h3>
      <p class="intro">${intro}</p>
      <div class="meta">${media}</div>
    </div>
  `;
  return card;
}

// -------------------- FETCH & RENDER CONTENT --------------------
async function fetchAndRenderContent(tableName, containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(`*, users(name)`)
      .order('id', { ascending: false });
    if (error) throw error;

    container.innerHTML = '';
    if (!data || data.length === 0) {
      container.innerHTML = `<p>No ${type}s found.</p>`;
      return;
    }

    data.forEach(item => {
      const card = createCard(item, type);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(`Error fetching ${type}s:`, err.message);
    container.innerHTML = `<p style="color:red;">Failed to load ${type}s.</p>`;
  }
}

// -------------------- INITIALIZE CONTENT --------------------
fetchAndRenderContent('stories', 'stories-container', 'story');
fetchAndRenderContent('articles', 'articles-container', 'article');
fetchAndRenderContent('videos', 'videos-container', 'video');

// -------------------- REAL-TIME SUBSCRIPTIONS --------------------
supabase
  .from('stories')
  .on('INSERT', payload => {
    const container = document.getElementById('stories-container');
    const card = createCard(payload.new, 'story');
    container.prepend(card);
  })
  .subscribe();

supabase
  .from('articles')
  .on('INSERT', payload => {
    const container = document.getElementById('articles-container');
    const card = createCard(payload.new, 'article');
    container.prepend(card);
  })
  .subscribe();

supabase
  .from('videos')
  .on('INSERT', payload => {
    const container = document.getElementById('videos-container');
    const card = createCard(payload.new, 'video');
    container.prepend(card);
  })
  .subscribe();