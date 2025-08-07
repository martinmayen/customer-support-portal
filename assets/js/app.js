// 🔐 Simulated Login
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const roleSelect = document.getElementById('role');
const loginSection = document.getElementById('login-section');
const portalSection = document.getElementById('portal-section');

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const role = roleSelect.value;

  if (username) {
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    loginSection.style.display = 'none';
    portalSection.style.display = 'block';
    document.getElementById('userDisplay').textContent = username;
    showSection('tickets'); // Default section
  } else {
    alert('Please enter a username.');
  }
});

// 🚀 Section Navigation
function showSection(sectionId) {
  const sections = document.querySelectorAll('.pageContent section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  document.getElementById(sectionId).style.display = 'block';

  // Load content for certain sections
  if (sectionId === 'knowledge-base') {
    loadKnowledgeBase();
  }
}

// 🔄 Navigation Link Behavior
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('data-target');
    showSection(target);
  });
});

// 🧠 Load Knowledge Base Articles (Static)
function loadKnowledgeBase() {
  const kbContainer = document.getElementById('kbAccordion');
  if (!kbContainer || kbContainer.dataset.loaded === "true") return;

  const articles = [
    {
      question: "How do I make a reservation?",
      answer: "You can make a reservation on our website or by calling +256 414 259 221."
    },
    {
      question: "What time is check-in and check-out?",
      answer: "Check-in is from 2:00 PM, and check-out is by 11:00 AM."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes, airport pickup can be arranged upon request at a fee. Contact reception to schedule."
    },
    {
      question: "Is breakfast included?",
      answer: "Yes, a continental breakfast is included in most room packages unless stated otherwise."
    },
    {
      question: "How can I cancel or modify my booking?",
      answer: "Call the front desk at +256 414 259 221 or email reservations@spekehotel.com with your booking details."
    }
  ];

  articles.forEach((article, index) => {
    const id = `kbItem${index}`;
    const item = document.createElement('div');
    item.classList.add('accordion-item');

    item.innerHTML = `
      <h2 class="accordion-header" id="heading${id}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="false" aria-controls="collapse${id}">
          ${article.question}
        </button>
      </h2>
      <div id="collapse${id}" class="accordion-collapse collapse" aria-labelledby="heading${id}" data-bs-parent="#kbAccordion">
        <div class="accordion-body">
          ${article.answer}
        </div>
      </div>
    `;

    kbContainer.appendChild(item);
  });

  kbContainer.dataset.loaded = "true"; // Prevent reloading
}

// 👀 Role-based View (Guest vs Support)
const role = localStorage.getItem('role');
if (role === 'support') {
  document.body.classList.add('support-role');
} else {
  document.body.classList.add('guest-role');
}

// 🕓 Auto-login if stored
window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  if (username && role) {
    loginSection.style.display = 'none';
    portalSection.style.display = 'block';
    document.getElementById('userDisplay').textContent = username;
    showSection('tickets');
  }
});
