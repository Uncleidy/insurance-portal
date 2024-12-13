// Helper function to load policies from Local Storage
function loadPolicies() {
  const storedPolicies = localStorage.getItem('policies');
  return storedPolicies ? JSON.parse(storedPolicies) : [];
}

// Helper function to save policies to Local Storage
function savePolicies(policies) {
  localStorage.setItem('policies', JSON.stringify(policies));
}

// Load policies from Local Storage at the start
let policies = loadPolicies();

// Admin Portal: Handle form submission to create a new policy
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
    // Add new policy to array
    policies.push({
      name,
      dob,
      startDate,
      endDate,
      document: reader.result // Base64 encoded PDF
    });

    // Save policies to Local Storage
    savePolicies(policies);

    // Display the new policy in the HTML
    const policyList = document.getElementById('policy-list').querySelector('ul');
    const newPolicyElement = document.createElement('li');
    newPolicyElement.innerHTML = `
      <p><strong>Policyholder Name:</strong> ${name}</p>
      <p><strong>Date of Birth:</strong> ${dob}</p>
      <p><strong>Policy Start Date:</strong> ${startDate}</p>
      <p><strong>Policy End Date:</strong> ${endDate}</p>
      <p><strong>Policy Document:</strong> <a href="data:application/pdf;base64,${reader.result}" download="policy-document.pdf">Download</a></p>
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

// User Validation: Handle form submission for policy lookup
document.getElementById('policy-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const surname = document.getElementById('surname').value.trim().toLowerCase();
  const dob = document.getElementById('dob').value.trim();
  const startDate = document.getElementById('start-date').value.trim();

  const foundPolicy = policies.find(policy => 
    policy.name.toLowerCase() === surname &&
    policy.dob === dob &&
    policy.startDate === startDate
  );

  if (foundPolicy) {
    const policyDetails = `
      <p><strong>Policyholder Name:</strong> ${foundPolicy.name}</p>
      <p><strong>Date of Birth:</strong> ${foundPolicy.dob}</p>
      <p><strong>Start Date:</strong> ${foundPolicy.startDate}</p>
      <p><strong>End Date:</strong> ${foundPolicy.endDate}</p>
      <p><strong>Document:</strong> <a href="data:application/pdf;base64,${foundPolicy.document}" download="policy-document.pdf">Download</a></p>
    `;
    document.getElementById('policy-list').innerHTML = policyDetails;
  } else {
    alert('Policy not found. Please check your information and try again.');
  }
});

// Load and display all policies on page load
window.addEventListener('load', function() {
  const policies = loadPolicies();
  const policyList = document.getElementById('policy-list').querySelector('ul');
  
  policies.forEach(policy => {
    const policyItem = document.createElement('li');
    policyItem.innerHTML = `
      <p><strong>Policyholder Name:</strong> ${policy.name}</p>
      <p><strong>Date of Birth:</strong> ${policy.dob}</p>
      <p><strong>Policy Start Date:</strong> ${policy.startDate}</p>
      <p><strong>Policy End Date:</strong> ${policy.endDate}</p>
      <p><strong>Policy Document:</strong> <a href="data:application/pdf;base64,${policy.document}" download="policy-document.pdf">Download</a></p>
    `;
    policyList.appendChild(policyItem);
  });
});
