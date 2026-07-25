/* =====================
   JOIN US / APPLY FORM
   Single submit -> opens WhatsApp (pre-filled text) AND email client (pre-filled body).
   Resume is picked in-page via a file input (validated as PDF, filename shown),
   but no browser can auto-attach that local file to WhatsApp or a mailto: link —
   that part has to be done manually once each app opens. This is a platform
   limitation, not something more code can fix.
   ===================== */
(function () {
  const form = document.getElementById('joinForm');
  if (!form) return;

  const statusEl = document.getElementById('joinStatus');
  const resumeInput = document.getElementById('joinResume');
  const resumeLabel = document.getElementById('joinResumeLabel');
  const resumeText = document.getElementById('joinResumeText');

  // ---- CONFIG: update these to your real contact details ----
  const WHATSAPP_NUMBER = '917907948414'; // country code + number, no +, spaces, or dashes
  const HR_EMAIL = 'ledgerpartnersofficial@gmail.com';

  // ---- Resume picker: validate it's a PDF, show the filename ----
  resumeInput.addEventListener('change', function () {
    const file = resumeInput.files && resumeInput.files[0];
    resumeLabel.classList.remove('has-file', 'file-error');

    if (!file) {
      resumeText.textContent = 'Click to select your resume (PDF only)';
      return;
    }

    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      resumeLabel.classList.add('file-error');
      resumeText.textContent = 'That file isn\'t a PDF — please choose a .pdf file';
      resumeInput.value = '';
      return;zz
    }

    resumeLabel.classList.add('has-file');
    resumeText.textContent = file.name;
  });

  function buildMessage(data) {
    return (
      'New Job Application — Ledger Partners\n\n' +
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      'Phone: ' + data.phone + '\n' +
      'Qualification: ' + data.qualification + '\n' +
      'Department of interest: ' + data.department + '\n\n' +
      'Resume file: ' + data.resumeName + ' (please attach this PDF manually here too)'
    );
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const file = resumeInput.files && resumeInput.files[0];

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      qualification: form.qualification.value.trim(),
      department: form.department.value.trim(),
      resumeName: file ? file.name : ''
    };

    // Basic required-field check, including the resume file
    const missingText = ['name', 'email', 'phone', 'qualification', 'department'].filter((k) => !data[k]);
    if (missingText.length) {
      form.reportValidity();
      statusEl.textContent = 'Please fill in all fields before sending.';
      return;
    }
    if (!file) {
      resumeLabel.classList.add('file-error');
      statusEl.textContent = 'Please select your resume (PDF) before sending.';
      return;
    }

    const message = buildMessage(data);

    // 1) Open WhatsApp with the message pre-filled
    const waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank', 'noopener');

    // 2) Open email client with the same details pre-filled
    const subject = 'Job Application — ' + data.department + ' (' + data.name + ')';
    const mailtoUrl =
      'mailto:' + HR_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(message);

    // Slight delay so the browser doesn't block/collide the two pop-ups
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);

    statusEl.textContent = 'Opening WhatsApp and your email app — attach "' + data.resumeName + '" manually in both!';
    form.reset();
    resumeLabel.classList.remove('has-file', 'file-error');
    resumeText.textContent = 'Click to select your resume (PDF only)';
  });
})();