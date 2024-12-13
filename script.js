// Helper function to load policies from Local Storage
function loadPolicies() {
  const storedPolicies = localStorage.getItem('policies');
  return storedPolicies ? JSON.parse(storedPolicies) : [];
}

// Helper function to save policies to Local Storage
function savePolicies(policies) {
  localStorage.setItem('policies', JSON.stringify(policies));
}

// Admin Portal: Handle form submission to create a new policy
if (document.getElementById('create-policy-form')) {
  document.getElementById('create-policy-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const startDate = document.getElementById('start-date').value.trim();
    const endDate = document.getElementById('end-date').value.trim();
    const policyDocument = document.getElementById('policy-document').files[0];

    if (!policyDocument || policyDocument.type !== 'application/pdf') {
      alert('Please upload a valid PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      // Add new policy to array
      const policyId = new Date().getTime();  // Unique ID based on the current timestamp
      let policies = loadPolicies();
      policies.push({
        id: policyId,
        name,
        dob,
        startDate,
        endDate,
        document: reader.result // Base64 encoded PDF
      });

      // Save policies to Local Storage
      savePolicies(policies);

      // Create login URL for the customer
      const loginUrl = `index.html?policyId=${policyId}&name=${encodeURIComponent(name)}&dob=${dob}&startDate=${startDate}`;
      
      // Show the login link to the admin
      document.getElementById('login-link-container').style.display = 'block';
      document.getElementById('customer-login-link').href = loginUrl;

      // Reset the form
      document.getElementById('create-policy-form').reset();
    };
    reader.readAsDataURL(policyDocument);
  });
}

// Customer Portal: Handle login form submission
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const startDate = document.getElementById('start-date').value.trim();

    const policies = loadPolicies();

    const foundPolicy = policies.find(policy => 
      policy.name.toLowerCase() === name.toLowerCase() &&
      policy.dob === dob &&
      policy.startDate === startDate
    );

    if (foundPolicy) {
      // Display policy details
      document.getElementById('policy-details').style.display = 'block';
      document.getElementById('policy-info').innerHTML = `
        <p><strong>Policyholder Name:</strong> ${foundPolicy.name}</p>
        <p><strong>Date of Birth:</strong> ${foundPolicy.dob}</p>
        <p><strong>Policy Start Date:</strong> ${foundPolicy.startDate}</p>
        <p><strong>Policy End Date:</strong> ${foundPolicy.endDate}</p>
        <p><strong>Policy Document:</strong> <a href="data:application/pdf;base64,${foundPolicy.document}" download="policy-document.pdf">Download</a></p>
      `;
    } else {
      alert('Policy not found. Please check your details and try again.');
    }
  });
}

// Check if the user has come from a direct link (URL parameters)
const urlParams = new URLSearchParams(window.location.search);
const policyId = urlParams.get('policyId');
const name = urlParams.get('name');
const dob = urlParams.get('dob');
const startDate = urlParams.get('startDate');

if (policyId && name && dob && startDate) {
  const policies = loadPolicies();
  const foundPolicy = policies.find(policy =>
    policy.id == policyId &&
    policy.name.toLowerCase() === name.toLowerCase() &&
    policy.dob === dob &&
    policy.startDate === startDate
  );

  if (foundPolicy) {
    document.getElementById('policy-details').style.display = 'block';
    document.getElementById('policy-info').innerHTML = `
      <p><strong>Policyholder Name:</strong> ${foundPolicy.name}</p>
      <p><strong>Date of Birth:</strong> ${foundPolicy.dob}</p>
      <p><strong>Policy Start Date:</strong> ${foundPolicy.startDate}</p>
      <p><strong>Policy End Date:</strong> ${foundPolicy.endDate}</p>
      <p><strong>Policy Document:</strong> <a href="data:application/pdf;base64,${foundPolicy.document}" download="policy-document.pdf">Download</a></p>
    `;
  }
}
