// ── Constants ──────────────────────────────────────────────
const CANVAS_W = 1000;
const CANVAS_H = 700;

// ── Utility: Generate unique Certificate ID ─────────────────
function generateCertID() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AMF-${year}-${rand}`;
}

// ── Utility: Format date nicely ─────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Utility: Show alert ─────────────────────────────────────
function showAlert(msg, type = 'success') {
  const el = document.getElementById('alert');
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ── Validate Form ────────────────────────────────────────────
function validateForm() {
  const fields = ['rec-name', 'rec-role', 'rec-event', 'rec-start', 'rec-end'];
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    showAlert('Please fill in all required fields.', 'error');
    return false;
  }

  const start = new Date(document.getElementById('rec-start').value);
  const end   = new Date(document.getElementById('rec-end').value);
  if (end < start) {
    document.getElementById('rec-end').classList.add('error');
    showAlert('End date cannot be before start date.', 'error');
    return false;
  }

  return true;
}

// ── Draw Certificate on Canvas ───────────────────────────────
function drawCertificate(data) {
  const canvas = document.getElementById('cert-canvas');
  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');

  // ── Background
  ctx.fillStyle = '#fffdf6';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // ── Outer border (gold double line)
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 12;
  ctx.strokeRect(18, 18, CANVAS_W - 36, CANVAS_H - 36);
  ctx.strokeStyle = '#e8d48a';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, CANVAS_W - 60, CANVAS_H - 60);

  // ── Corner ornaments
  drawCornerOrnaments(ctx);

  // ── Green header band
  ctx.fillStyle = '#1a6b3c';
  ctx.fillRect(30, 30, CANVAS_W - 60, 90);

  // ── Foundation name in header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('AMAANITVAM FOUNDATION', CANVAS_W / 2, 72);

  ctx.font = '13px Georgia, serif';
  ctx.fillStyle = 'rgba(255,255,255,0.80)';
  ctx.fillText('Empowering Communities Through Education & Skill Development', CANVAS_W / 2, 96);

  // ── "This is to certify that" label
  ctx.fillStyle = '#888';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('This is to certify that', CANVAS_W / 2, 172);

  // ── Recipient name (large, green)
  ctx.fillStyle = '#1a6b3c';
  ctx.font = 'bold 52px Georgia, serif';
  ctx.fillText(data.name, CANVAS_W / 2, 248);

  // ── Decorative line under name
  const lineW = 420;
  const lineX = (CANVAS_W - lineW) / 2;
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lineX, 262);
  ctx.lineTo(lineX + lineW, 262);
  ctx.stroke();

  // ── Role text
  ctx.fillStyle = '#444';
  ctx.font = '18px Georgia, serif';
  ctx.fillText(`has successfully completed the program as`, CANVAS_W / 2, 304);

  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText(data.role, CANVAS_W / 2, 342);

  // ── Event name
  ctx.fillStyle = '#222';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText(data.event, CANVAS_W / 2, 392);

  // ── Duration
  ctx.fillStyle = '#666';
  ctx.font = '15px Georgia, serif';
  ctx.fillText(`${formatDate(data.startDate)}  –  ${formatDate(data.endDate)}`, CANVAS_W / 2, 422);

  // ── Horizontal divider
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 470);
  ctx.lineTo(CANVAS_W - 80, 470);
  ctx.stroke();

  // ── Signature section
  drawSignatureSection(ctx, data);

  // ── Certificate ID (bottom center)
  ctx.fillStyle = '#aaa';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`Certificate ID: ${data.certID}`, CANVAS_W / 2, CANVAS_H - 42);

  // ── Seal
  drawSeal(ctx, CANVAS_W - 130, CANVAS_H - 130);
}

// ── Corner ornaments ─────────────────────────────────────────
function drawCornerOrnaments(ctx) {
  const positions = [
    [44, 44], [CANVAS_W - 44, 44],
    [44, CANVAS_H - 44], [CANVAS_W - 44, CANVAS_H - 44]
  ];
  ctx.fillStyle = '#c9a84c';
  positions.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ── Signature section ────────────────────────────────────────
function drawSignatureSection(ctx, data) {
  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.issuer, 220, 530);

  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 544); ctx.lineTo(340, 544);
  ctx.stroke();

  ctx.fillStyle = '#999';
  ctx.font = '12px Georgia, serif';
  ctx.fillText('Authorized Signatory', 220, 560);

  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(formatDate(data.issuedOn), CANVAS_W - 220, 530);

  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CANVAS_W - 340, 544); ctx.lineTo(CANVAS_W - 100, 544);
  ctx.stroke();

  ctx.fillStyle = '#999';
  ctx.font = '12px Georgia, serif';
  ctx.fillText('Date of Issue', CANVAS_W - 220, 560);
}

// ── Decorative seal ──────────────────────────────────────────
function drawSeal(ctx, cx, cy) {
  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI * 2);
  ctx.strokeStyle = '#1a6b3c';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 43, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(26,107,60,0.08)';
  ctx.fill();

  ctx.fillStyle = '#1a6b3c';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('AMAANITVAM', cx, cy - 6);
  ctx.fillText('FOUNDATION', cx, cy + 8);

  ctx.fillStyle = '#c9a84c';
  ctx.font = '10px Georgia, serif';
  ctx.fillText('✦ CERTIFIED ✦', cx, cy + 22);
}

// ── Main: Generate Certificate ───────────────────────────────
function generateCertificate() {
  if (!validateForm()) return;

  const data = {
    name:      document.getElementById('rec-name').value.trim(),
    role:      document.getElementById('rec-role').value,
    event:     document.getElementById('rec-event').value.trim(),
    startDate: document.getElementById('rec-start').value,
    endDate:   document.getElementById('rec-end').value,
    issuer:    document.getElementById('rec-issuer').value.trim() || 'Amaanitvam Foundation',
    issuedOn:  new Date().toISOString().split('T')[0],
    certID:    generateCertID(),
  };

  drawCertificate(data);

  document.getElementById('preview-card').style.display = 'block';
  document.getElementById('cert-id-badge').textContent = data.certID;

  saveCertificate(data);
  showAlert(`Certificate generated! ID: ${data.certID}`);
  document.getElementById('preview-card').scrollIntoView({ behavior: 'smooth', block: 'start' });

  window._currentCertData = data;
}

// ── Save to localStorage ─────────────────────────────────────
function saveCertificate(data) {
  const records = JSON.parse(localStorage.getItem('amf_certificates') || '[]');
  records.unshift({ ...data, savedAt: new Date().toISOString() });
  localStorage.setItem('amf_certificates', JSON.stringify(records));
}

// ── Download PNG ─────────────────────────────────────────────
function downloadImage() {
  const canvas = document.getElementById('cert-canvas');
  const link = document.createElement('a');
  link.download = `Certificate_${window._currentCertData?.certID || 'AMF'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── Download PDF ─────────────────────────────────────────────
function downloadPDF() {
  const canvas = document.getElementById('cert-canvas');
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CANVAS_W, CANVAS_H] });
  pdf.addImage(imgData, 'PNG', 0, 0, CANVAS_W, CANVAS_H);
  pdf.save(`Certificate_${window._currentCertData?.certID || 'AMF'}.pdf`);
}

// ── Prefill form if coming from Admin re-generate ────────────
document.addEventListener('DOMContentLoaded', () => {
  const prefill = sessionStorage.getItem('amf_prefill');
  if (!prefill) return;
  const cert = JSON.parse(prefill);
  sessionStorage.removeItem('amf_prefill');

  document.getElementById('rec-name').value   = cert.name;
  document.getElementById('rec-role').value   = cert.role;
  document.getElementById('rec-event').value  = cert.event;
  document.getElementById('rec-start').value  = cert.startDate;
  document.getElementById('rec-end').value    = cert.endDate;
  document.getElementById('rec-issuer').value = cert.issuer;

  // Auto-generate preview
  generateCertificate();
});

// ── Reset form ───────────────────────────────────────────────
function resetForm() {
  ['rec-name','rec-role','rec-event','rec-start','rec-end'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('error');
  });
  document.getElementById('rec-issuer').value = 'Amaanitvam Foundation';
  document.getElementById('preview-card').style.display = 'none';
  window._currentCertData = null;
}