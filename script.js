// ✅ Import Supabase client via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ✅ Supabase credentials
const SUPABASE_URL = 'https://ynvhluadxmsjoihdjmky.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE';

// ✅ Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Backend URL
const BACKEND_URL = 'https://myblog-backend-4xr8vcky4ba7.muhammadsaeed158.deno.net/';

// ✅ Container where stories will appear
const container = document.getElementById('stories-container');

// ✅ Fetch stories from Supabase
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
        users(name)
      `)
      .order('id', { ascending: false });

    if (error) throw error;

    displayStories(data);
  } catch (err) {
    console.error('⚠️ Error fetching stories:', err.message);
    container.innerHTML = `<p style="color:red;">Failed to load stories. Please try again later.</p>`;
  }
}

// ✅ Display stories dynamically
function displayStories(stories) {
  container.innerHTML = '';

  if (!stories || stories.length === 0) {
    container.innerHTML = '<p>No stories found.</p>';
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
    container.appendChild(card);
  });
}

// ✅ Footer auto-update year
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// ✅ Fetch stories on page load
document.addEventListener('DOMContentLoaded', fetchStories);

// ✅ Example of calling your backend (optional)
// async function fetchFromBackend() {
//   const res = await fetch(`${BACKEND_URL}/endpoint`);
//   const data = await res.json();
//   console.log('Backend data:', data);
// }