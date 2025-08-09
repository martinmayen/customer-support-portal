// Ticket management logic

function loadTickets() {
  return JSON.parse(localStorage.getItem('tickets') || '[]');
}

function saveTickets(tickets) {
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

function getStatusColor(status) {
  switch (status) {
    case 'Open': return 'warning';
    case 'In Progress': return 'info';
    case 'Closed': return 'success';
    default: return 'secondary';
  }
}

function renderAdminActions(ticket) {
  return `
    <label>Status:</label>
    <select class="form-select form-select-sm mb-2 statusDropdown" data-id="${ticket.id}">
      <option ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
      <option ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
      <option ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
    </select>
  `;
}

function renderTickets() {
  const tickets = loadTickets();
  let filtered = currentRole === 'guest'
    ? tickets.filter(t => t.email === currentUserEmail)
    : tickets;

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

function attachDynamicListeners() {
  const form = document.getElementById('ticketForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('ticketName').value.trim();
      const email = document.getElementById('ticketEmail').value.trim();
      const issue = document.getElementById('ticketIssue').value.trim();
      if (!name || !email || !issue) return;

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

      loadDashboardPage();
    });
  }

  document.querySelectorAll('.statusDropdown').forEach(drop => {
    drop.addEventListener('change', function () {
      const id = this.getAttribute('data-id');
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

  document.querySelectorAll('.replyForm').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const id = this.getAttribute('data-id');
      const input = this.querySelector('.replyInput');
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

function loadDashboardPage() {
  if (!currentUserEmail) {
    document.getElementById('pageContent').innerHTML = '';
    return;
  }

  let dashboardHTML = '';

  if (currentRole === 'guest') {
    dashboardHTML += `
      <h4>Submit a New Ticket</h4>
      <form id="ticketForm" class="mb-4">
        <div class="mb-2">
          <label>Name</label>
          <input type="text" id="ticketName" class="form-control" required>
        </div>
        <div class="mb-2">
          <label>Email</label>
          <input type="email" id="ticketEmail" class="form-control" value="${currentUserEmail}" readonly required>
        </div>
        <div class="mb-2">
          <label>Issue</label>
          <textarea id="ticketIssue" rows="3" class="form-control" required></textarea>
        </div>
        <button type="submit" class="btn btn-success">Submit Ticket</button>
      </form>
    `;
  }

  dashboardHTML += `
    <h4>${currentRole === 'guest' ? 'My Tickets' : 'All Tickets'}</h4>
    <div id="ticketList">${renderTickets()}</div>
  `;

  document.getElementById('pageContent').innerHTML = dashboardHTML;
  attachDynamicListeners();
}

// Initialize UI on page load or after login
document.addEventListener('DOMContentLoaded', () => {
  if (currentUserEmail) {
    loadDashboardPage();
  }
});
