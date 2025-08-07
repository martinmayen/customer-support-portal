let currentRole = 'guest';
let userEmail = ''; // For guest tracking

const ticketFormHTML = `
  <h4>Submit a New Ticket</h4>
  <form id="ticketForm" class="mb-4">
    <div class="mb-2">
      <label>Name</label>
      <input type="text" id="ticketName" class="form-control" required>
    </div>
    <div class="mb-2">
      <label>Email</label>
      <input type="email" id="ticketEmail" class="form-control" required>
    </div>
    <div class="mb-2">
      <label>Issue</label>
      <textarea id="ticketIssue" rows="3" class="form-control" required></textarea>
    </div>
    <button type="submit" class="btn btn-success">Submit Ticket</button>
  </form>
`;

const pages = {
  dashboard: '',
  knowledge: `
    <h2>📚 Knowledge Base</h2>
    <p>Hotel FAQs and How-To guides coming soon.</p>
  `
};

function updateRoleDisplay() {
  const roleLabel = document.getElementById("roleIndicator");
  roleLabel.textContent = currentRole === 'guest' ? "Guest View" : "Support Staff View";
  roleLabel.className = currentRole === 'guest' ? "badge bg-secondary" : "badge bg-primary";
}

// Load all tickets from localStorage
function loadTickets() {
  return JSON.parse(localStorage.getItem("tickets") || "[]");
}

function saveTickets(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function renderTickets() {
  const tickets = loadTickets();
  let filtered = currentRole === 'guest' ? tickets.filter(t => t.email === userEmail) : tickets;

  if (filtered.length === 0) {
    return `<div class="alert alert-warning">No tickets found.</div>`;
  }

  return filtered.map(ticket => `
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <strong>${ticket.name}</strong>
        <span class="badge bg-${getStatusColor(ticket.status)}">${ticket.status}</span>
      </div>
      <div class="card-body">
        <p><strong>Email:</strong> ${ticket.email}</p>
        <p><strong>Issue:</strong> ${ticket.issue}</p>
        <p><small>Submitted: ${ticket.time}</small></p>

        ${currentRole === 'support' ? renderAdminActions(ticket) : ''}

        <hr/>
        <h6>Replies:</h6>
        <div id="replies-${ticket.id}">
          ${(ticket.replies || []).map(r => `<p><strong>${r.by}:</strong> ${r.msg}</p>`).join('')}
        </div>

        ${currentRole === 'support' ? `
          <form data-id="${ticket.id}" class="replyForm mt-2">
            <input type="text" class="form-control form-control-sm mb-2 replyInput" placeholder="Reply...">
            <button class="btn btn-sm btn-outline-primary">Send</button>
          </form>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function getStatusColor(status) {
  switch (status) {
    case 'Open': return 'warning';
    case 'In Progress': return 'info';
    case 'Resolved': return 'success';
    default: return 'secondary';
  }
}

function renderAdminActions(ticket) {
  return `
    <label>Status:</label>
    <select class="form-select form-select-sm mb-2 statusDropdown" data-id="${ticket.id}">
      <option ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
      <option ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
      <option ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
    </select>
  `;
}

// Initialize page
function loadDashboardPage() {
  pages.dashboard = `
    ${currentRole === 'guest' ? ticketFormHTML : ''}
    <h4>${currentRole === 'guest' ? 'My Tickets' : 'All Tickets'}</h4>
    <div id="ticketList">${renderTickets()}</div>
  `;
  document.getElementById("pageContent").innerHTML = pages.dashboard;
  attachDynamicListeners();
}

function attachDynamicListeners() {
  // Form submission
  const form = document.getElementById("ticketForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("ticketName").value.trim();
      const email = document.getElementById("ticketEmail").value.trim();
      const issue = document.getElementById("ticketIssue").value.trim();
      const ticket = {
        id: Date.now().toString(),
        name,
        email,
        issue,
        time: new Date().toLocaleString(),
        status: "Open",
        replies: []
      };

      const tickets = loadTickets();
      tickets.unshift(ticket);
      saveTickets(tickets);
      userEmail = email; // track guest
      loadDashboardPage();
    });
  }

  // Status dropdown
  document.querySelectorAll(".statusDropdown").forEach(drop => {
    drop.addEventListener("change", function () {
      const id = this.getAttribute("data-id");
      const status = this.value;
      const tickets = loadTickets();
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        ticket.status = status;
        saveTickets(tickets);
        loadDashboardPage();
      }
    });
  });

  // Reply form
  document.querySelectorAll(".replyForm").forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = this.getAttribute("data-id");
      const input = this.querySelector(".replyInput");
      const msg = input.value.trim();
      if (!msg) return;
      const tickets = loadTickets();
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        ticket.replies = ticket.replies || [];
        ticket.replies.push({ by: "Support", msg });
        saveTickets(tickets);
        loadDashboardPage();
      }
    });
  });
}

// Page navigation
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-link").forEach(nav => nav.classList.remove("active"));
    link.classList.add("active");

    const page = link.getAttribute("data-page");
    if (page === 'dashboard') {
      loadDashboardPage();
    } else {
      document.getElementById("pageContent").innerHTML = pages[page];
    }
  });
});

// Role switching
document.getElementById("roleSelect").addEventListener("change", (e) => {
  currentRole = e.target.value;
  if (currentRole === 'guest') userEmail = '';
  updateRoleDisplay();
  loadDashboardPage();
});

// Load initial page
document.addEventListener("DOMContentLoaded", () => {
  updateRoleDisplay();
  loadDashboardPage();
});
