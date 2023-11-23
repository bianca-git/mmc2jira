async function fetchIssues() {
  try {
    const response = await fetch('../../data/completedTickets.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Process the response data
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

async function main() {
  const issues = await fetchIssues();
  const placeholder = document.querySelector('#data-output');
  let out = '';
  for (const issue of issues) {
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    ahref = `<a href="https://iag.atlassian.net/jira/browse/${issue.key}">${issue.key}</a>`;
    out += `
       <tr width="100vw">
          <td style="width:10%">${(issue.key === undefined) ? '':ahref}</td>
          <td style="width:30%">${issue.fields.summary}</td>
          <td style="font-size:7pt;width:20%">${issue.fields.labels.join(', ')}</td>
          <td style="width:10%">${(issue.fields.priority.name === 'Minor')? '-':issue.fields.priority.name}</td>
          <td style="width:10%">${(issue.fields.customfield_11205 === null) ? '-' : new Date(issue.fields.customfield_11205).toLocaleDateString('en-AU', dateOptions)}</td>
          <td style="width:10%">${(issue.fields.customfield_11206 === null) ? '-' : new Date(issue.fields.customfield_11206).toLocaleDateString('en-AU', dateOptions)}</td>
          <td style="width:10%">${(issue.fields.duedate === null) ? '-' : new Date(issue.fields.duedate).toLocaleDateString('en-AU', dateOptions)}</td>
          <td style="width:10%">${issue.updatedAt}</td>
       </tr>
    `;
  }
  placeholder.innerHTML = out;
}

main();