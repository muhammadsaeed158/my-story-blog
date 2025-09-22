document.addEventListener("DOMContentLoaded", function() {
    const stories = [
        {title: "Story 1", img: "images/story1.jpg", link: "post1.html"},
        {title: "Story 2", img: "images/story2.jpg", link: "post2.html"},
        {title: "Story 3", img: "images/story3.jpg", link: "post3.html"}
    ];

    const storiesList = document.getElementById('storiesList');
    if(storiesList){
        stories.forEach(story => {
            const storyDiv = document.createElement('div');
            storyDiv.classList.add('story');
            storyDiv.innerHTML = `
                <a href="${story.link}">
                    <img src="${story.img}" alt="${story.title}">
                    <h3>${story.title}</h3>
                </a>
            `;
            storiesList.appendChild(storyDiv);
        });
    }

    // Contact form validation
    const contactForm = document.getElementById("contactForm");
    if(contactForm){
        contactForm.addEventListener("submit", function(e){
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if(name === "" || email === "" || message === ""){
                alert("Please fill all fields!");
                return;
            }

            alert("Thank you for your message!");
            contactForm.reset();
        });
    }
});
<footer>
  <p>&copy; 2025 MyBlog. All rights reserved.</p>
</footer>