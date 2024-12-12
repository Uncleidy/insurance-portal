// Policies storage (simulating a database)
let policies = [];

// Admin Portal: Handle form submission to create a new policy
document.getElementById('create-policy-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const startDate = document.getElementById('start-date').value.trim();
  const endDate = document.getElementById('end-date').value.trim();
  const policyDoc = document.getElementById('policy-document').files[0];

  // Validate file is uploaded
  if (!policyDoc || policyDoc.type !== 'application/pdf') {
    alert('Please upload a valid PDF document.');
    return;
  }

  // Create a unique policy ID
  const policyId = `${Date.now()}`;

  // Store policy details in the "database" (here, just an array for simplicity)
  const reader = new FileReader();
  reader.onload = function () {
    policies.push({
      id: policyId,
      name,
      dob,
      startDate,
      endDate,
      document: reader.result // Base64 representation of the PDF
    });

    alert('Policy created successfully! Here is the unique link to share:');
    const policyLink = `${window.location.origin}/index.html?policyId=${policyId}`;
    prompt('Copy and share this link with the policyholder:', policyLink);
  };
  reader.readAsDataURL(policyDoc);

  // Clear the form
  document.getElementById('create-policy-form').reset();
});

// User Validation: Handle policy retrieval
document.getElementById('policy-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const surname = document.getElementById('surname').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const startDate = document.getElementById('start-date').value.trim();

  // Get the policyId from the URL
  const params = new URLSearchParams(window.location.search);
  const policyId = params.get('policyId');

  if (!policyId) {
    alert('Policy ID is missing. Please use the correct link.');
    return;
  }

  // Find the policy in the database
  const policy = policies.find(p => p.id === policyId);

  if (!policy) {
    alert('Policy not found.');
    return;
  }

  // Validate entered details
  if (policy.name.split(' ').slice(-1)[0].toLowerCase() === surname.toLowerCase() &&
    policy.dob === dob &&
    policy.startDate === startDate) {
    // Show policy details
    alert('Policy found! Displaying details now.');
    const policyWindow = window.open('', '_blank');
    policyWindow.document.write(`
      <h1>Policy Details</h1>
      <p><strong>Policyholder Name:</strong> ${policy.name}</p>
      <p><strong>Date of Birth:</strong> ${policy.dob}</p>
      <p><strong>Policy Start Date:</strong> ${policy.startDate}</p>
      <p><strong>Policy End Date:</strong> ${policy.endDate}</p>
      <p><strong>Policy Document:</strong> <a href="${policy.document}" download="policy-document.pdf">Download</a></p>
    `);
  } else {
    alert('Details do not match our records.');
  }
});
