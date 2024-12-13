 // Save policies to Local Storage

    savePolicies(policies);



    alert('Policy created successfully! Share this link:');

    const policyLink = `${window.location.origin}/index.html?policyId=${policyId}`;

    prompt('Copy this link and send it to the policyholder:', policyLink);

  };

  reader.readAsDataURL(policyDoc);



  // Reset form

  document.getElementById('create-policy-form').reset();

});



// User Validation: Handle form submission for policy lookup

document.getElementById('policy-form')?.addEventListener('submit', function (e) {

  e.preventDefault();



  const surname = document.getElementById('surname').value.trim().toLowerCase();

  const dob = document.getElementById('dob').value.trim();

  const startDate = document.getElementById('start-date').value.trim();



  const params = new URLSearchParams(window.location.search);

  const policyId = params.get('policyId');



  if (!policyId) {

    alert('Policy ID is missing. Please use the correct link.');

    return;

  }



  // Load policies from Local Storage

  policies = loadPolicies();



  const policy = policies.find(p => p.id === policyId);



  if (!policy) {

    alert('Policy not found.');

    return;

  }



  if (

    policy.name.toLowerCase().includes(surname) &&

    policy.dob === dob &&

    policy.startDate === startDate

  ) {

    alert('Policy found! Opening details in a new tab.');

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

    alert('Details do not match.');

  }

}); 
