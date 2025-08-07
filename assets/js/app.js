// Ticket handling logic
const ticketForm = document.getElementById('ticketForm');
const ticketList = document.getElementById('ticketList');

// Load tickets from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedTickets = JSON.parse(localStorage.getItem('tickets')) || [];
  savedTickets.forEach(ticket => addTicketToUI(ticket));
});

ticketForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const ticket = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    issue: document.getElementById('issue').value.trim(),
    time: new Date().toLocaleString()
  };

  // Add to UI
  addTicketToUI(ticket);

  // Save to localStorage
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  tickets.unshift(ticket);
  localStorage.setItem('tickets', JSON.stringify(tickets));

  // Clear form
  ticketForm.reset();
});

function addTicketToUI(ticket) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerHTML = `
    <div class="d-flex justify-content-between">
      <strong>${ticket.name}</strong>
      <small>${ticket.time}</small>
    </div>
    <div class="text-muted">${ticket.email}</div>
    <p class="mt-2">${ticket.issue}</p>
  `;
  ticketList.prepend(li);
}
