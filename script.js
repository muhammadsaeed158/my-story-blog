<<<<<<< HEAD
import { supabase } from './supabase.js'; // Make sure supabase.js is in the same folder

const BACKEND_URL = 'https://my-blog-api.deno.dev';

// -------------------- FOOTER YEAR --------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------------------- MESSAGES --------------------
function showMessage(msg, type = 'info') {
  // type: 'info' | 'success' | 'error'
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

  setTimeout(() => {
    messageEl.style.opacity = '0';
  }, 4000);
}

// -------------------- LOGOUT --------------------
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
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
const forgotBtn = document.getElementById('forgotPassword');
if (forgotBtn) {
  forgotBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = prompt('Enter your registered email:');
    if (!email) return;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });
    if (error) {
      showMessage('Error sending reset email: ' + error.message, 'error');
    } else {
      showMessage('Password reset email sent!', 'success');
    }
  });
}

// -------------------- AUTH CHECK --------------------
(async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    window.location.href = 'login.html';
  }
})();

// -------------------- CREATE CARD --------------------
function createCard(item, type) {
  const card = document.createElement('div');
  card.className = 'card';
  let imgSrc = 'images/default.jpg';
  let title = '';
  let intro = '';
  let media = '';

  switch (type) {
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

// -------------------- FETCH & RENDER --------------------
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

// -------------------- INITIALIZE --------------------
fetchAndRenderContent('stories', 'stories-container', 'story');
fetchAndRenderContent('articles', 'articles-container', 'article');
fetchAndRenderContent('videos', 'videos-container', 'video');

// -------------------- REAL-TIME --------------------
['stories', 'articles', 'videos'].forEach(type => {
  supabase
    .from(type)
    .on('INSERT', payload => {
      const containerId = type + '-container';
      const container = document.getElementById(containerId);
      const card = createCard(payload.new, type === 'stories' ? 'story' : type === 'articles' ? 'article' : 'video');
      if(container) container.prepend(card);
      showMessage(`${type.slice(0, -1)} added!`, 'success');
    })
    .subscribe();
});
=======
alert("JavaScript Connected!");
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("read-more-btn");
  const moreText = document.getElementById("more-text");
  const shortText = document.getElementById("short-text");

  btn.addEventListener("click", function () {
    if (moreText.style.display === "none") {
      moreText.style.display = "block";
      btn.innerText = "Read Less";
    } else {
      moreText.style.display = "none";
      btn.innerText = "Read More";
    }
  });
});
<script src="script.js"></script>
</body>
</html>
// Footer me current year automatic dalna
document.addEventListener("DOMContentLoaded", function () {
  const yearSpan = document.getElementById("year");
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
});
// Supabase client setup
const { createClient } = supabase;

// Replace with your Supabase project details
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY";

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// Load stories function
async function loadStories() {
  let { data, error } = await db.from("stories").select("*");
  
  if (error) {
    console.error("Error loading stories:", error);
    return;
  }

  const storyContainer = document.getElementById("stories");

  if (data.length === 0) {
    storyContainer.innerHTML = "<p>No stories found.</p>";
    return;
  }

  storyContainer.innerHTML = data.map(story => `
    <div class="story">
      <h3>${story.title}</h3>
      <p>${story.content}</p>
    </div>
  `).join("");
}

// Call on page load
document.addEventListener("DOMContentLoaded", loadStories);
// Supabase client import (via CDN)
const { createClient } = supabase;

// Your Supabase credentials
const SUPABASE_URL = "https://pglsznvthegivgatupkk.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY"; // copy from API settings

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to load stories
async function loadStories() {
  const { data, error } = await supabase.from("stories").select("*");

  if (error) {
    console.error("Error fetching stories:", error);
    return;
  }

  const container = document.getElementById("stories");
  if (!data || data.length === 0) {
    container.innerHTML = "<p>No stories found.</p>";
    return;
  }

  container.innerHTML = data.map(story => `
    <div class="story">
      <h3>${story.title}</h3>
      <p>${story.content}</p>
    </div>
  `).join("");
}

// Load stories when page loads
document.addEventListener("DOMContentLoaded", loadStories);
>>>>>>> c8cf8bc (Updated backend files and added new models)
