let currentRole = 'guest';
let currentUserEmail = '';

const loginSection = document.getElementById('loginSection');
const pageContent = document.getElementById('pageContent');
const roleIndicator = document.getElementById('roleIndicator');
const roleSelect = document.getElementById('roleSelect');
const logoutBtn = document.getElementById('logoutBtn');

const loginForm = document.getElementById('loginForm');

const credentials = {
  'admin@spekeresort.com': 'admin123',
  'guest@example.com': '', // guest has no password
};

function updateUIOnLogin() {
  roleIndicator.textContent = currentRole === 'guest' ? 'Guest View' : 'Support Staff View';
  roleIndicator.className = currentRole === 'guest' ? 'badge bg-secondary' : 'badge bg-primary';
  roleSelect.value = currentRole;

  if (currentUserEmail) {
    loginSection.style.display = 'none';
    logoutBtn.classList.remove('d-none');
    loadDashboardPage();
  } else {
    loginSection.style.display = 'block';
    logoutBtn.classList.add('d-none');
  }
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;

  if (credentials[email] !== undefined) {
    if (credentials[email] === '' || credentials[email] === password) {
      currentUserEmail = email;
      currentRole = email === 'admin@spekeresort.com' ? 'support' : 'guest';
      updateUIOnLogin();
    } else {
      alert('Incorrect password');
    }
  } else {
    alert('Unknown user');
  }
});

logoutBtn.addEventListener('click', () => {
  currentUserEmail = '';
  currentRole = 'guest';
  updateUIOnLogin();
  document.getElementById('pageContent').innerHTML = '';
});

roleSelect.addEventListener('change', e => {
  if (!currentUserEmail) return; // prevent changing role if not logged in
  currentRole = e.target.value;
  loadDashboardPage();
  updateUIOnLogin();
});
