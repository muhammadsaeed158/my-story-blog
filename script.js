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
// Import createClient from Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co"        // replace with your project URL
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY"                       // replace with your anon public key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Function to load stories
async function loadStories() {
  const { data, error } = await supabase.from("stories").select("*")

  if (error) {
    console.error("Error fetching stories:", error)
    return
  }

  const container = document.getElementById("stories")
  if (!data || data.length === 0) {
    container.innerHTML = "<p>No stories found.</p>"
    return
  }

  container.innerHTML = data.map(story => `
    <div class="story">
      <h3>${story.title}</h3>
      <p>${story.content}</p>
    </div>
  `).join("")
}

// Load stories when page loads
document.addEventListener("DOMContentLoaded", loadStories)
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pglsznvthegivgatupkk.supabase.co'; // yahan aapka Supabase URL
const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY_HERE'; // yahan aapki anon/public key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// 1️⃣ Supabase client setup
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://pglsznvthegivgatupkk.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

// 2️⃣ DOM container
const container = document.getElementById('stories-container');

// 3️⃣ Fetch stories from Supabase
async function fetchStories() {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`id, title, content, short_intro, image_url, user_id`)
      .order('id', { ascending: false });

    if (error) throw error;

    displayStories(data);
  } catch (err) {
    console.error('Error fetching stories:', err.message);
    container.innerHTML = `<p style="color:red;">Failed to load stories.</p>`;
  }
}

// 4️⃣ Display stories dynamically
function displayStories(stories) {
  container.innerHTML = ''; // clear previous content
  stories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <img src="${story.image_url}" alt="${story.title}" class="story-img"/>
      <h2 class="story-title">${story.title}</h2>
      <p class="story-intro">${story.short_intro}</p>
      <p class="story-content">${story.content}</p>
    `;
    container.appendChild(card);
  });
}

// 5️⃣ Call fetch function
fetchStories();
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://pglsznvthegivgatupkk.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

const container = document.getElementById('stories-container');

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
        user_id,
        users(name)  -- Fetch author name
      `)
      .order('id', { ascending: false });

    if (error) throw error;
    displayStories(data);
  } catch (err) {
    console.error('Error fetching stories:', err.message);
    container.innerHTML = `<p style="color:red;">Failed to load stories.</p>`;
  }
}

function displayStories(stories) {
  container.innerHTML = '';
  stories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <img src="${story.image_url}" alt="${story.title}" class="story-img"/>
      <h2 class="story-title">${story.title}</h2>
      <p class="story-author">By: ${story.users?.name || 'Unknown'}</p>
      <p class="story-intro">${story.short_intro}</p>
      <p class="story-content">${story.content}</p>
    `;
    container.appendChild(card);
  });
}

fetchStories();