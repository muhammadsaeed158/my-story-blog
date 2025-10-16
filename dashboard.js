import { supabase } from './supabase.js';
const BACKEND_URL = 'https://myblog-backend.muhammadsaeed158.deno.net';

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'auth/login.html';
});

// Auth check
(async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if(error || !user) { window.location.href = 'auth/login.html'; return; }
})();

// Submit story
const form = document.getElementById('storyForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const story = {
    title: document.getElementById('title').value,
    short_intro: document.getElementById('short_intro').value,
    image_url: document.getElementById('image_url').value,
    content: document.getElementById('content').value,
    user_id: supabase.auth.user()?.id
  };
  try {
    const res = await fetch(`${BACKEND_URL}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    });
    const data = await res.json();
    alert('Story published successfully!');
    form.reset();
    fetchMyStories();
  } catch (err) {
    console.error(err);
    alert('Failed to publish story.');
  }
});

// Fetch author's stories
const myStoriesDiv = document.getElementById('my-stories');
async function fetchMyStories() {
  const { data, error } = await supabase.from('stories').select('*').eq('user_id', supabase.auth.user()?.id);
  myStoriesDiv.innerHTML = '';
  if (!data || data.length === 0) { myStoriesDiv.innerHTML = '<p>No stories yet.</p>'; return; }

  data.forEach(story => {
    const div = document.createElement('div');
    div.className = 'story-card';
    div.innerHTML = `
      <h3>${story.title}</h3>
      <button onclick="editStory('${story.id}')"><i class="fas fa-edit"></i> Edit</button>
      <button onclick="deleteStory('${story.id}')"><i class="fas fa-trash"></i> Delete</button>
    `;
    myStoriesDiv.appendChild(div);
  });
}
fetchMyStories();

// Edit & Delete placeholders
window.editStory = id => { alert('Edit feature coming soon!'); }
window.deleteStory = async id => {
  if (!confirm('Delete this story?')) return;
  await fetch(`${BACKEND_URL}/stories/${id}`, { method: 'DELETE' });
  fetchMyStories();
}