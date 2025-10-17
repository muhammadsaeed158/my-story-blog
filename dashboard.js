import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://ynvhluadxmsjoihdjmky.supabase.co',
  'PUBLIC_ANON_KEY' // replace with your Supabase anon key
);

const publishBtn = document.getElementById('publishBtn');
const postType = document.getElementById('postType');
const postTitle = document.getElementById('postTitle');
const postDesc = document.getElementById('postDesc');
const postFile = document.getElementById('postFile');
const postsContainer = document.getElementById('postsContainer');

// Check if user is logged in
supabase.auth.getUser().then(({ data }) => {
  if (!data.user) window.location.href = 'login.html';
});

async function fetchPosts() {
  postsContainer.innerHTML = '';
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
      <h3>${post.title} (${post.type})</h3>
      <p>${post.description}</p>
      ${post.file_url ? `<${post.type === 'video' ? 'video' : 'img'} src="${post.file_url}" ${post.type === 'video' ? 'controls' : ''} width="100%"></${post.type === 'video' ? 'video' : 'img'}>` : ''}
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

async function fetchComments(postId) {
  const { data: comments } = await supabase.from('comments').select('*').eq('post_id', postId);
  const commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.innerHTML = '';
  comments.forEach(c => {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    commentEl.textContent = `${c.user_email}: ${c.text}`;
    commentsDiv.appendChild(commentEl);
  });
}

async function likePost(postId) {
  const { data: post } = await supabase.from('posts').select('likes').eq('id', postId).single();
  const newLikes = (post.likes || 0) + 1;
  await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
  fetchPosts();
}

function showCommentPrompt(postId) {
  const comment = prompt('Write your comment:');
  if (comment) addComment(postId, comment);
}

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

// Upload & publish
publishBtn.addEventListener('click', async () => {
  const type = postType.value;
  const title = postTitle.value;
  const description = postDesc.value;
  const file = postFile.files[0];

  let file_url = null;
  if (file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('posts').upload(fileName, file);
    if (error) return alert('Upload failed: ' + error.message);
    const { publicUrl } = supabase.storage.from('posts').getPublicUrl(fileName);
    file_url = publicUrl;
  }

  const { error } = await supabase.from('posts').insert([{ type, title, description, file_url }]);
  if (error) return alert('Publish failed: ' + error.message);

  postTitle.value = '';
  postDesc.value = '';
  postFile.value = '';
  fetchPosts();
});

// Initial load
fetchPosts();