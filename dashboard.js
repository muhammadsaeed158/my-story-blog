import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔗 Connect your Supabase Project
const supabase = createClient(
  'https://ynvhluadxmsjoihdjmky.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE'
);

// ✅ Elements
const publishBtn = document.getElementById('publishBtn');
const postType = document.getElementById('postType');
const postTitle = document.getElementById('postTitle');
const postDesc = document.getElementById('postDesc');
const postFile = document.getElementById('postFile');
const postsContainer = document.getElementById('postsContainer');

// ✅ Check if logged in
supabase.auth.getUser().then(({ data }) => {
  if (!data.user) window.location.href = 'login.html';
});

// ✅ Fetch posts from Supabase
async function fetchPosts() {
  postsContainer.innerHTML = '<p>Loading posts...</p>';

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return alert('Error fetching posts: ' + error.message);

  postsContainer.innerHTML = '';

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
      <h3>${post.title} (${post.type})</h3>
      <p>${post.description}</p>
      ${
        post.file_url
          ? post.type === 'video'
            ? `<video src="${post.file_url}" controls width="100%"></video>`
            : `<img src="${post.file_url}" width="100%">`
          : ''
      }
      <div class="actions">
        <button onclick="likePost('${post.id}')">👍 ${post.likes || 0}</button>
        <button onclick="showCommentPrompt('${post.id}')">💬 Comment</button>
      </div>
      <div class="comments" id="comments-${post.id}"></div>
    `;
    postsContainer.appendChild(postEl);
    fetchComments(post.id);
  });
}

// ✅ Fetch comments for each post
async function fetchComments(postId) {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId);

  if (error) return;

  const commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.innerHTML = '';
  comments.forEach(c => {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    commentEl.textContent = `${c.user_email}: ${c.text}`;
    commentsDiv.appendChild(commentEl);
  });
}

// ✅ Like post
window.likePost = async function (postId) {
  const { data: post } = await supabase.from('posts').select('likes').eq('id', postId).single();
  const newLikes = (post.likes || 0) + 1;
  await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
  fetchPosts();
};

// ✅ Add comment
window.showCommentPrompt = function (postId) {
  const comment = prompt('Write your comment:');
  if (comment) addComment(postId, comment);
};

async function addComment(postId, text) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) return;
  await supabase.from('comments').insert({
    post_id: postId,
    user_email: user.data.user.email,
    text
  });
  fetchPosts();
}

// ✅ Upload & Publish Post
publishBtn.addEventListener('click', async () => {
  const type = postType.value;
  const title = postTitle.value.trim();
  const description = postDesc.value.trim();
  const file = postFile.files[0];

  if (!title || !description || !type)
    return alert('Please fill all fields before publishing.');

  let file_url = null;

  if (file) {
    const filePath = `uploads/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('posts').upload(filePath, file);

    if (error) return alert('Upload failed: ' + error.message);

    const { data: publicUrlData } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath);

    file_url = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from('posts').insert([
    { type, title, description, file_url, likes: 0 }
  ]);

  if (error) return alert('Publish failed: ' + error.message);

  alert('✅ Post published successfully!');
  postTitle.value = '';
  postDesc.value = '';
  postFile.value = '';
  fetchPosts();
});

// ✅ Load posts initially
fetchPosts();