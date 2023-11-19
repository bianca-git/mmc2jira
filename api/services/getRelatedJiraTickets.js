const axios = require('axios');
const process = require('process');

const getRelatedJiraTickets = async (issueId) => {
  const username = process.env.ATLASSIAN_USER_ID;
  const password = process.env.ATLASSIAN_API_TOKEN;
  const endpoint = process.env.ATLASSIAN_ENDPOINT;
  const epicLink = process.env.JIRA_EPIC_KEY;
  const encoded = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

  const config = {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${encoded}`
    },
    params: {
      maxResults: 1,
      fields: 'description,status',
      expand: 'renderedFields',
      jql: `'Epic Link'=${epicLink} and 'External Issue ID[Labels]'=${issueId}`
    },
    transformResponse: [function (data) {
      data = JSON.parse(data);
      const issue = data.issues[0];
      const newIssue = data.total === 0 ? true : false;
      data = newIssue ?
        { id: issueId, newIssue: true } :
        {
          id: issueId,
          newIssue: false,
          total: data.total,
          key: issue.key,
          status: issue.fields.status.name,
          descExisting: issue.renderedFields.description
        };
      return data;
    }]
  };

  try {
    const response = await axios.get(`https://${endpoint}/rest/api/3/search`, config);
    return response.data.total === 0 ? null : response.data;
  } catch (error) {
    throw error;

  }
};
exports.getRelatedJiraTickets = getRelatedJiraTickets;
