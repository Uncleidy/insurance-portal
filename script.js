// Helper function to generate a unique policy ID
function generatePolicyId() {
  return 'policy-' + Math.random().toString(36).substr(2, 9);
}

// Helper function to load policies from Local Storage by Policy ID
function loadPolicyById(policyId) {
  const storedPolicies = localStorage.getItem('policies');
  const policies = storedPolicies ? JSON.parse(storedPolicies) : [];
  return policies.find(policy => policy.id === policyId);
}

// Helper function to save policies to Local Storage
function savePolicies(policies) {
  localStorage.setItem('policies', JSON.stringify(policies));
}

// Admin Portal: Handle form submission to create a new policy
if (window.location.pathname.includes('admin.html')) {
  document.getElementById('create-policy-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const startDate = document.getElementById('start-date').value.trim();
    const endDate = document.getElementById('end-date').value.trim();
    const policyDocument = document.getElementById('policy-document').files[0];

    if (!policyDocument) {
      alert('Please upload a policy document.');
      return;
    }

    if (policyDocument.type !== 'application/pdf') {
      alert('Please upload a valid PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      // Generate a unique policy ID
      const policyId = generatePolicyId();

      // Create new policy object
      const newPolicy = {
        id: policyId,
        name,
        dob,
        startDate,
        endDate,
        document: reader.result // Base64 encoded PDF
      };

      // Load existing policies from local storage
      const policies = JSON.parse(localStorage.getItem('policies')) || [];

      // Add new policy to array
      policies.push(newPolicy);

      // Save updated policies to local storage
      savePolicies(policies);

      // Generate the link for the new policy
      const policyLink = `${window.location.origin}/index.html?policyId=${policyId}`;

      // Display the policy list with the link
      const policyList = document.getElementById('policy-list').querySelector('ul');
      const newPolicyElement = document.createElement('li');
      newPolicyElement.innerHTML = `
        <p><strong>Policyholder Name:</strong> ${name}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Policy Start Date:</strong> ${startDate}</p>
        <p><strong>Policy End Date:</strong> ${endDate}</p>
        <p><strong>Policy Document:</strong> <a href="data:application/pdf;base64,${reader.result}" download="policy-document.pdf">Download</a></p>
        <p><strong>Customer Link:</strong> <a href="${policyLink}" target="_blank">${policyLink}</a></p>
      `;
      policyList.appendChild(newPolicyElement);

      // Reset the form
      document.getElementById('create-policy-form').reset();
    };

    reader.onerror = function (error) {
      alert("Error reading file: " + error.target.error.code);
    };

    reader.readAsDataURL(policyDocument);
  });
}

// User Validation: Handle form submission for policy lookup
if (window.location.pathname.includes('index.html')) {
  // Get the policyId from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const policyId = urlParams.get('policyId');

  if (policyId) {
    const foundPolicy = loadPolicyById(policyId);

    if (foundPolicy) {
      const policyDetails = `
        <h3>Policy Details:</h3>
        <p><strong>Policyholder Name:</strong> ${foundPolicy.name}</p>
        <p><strong>Date of Birth:</strong> ${foundPolicy.dob}</p>
        <p><strong>Start Date:</strong> ${foundPolicy.startDate}</p>
        <p><strong>End Date:</strong> ${foundPolicy.endDate}</p>
        <p><strong>Document:</strong> <a href="data:application/pdf;base64,${foundPolicy.document}" download="policy-document.pdf">Download</a></p>
      `;
      document.getElementById('policy-details').innerHTML = policyDetails;
    } else {
      alert('Policy not found.');
    }
  }

  // Handle user validation form submission
  document.getElementById('policy-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const surname = document.getElementById('surname').value.trim().toLowerCase();
    const dob = document.getElementById('dob').value.trim();
    const startDate = document.getElementById('start-date').value.trim();

    const foundPolicy = loadPolicyById(policyId);

    if (foundPolicy) {
      if (foundPolicy.name.toLowerCase() === surname && foundPolicy.dob === dob && foundPolicy.startDate === startDate) {
        const policyDetails = `
          <h3>Policy Details:</h3>
          <p><strong>Policyholder Name:</strong> ${foundPolicy.name}</p>
          <p><strong>Date of Birth:</strong> ${foundPolicy.dob}</p>
          <p><strong>Start Date:</strong> ${foundPolicy.startDate}</p>
          <p><strong>End Date:</strong> ${foundPolicy.endDate}</p>
          <p><strong>Document:</strong> <a href="data:application/pdf;base64,${foundPolicy.document}" download="policy-document.pdf">Download</a></p>
        `;
        document.getElementById('policy-details').innerHTML = policyDetails;
      } else {
        alert('Policy details do not match.');
      }
    } else {
      alert('Policy not found.');
    }
  });
}
