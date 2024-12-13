// Function to toggle the menu on click of the hamburger
document.getElementById('menu-toggle')?.addEventListener('click', () => {
    const navLinks = document.getElementById('nav-links');
    // Toggle the display of the navigation menu (mobile view)
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

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

// Function to render policies on the page
function renderPolicies() {
  const policyList = document.getElementById('policy-list').querySelector('ul');
  policyList.innerHTML = '';  // Clear current list
  policies.forEach(policy => {
    const newPolicyElement = document.createElement('li');
    newPolicyElement.innerHTML = `
      <p><strong>Policyholder Name:</strong> ${policy.name}</p>
      <p><strong>Date of Birth:</strong> ${policy.dob}</p>
      <p><strong>Policy Start Date:</strong> ${policy.startDate}</p>
      <p><strong>Policy End Date:</strong> ${policy.endDate}</p>
      <p><strong>Policy Document:</strong> <a href="data:application/pdf;base64,${policy.document}" download="policy-document.pdf">Download</a></p>
    `;
    policyList.appendChild(newPolicyElement);
  });
}

// Admin Portal: Handle form submission to create a new policy
document.getElementById('create-policy-form')?.addEventListener('submit', (event) => {
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
    policies.push({
      name,
      dob,
      startDate,
      endDate,
      document: reader.result // Base64 encoded PDF
    });

    // Save policies to Local Storage
    savePolicies(policies);

    // Render the new policy
    renderPolicies();

    // Reset the form
    document.getElementById('create-policy-form').reset();
  };
  reader.readAsDataURL(policyDocument);
});

// Render policies when the page loads
renderPolicies();

// Redirect to login page if not logged in
if (localStorage.getItem('loggedIn') !== 'true') {
  window.location.href = 'login.html';  // Redirect to login page
}
