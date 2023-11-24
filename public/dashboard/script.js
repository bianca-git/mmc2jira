

const fetchIssues = async () => fetch('../../data/ticketUpdates.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  })
  .catch(error => {
    console.log(error);
  });

/**
 * Main function to fetch issues and update the HTML.
 *
 * Fetches issue data and builds HTML for each issue to be inserted into the page.
 * The HTML includes a header row and a row for each issues[i].
 * Each issue row includes cells for various issue properties.
 * The function logs the fetched issues and updates the HTML of the '#data-output' element.
 */
async function main() {
  const issues = await fetchIssues();
  console.log(issues);
  const placeholder = document.querySelector('#data-output');
  let outHeader = `
    <div class="header-row row">
    <span class="cell primary">Issue #</span>
      <span class="cell">Updated</span>
      <span class="cell-wide cell">Subject</span>
      <span class="cell">Labels</span>
      <span class="cell">Priority</span>
      <span class="cell">Start</span>
      <span class="cell">End</span>
      <span class="cell">Action By</span>
    </div>`;
  let outRows = [];
  let i
  for (i = 0 ; i < issues.length ; i++) {
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    let ahref = ``;
    outRows.push(`
    <div class="row">
    <input type="radio" name="expand">
      <span class="cell primary" data-label="Issue #"><a href="${issues[i].self}">${issues[i].key}</a></span>
      <span class="cell" data-label="Updated">${issues[i].updatedAt}</span>
      <span class="cellx3 cell" data-label="Subject">${issues[i].summary}</span>
      <span class="cell-labels cell cellx2" data-label="Labels">${issues[i].labels.join(', ')}</span>
      <span class="cell" data-label="Priority">${(issues[i].priority.name === 'Minor') ? '-' : issues[i].priority.name}</span>
      <span class="cell" data-label="Start">${(issues[i].customfield_11205 === null) ? '-' : new Date(issues[i].customfield_11205).toLocaleDateString('en-AU', dateOptions)}</span>
      <span class="cell" data-label="End">${(issues[i].customfield_11206 === null) ? '-' : new Date(issues[i].customfield_11206).toLocaleDateString('en-AU', dateOptions)}</span>
      <span class="cell" data-label="Action By">${(issues[i].duedate === null) ? '-' : new Date(issues[i].duedate).toLocaleDateString('en-AU', dateOptions)}</span>
    </div>`);
  }
  placeholder.innerHTML = outHeader + outRows.join('');
}

main()