import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://ynvhluadxmsjoihdjmky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE'
);

// ------------------ AUTH CHECK ------------------
supabase.auth.getUser().then(({ data }) => {
  if (!data.user) window.location.href = 'login.html';
});

// ------------------ LOGOUT ------------------
document.getElementById('logoutBtn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) window.location.href = 'login.html';
  else alert('Logout failed. Try again.');
});

// ------------------ MESSAGE ------------------
function showMessage(msg, type='info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = msg;
  messageEl.style.background = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
  messageEl.style.opacity = '1';
  setTimeout(() => messageEl.style.opacity = '0', 4000);
}

// ------------------ PUBLISH FUNCTIONS ------------------
async function publishStory(e){
  e.preventDefault();
  const title = document.getElementById('storyTitle').value;
  const intro = document.getElementById('storyIntro').value;
  const image_url = document.getElementById('storyImage').value;

  const { data, error } = await supabase.from('stories').insert([{ title, short_intro: intro, image_url }]);
  if(error) showMessage(error.message, 'error');
  else { showMessage('Story published!', 'success'); e.target.reset(); }
}

async function publishArticle(e){
  e.preventDefault();
  const title = document.getElementById('articleTitle').value;
  const intro = document.getElementById('articleIntro').value;
  const image_url = document.getElementById('articleImage').value;

  const { data, error } = await supabase.from('articles').insert([{ title, short_intro: intro, image_url }]);
  if(error) showMessage(error.message, 'error');
  else { showMessage('Article published!', 'success'); e.target.reset(); }
}

async function publishVideo(e){
  e.preventDefault();
  const title = document.getElementById('videoTitle').value;
  const video_url = document.getElementById('videoURL').value;
  const thumbnail_url = document.getElementById('videoThumbnail').value;

  const { data, error } = await supabase.from('videos').insert([{ title, video_url, thumbnail_url }]);
  if(error) showMessage(error.message, 'error');
  else { showMessage('Video published!', 'success'); e.target.reset(); }
}

// ------------------ FORM EVENT LISTENERS ------------------
document.getElementById('storyForm').addEventListener('submit', publishStory);
document.getElementById('articleForm').addEventListener('submit', publishArticle);
document.getElementById('videoForm').addEventListener('submit', publishVideo);