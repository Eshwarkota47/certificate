// ── Load & render everything on page load ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  renderStats();
});

// ── Get all records from localStorage ───────────────────────
function getAllRecords() {
  return JSON.parse(localStorage.getItem('amf_certificates') || '[]');
}

// ── Render Stats cards ───────────────────────────────────────
function renderStats() {
  const records = getAllRecords();
  document.getElementById('stat-total').textContent     = records.length;
  document.getElementById('stat-interns').textContent   = records.filter(r => r.role === 'Intern').length;
  document.getElementById('stat-volunteers').textContent = records.filter(r => r.role === 'Volunteer').length;
  document.getElementById('stat-others').textContent    = records.filter(r => !['Intern','Volunteer'].includes(r.role)).length;
}

// ── Render Table ─────────────────────────────────────────────
function renderTable(records = null) {
  const data = records ?? getAllRecords();
  const tbody = document.getElementById('cert-table-body');
  const empty = document.getElementById('empty-state');

  tbody.innerHTML = '';

  if (data.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  data.forEach(cert => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code style="font-size:12px; background:#f0f0f0; padding:2px 7px; border-radius:4px;">${cert.certID}</code></td>
      <td style="font-weight:600;">${escapeHtml(cert.name)}</td>
      <td>${roleBadge(cert.role)}</td>
      <td style="max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(cert.event)}</td>
      <td style="font-size:13px; color:#6b7a71;">${formatDate(cert.startDate)} – ${formatDate(cert.endDate)}</td>
      <td style="font-size:13px;">${formatDate(cert.issuedOn)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="regenCertificate('${cert.certID}')">🔁 Re-generate</button>
        <button class="btn btn-danger btn-sm" style="margin-left:6px;" onclick="deleteRecord('${cert.certID}')">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Role badge helper ────────────────────────────────────────
function roleBadge(role) {
  const map = {
    'Intern':             'badge-gold',
    'Volunteer':          'badge-green',
    'Mentor':             'badge-green',
    'Participant':        'badge-gray',
    'Workshop Attendee':  'badge-gray',
  };
  const cls = map[role] || 'badge-gray';
  return `<span class="badge ${cls}">${role}</span>`;
}

// ── Format date ──────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Escape HTML ──────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

// ── Search + Filter ──────────────────────────────────────────
function filterTable() {
  const query  = document.getElementById('search-input').value.toLowerCase();
  const role   = document.getElementById('filter-role').value;
  const all    = getAllRecords();

  const filtered = all.filter(cert => {
    const matchSearch = !query ||
      cert.name.toLowerCase().includes(query)   ||
      cert.event.toLowerCase().includes(query)  ||
      cert.certID.toLowerCase().includes(query);
    const matchRole = !role || cert.role === role;
    return matchSearch && matchRole;
  });

  renderTable(filtered);
}

// ── Delete single record ─────────────────────────────────────
function deleteRecord(certID) {
  if (!confirm(`Delete certificate ${certID}? This cannot be undone.`)) return;
  const updated = getAllRecords().filter(r => r.certID !== certID);
  localStorage.setItem('amf_certificates', JSON.stringify(updated));
  renderTable();
  renderStats();
}

// ── Re-generate certificate (redirect to index with prefill) ─
function regenCertificate(certID) {
  const cert = getAllRecords().find(r => r.certID === certID);
  if (!cert) return;
  // Store in sessionStorage so index.html can prefill
  sessionStorage.setItem('amf_prefill', JSON.stringify(cert));
  window.location.href = 'index.html';
}

// ── Clear All modal ──────────────────────────────────────────
function confirmClearAll() {
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}
function clearAll() {
  localStorage.removeItem('amf_certificates');
  closeModal();
  renderTable();
  renderStats();
}