import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://ynvhluadxmsjoihdjmky.supabase.co',
  'YOUR_PUBLIC_ANON_KEY'
);

const form = document.getElementById('contactForm');
const msgStatus = document.getElementById('msgStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const { error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, message }]);

  if (error) {
    msgStatus.textContent = 'Failed to send message 😞';
    console.error(error);
  } else {
    msgStatus.textContent = 'Message sent successfully! ✅';
    form.reset();
  }
});