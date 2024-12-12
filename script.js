const POLICIES_URL = './policies.json';

// Fetch existing policies from the JSON file
async function fetchPolicies() {
  const response = await fetch(POLICIES_URL);
  return await response.json();
}

// Save policies to the JSON file (simulated in console)
async function savePolicies(policies) {
  console.log('Saving policies:', JSON.stringify(policies, null, 2));
  // Requires backend integration to actually save policies.json
}

// Check policy details
async function checkPolicy() {
  const surname = document.getElementById('surname').value.trim();
  const dob = document.getElementById('dob').value;
  const startDate = document.getElementById('start-date').value;

  const policies = await fetchPolicies();
  const policy = policies.find(
    (p) => p.surname === surname && p.dob === dob && p.start_date === startDate
  );

  const resultElement = document.getElementById('policy-result');
  if (policy) {
    resultElement.innerHTML = `Policy found! Reference Code: ${policy.reference}`;
  } else {
    resultElement.innerHTML = 'Policy not found. Please check your details.';
  }
}

// Create a new policy
async function createPolicy() {
  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const reference = document.getElementById('reference').value.trim();

  const surname = name.split(' ').pop(); // Use last name as surname

  const newPolicy = { name, dob, start_date: startDate, end_date: endDate, reference, surname };

  const policies = await fetchPolicies();
  policies.push(newPolicy);
  await savePolicies(policies);

  document.getElementById('policy-status').innerHTML = `Policy created! Reference Code: ${reference}`;
}
