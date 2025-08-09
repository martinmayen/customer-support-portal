let currentRole = 'guest';
let loggedInUserEmail = '';

const ticketFormHTML = `
  <h4>Submit a New Ticket</h4>
  <form id="ticketForm" class="mb-4">
    <div class="mb-3">
      <label for="ticketName" class="form-label">Name</label>
      <input type="text" id="ticketName" class="form-control" required />
    </div>
    <div class="mb-3">
      <label for="ticketEmail" class="form-label">Email</label>
      <input type="email" id="ticketEmail" class="form-control" required />
    </div>
    <div class="mb-3">
      <label for="ticketIssue" class="form-label">Issue</label>
      <textarea id="ticketIssue" rows="3" class="form-control" required></textarea>
    </div>
    <button type="submit" class="btn btn-success">Submit Ticket</button>
  </form>
`;

function updateRoleDisplay() {
  const roleLabel = document.getElementById("roleIndicator");
  roleLabel.textContent = currentRole === 'guest' ? "Guest View" : "Support Staff View";
  roleLabel.className = currentRole === 'guest' ? "badge bg-secondary ms-auto" : "badge bg-primary ms-auto";
}

// Load tickets from localStorage
function loadTickets() {
  return JSON.parse(localStorage.getItem("tickets") || "[]");
}

// Save tickets to localStorage
function saveTickets(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

// Render tickets in cards
function renderTickets() {
  const tickets = loadTickets();
  let filtered = currentRole === 'guest' ? tickets.filter(t => t.email === loggedInUserEmail) : tickets;

  if (filtered.length === 0) {
    return `<div class="alert alert-warning">No tickets found.</div>`;
  }

  return filtered.map(ticket => `
    <div class="card mb-3 shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
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
          <form data-id="${ticket.id}" class="replyForm mt-3">
            <input type="text" class="form-control form-control-sm mb-2 replyInput" placeholder="Write a reply..." />
            <button class="btn btn-sm btn-outline-primary">Send Reply</button>
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
    <label for="status-${ticket.id}" class="form-label">Status:</label>
    <select id="status-${ticket.id}" class="form-select form-select-sm mb-3 statusDropdown" data-id="${ticket.id}">
      <option ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
      <option ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
      <option ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
      <option ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
    </select>
  `;
}

// Render login/logout section
function renderLoginSection() {
  if (loggedInUserEmail) {
    return `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div><strong>Logged in as:</strong> ${loggedInUserEmail}</div>
        <button id="logoutBtn" class="btn btn-outline-danger btn-sm">Logout</button>
      </div>
    `;
  }

  return `
    <h4>Login</h4>
    <form id="loginForm" class="mb-4">
      <div class="mb-3">
        <label for="loginEmail" class="form-label">Email</label>
        <input type="email" id="loginEmail" class="form-control" placeholder="Enter email" required />
      </div>
      <div class="mb-3">
        <label for="loginRole" class="form-label">Role</label>
        <select id="loginRole" class="form-select" required>
          <option value="guest" selected>Guest</option>
          <option value="support">Support Staff</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  `;
}

// Load dashboard content
function loadDashboard() {
  const main = document.getElementById("pageContent");
  main.innerHTML = `
    <section id="login-section">
      ${renderLoginSection()}
    </section>
    <section id="tickets-section" class="mt-4">
      <h4>${currentRole === 'guest' ? "Submit a Ticket & My Tickets" : "All Tickets"}</h4>
      ${currentRole === 'guest' ? ticketFormHTML : ''}
      <div id="ticketList">${renderTickets()}</div>
    </section>

    <section id="faq-section" class="mt-5">
      <h2>Hotel FAQs & How-to Guides</h2>
      <div class="accordion" id="faqAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseOne" aria-expanded="false" aria-controls="faqCollapseOne">
              How do I make a reservation?
            </button>
          </h2>
          <div id="faqCollapseOne" class="accordion-collapse collapse" aria-labelledby="faqHeadingOne" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              You can book online via our official website or call +256 414 259221.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseTwo" aria-expanded="false" aria-controls="faqCollapseTwo">
              What types of rooms are available?
            </button>
          </h2>
          <div id="faqCollapseTwo" class="accordion-collapse collapse" aria-labelledby="faqHeadingTwo" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Deluxe Rooms, Executive Suites, and Business Apartments — all air-conditioned with Wi-Fi, minibar, and TV.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseThree" aria-expanded="false" aria-controls="faqCollapseThree">
              What time is check-in and check-out?
            </button>
          </h2>
          <div id="faqCollapseThree" class="accordion-collapse collapse" aria-labelledby="faqHeadingThree" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Check-in starts at 2:00 PM, check-out by 11:00 AM.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingFour">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseFour" aria-expanded="false" aria-controls="faqCollapseFour">
              Do you provide airport transfers?
            </button>
          </h2>
          <div id="faqCollapseFour" class="accordion-collapse collapse" aria-labelledby="faqHeadingFour" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Yes, airport pick-up and drop-off are available on request. Charges may apply.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="faqHeadingFive">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseFive" aria-expanded="false" aria-controls="faqCollapseFive">
              Can I cancel or modify my booking?
            </button>
          </h2>
          <div id="faqCollapseFive" class="accordion-collapse collapse" aria-labelledby="faqHeadingFive" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              Cancellations free up to 48 hours before check-in. Charges apply afterward.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  attachListeners();
  updateRoleDisplay();
}

// Attach event listeners for login, tickets, replies, status updates
function attachListeners() {
  // Login form submit
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const role = document.getElementById("loginRole").value;
      if (email) {
        currentRole = role;
        loggedInUserEmail = email;
        loadDashboard();
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      loggedInUserEmail = '';
      currentRole = 'guest';
      loadDashboard();
    });
  }

  // Ticket form submit
  const ticketForm = document.getElementById("ticketForm");
  if (ticketForm) {
    ticketForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("ticketName").value.trim();
      const email = document.getElementById("ticketEmail").value.trim();
      const issue = document.getElementById("ticketIssue").value.trim();
      if (!name || !email || !issue) return;

      const newTicket = {
        id: Date.now().toString(),
        name,
        email,
        issue,
        time: new Date().toLocaleString(),
        status: "Open",
        replies: []
      };

      const tickets = loadTickets();
      tickets.unshift(newTicket);
      saveTickets(tickets);
      loggedInUserEmail = email; // Keep user logged in after ticket submit
      loadDashboard();
    });
  }

  // Status dropdown change (support role only)
  document.querySelectorAll(".statusDropdown").forEach(select => {
    select.addEventListener("change", function () {
      const id = this.getAttribute("data-id");
      const status = this.value;
      const tickets = loadTickets();
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        ticket.status = status;
        saveTickets(tickets);
        loadDashboard();
      }
    });
  });

  // Reply form submit (support role only)
  document.querySelectorAll(".replyForm").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const id = form.getAttribute("data-id");
      const input = form.querySelector(".replyInput");
      const msg = input.value.trim();
      if (!msg) return;

      const tickets = loadTickets();
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        ticket.replies = ticket.replies || [];
        ticket.replies.push({ by: "Support", msg });
        saveTickets(tickets);
        loadDashboard();
      }
    });
  });
}

// Initialize page on load
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});
