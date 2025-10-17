// -------------------- IMPORT SUPABASE --------------------
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ynvhluadxmsjoihdjmky.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------------------- FOOTER YEAR --------------------
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// -------------------- MESSAGES --------------------
export function showMessage(msg, type = 'info') {
  let messageEl = document.getElementById('message');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'message';
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.right = '20px';
    messageEl.style.padding = '12px 20px';
    messageEl.style.borderRadius = '8px';
    messageEl.style.zIndex = '9999';
    messageEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    messageEl.style.fontFamily = 'Poppins, sans-serif';
    messageEl.style.fontWeight = '600';
    messageEl.style.color = '#fff';
    messageEl.style.transition = 'opacity 0.3s';
    document.body.appendChild(messageEl);
  }

  messageEl.style.background = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
  messageEl.textContent = msg;
  messageEl.style.opacity = '1';
  setTimeout(() => { messageEl.style.opacity = '0'; }, 4000);
}

// -------------------- AUTH CHECK --------------------
export async function checkAuth(redirectLogin = true) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      if (redirectLogin) window.location.href = 'login.html';
      return null;
    }
    return user;
  } catch (err) {
    console.error('Auth check failed:', err.message);
    if (redirectLogin) window.location.href = 'login.html';
    return null;
  }
}

// -------------------- LOGOUT --------------------
export function setupLogout(logoutBtnId = 'logoutBtn') {
  const logoutBtn = document.getElementById(logoutBtnId);
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async () => {
    try {
      await supabase.auth.signOut();
      showMessage('Logged out successfully', 'success');
      setTimeout(() => window.location.href = 'login.html', 1000);
    } catch (err) {
      console.error('Logout failed:', err.message);
      showMessage('Logout failed. Please try again.', 'error');
    }
  });
}

// -------------------- PASSWORD RESET --------------------
export function setupPasswordReset(buttonId = 'forgotPassword') {
  const forgotBtn = document.getElementById(buttonId);
  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt('Enter your registered email:');
    if (!email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });
    if (error) showMessage('Error sending reset email: ' + error.message, 'error');
    else showMessage('Password reset email sent!', 'success');
  });
}

// -------------------- CREATE CARD --------------------
export function createCard(item, type) {
  const card = document.createElement('div');
  card.className = 'card';

  let imgSrc = 'images/default.jpg';
  let title = 'Untitled';
  let intro = '';
  let media = '';

  switch (type) {
    case 'story':
      imgSrc = item.image_url || imgSrc;
      title = item.title || title;
      intro = item.short_intro || '';
      media = `<span>👤 ${item.users?.name || item.author || 'Unknown'}</span>
               <span>🕓 ${new Date(item.created_at).toLocaleDateString()}</span>`;
      break;
    case 'article':
      imgSrc = item.image_url || imgSrc;
      title = item.title || title;
      intro = item.short_intro || '';
      break;
    case 'video':
      imgSrc = item.thumbnail_url || imgSrc;
      title = item.title || title;
      if(item.video_url) media = `<video src="${item.video_url}" controls></video>`;
      break;
  }

  card.innerHTML = `
    <img src="${imgSrc}" alt="${title}" class="card-img">
    <div class="content">
      <h3 class="title">${title}</h3>
      <p class="intro">${intro}</p>
      <div class="meta">${media}</div>
      <button onclick="window.location.href='${type}.html?id=${item.id}'">Read More</button>
    </div>
  `;
  return card;
}

// -------------------- FETCH & RENDER CONTENT --------------------
export async function fetchAndRenderContent(tableName, containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(`*, users(name)`)
      .order('created_at', { ascending: false });
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

// -------------------- REAL-TIME UPDATES --------------------
export function setupRealtimeUpdates() {
  ['stories', 'articles', 'videos'].forEach(type => {
    supabase
      .from(type)
      .on('INSERT', payload => {
        const containerId = type + '-container';
        const container = document.getElementById(containerId);
        const card = createCard(payload.new, type === 'stories' ? 'story' : type === 'articles' ? 'article' : 'video');
        if(container) container.prepend(card);
        showMessage(`${type.slice(0,-1)} added!`, 'success');
      })
      .subscribe();
  });
}

// -------------------- INITIALIZE ALL --------------------
export async function initializePage() {
  await checkAuth(false); // don't redirect on home page
  fetchAndRenderContent('stories', 'stories-container', 'story');
  fetchAndRenderContent('articles', 'articles-container', 'article');
  fetchAndRenderContent('videos', 'videos-container', 'video');
  setupRealtimeUpdates();
}