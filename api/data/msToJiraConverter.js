

require('dotenv').config()
const { convert } = require('./htmltoadf')
const jiraProjectKey = process.env.JIRA_PROJECT_KEY
const jiraEpicKey = process.env.JIRA_EPIC_KEY

function msToJiraConverter(microsoftData) {
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const { lastModifiedDateTime, id, category, tags, isMajorChange, services, details, body, startDateTime, endDateTime, title, actionRequiredByDateTime } = microsoftData
  const prioritySet = isMajorChange ? 'Major' : 'Minor'
  const labelsSet = [isMajorChange ? 'Priority:Major' : '', category, ...tags, ...services].filter((label) => label !== '').map(label => label.replace(/\s/g, '-'))
  const detailsArr = []
  details.forEach((/** @type {{ name: any, value: any }} */ detail) => {
    const { name, value } = detail
    if (value.startsWith('https')) {
      detailsArr.push(`<p><a href="${value}">${name}</a></p>`)
    } else if (name === 'FeatureStatusJson') {
      const featureStatus = JSON.parse(value)
      const { status, statusDateTime } = featureStatus
      detailsArr.push(`<p>Feature Status: ${status}</p>`)
      detailsArr.push(`<p>Feature Status Date: ${new Date(statusDateTime).toLocaleDateString('en-AU', dateOptions)}</p>`)
    } else if (name === 'RoadmapIds') {
      labelsSet.push(`Roadmap:${value}`)
      detailsArr.push(`<p><a href="https://www.microsoft.com/en-au/microsoft-365/roadmap?filters=&searchterms=${value}">${name}:${value}</a></p>`)
    } else if (name === 'Platforms') {
      value.split(', ').forEach((platform) => {
        labelsSet.push(`Platform:${platform}`)
        detailsArr.push(`<p>Platform:${platform}</p>`)
      })
    } else {
      detailsArr.push(`<p>${name}:${value}</p>`)
    }
  })
  const detailsSet = detailsArr != null ? `<hr><p><h2>Additional Details</h2></p>${[...detailsArr].join((''))}` : ''
  const content = body.content.replaceAll(/<code><code>/g, '<code>').replaceAll(/<\/code><\/code>/g, '</code>').replaceAll(/(?:\\")/g, "'")
  const updateDate = `<hr><p><i>Last Modified Date: ${new Date(lastModifiedDateTime).toLocaleDateString('en-AU', dateOptions)}</i></p>`;
  const fullbody = (`${content}${detailsSet}${updateDate}`).replaceAll(/<br>/g, '').replaceAll(/<br\/>/g, '').replaceAll(/\n/g, '')
  const categoryParse = convert(category)

  return { prioritySet, labelsSet, startDateTime, endDateTime, title, actionRequiredByDateTime, id, categoryParse, fullbody }
}

class NewJiraIssue {
  /**
   * @param {any} newMessages
   */
  constructor(newMessages) {
    const { prioritySet, labelsSet, startDateTime, endDateTime, title, actionRequiredByDateTime, id, categoryParse, fullbody } = msToJiraConverter(newMessages)
    const convertToString = JSON.stringify(JSON.parse(convert(fullbody))).replaceAll(`{"type":"hardBreak"},`, '').replaceAll(`{"type":"hardBreak"}`, '')

    this.fields = {
      project: { key: jiraProjectKey }, // key,
      priority: { name: prioritySet }, // name,
      issuetype: { id: 3, key: 'Task' }, // id, key,
      customfield_11501: [`${id}`], // External ID
      customfield_12100: jiraEpicKey, // Epic Link
      customfield_11205: startDateTime, // Start Date & Time
      customfield_11206: endDateTime, // End Date & Time
      duedate: actionRequiredByDateTime === undefined ? null : actionRequiredByDateTime, // Action Required By Date & Time
      summary: title, // Title
      labels: labelsSet,
      customfield_21100: JSON.parse(categoryParse), // Category, Atlassian Document Type
      description: JSON.parse(convertToString) // Description
    }
  }
}

class UpdateJiraIssue {
  /**
   * @param {Object} existingIssue - The existing Jira issue object to be updated
   * @param {Object} newMessages - The new messages object containing the updated information
   */
  constructor(existingIssue, newMessages) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const updateDate = new Date(newMessages.lastModifiedDateTime).toLocaleDateString('en-AU', dateOptions)
    const { key, descExisting, status } = existingIssue
    const { prioritySet, labelsSet, fullbody, startDateTime, endDateTime, title, actionRequiredByDateTime } = msToJiraConverter(newMessages)
    const newDescription = `<h2>Updated Content As At ${updateDate}</h2>${fullbody}<h2>Previous Content</h2><blockquote>${descExisting}</blockquote>`
    const convertToString = JSON.stringify(JSON.parse(convert(newDescription))).replaceAll(`{"type":"hardBreak"},`, '').replaceAll(`{"type":"hardBreak"}`, '')
    const commentText = `<p>Automation: The ticket has been updated with latest content from Microsoft.`
    const comment = JSON.parse(convert(commentText))
    this.fields = {
      priority: { name: prioritySet }, // name,
      customfield_11205: startDateTime, // Start Date & Time
      customfield_11206: endDateTime, // End Date & Time
      duedate: actionRequiredByDateTime === undefined ? null : actionRequiredByDateTime, // Action Required By Date & Time
      summary: title,
      labels: labelsSet,
      description: JSON.parse(convertToString) // Description
    }
    this.update = {
      comment: [{ add: { body: comment } }]
    }
    return this, key
  }
}

class TransitionJiraIssue {
  /**
   * @param {Object} existingIssue - The existing Jira issue object to be updated
   * @param {Object} newMessages - The new messages object containing the updated information
   */
  constructor(existingIssue, newMessages) {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const updateDate = new Date(newMessages.lastModifiedDateTime).toLocaleDateString('en-AU', dateOptions)
    const { key, descExisting, status } = existingIssue
    const { prioritySet, labelsSet, fullbody, startDateTime, endDateTime, title, actionRequiredByDateTime } = msToJiraConverter(newMessages)
    const newDescription = `<h2>Updated Content As At ${updateDate}</h2>${fullbody}<h2>Previous Content</h2><blockquote>${descExisting}</blockquote>`
    const convertToString = JSON.stringify(JSON.parse(convert(newDescription))).replaceAll(`{"type":"hardBreak"},`, '').replaceAll(`{"type":"hardBreak"}`, '')
    const commentText = `<p>Automation: The ticket has been updated with latest content from Microsoft.</p>`
    const comment = JSON.parse(convert(commentText))
    // this.transitions = { id: 11 } // id,
    this.fields = {
      assignee: null,
      priority: { name: prioritySet }, // name,
      customfield_11205: startDateTime, // Start Date & Time
      customfield_11206: endDateTime, // End Date & Time
      duedate: actionRequiredByDateTime === undefined ? null : actionRequiredByDateTime, // Action Required By Date & Time
      summary: title, // Title
      labels: labelsSet,
      description: JSON.parse(convertToString) // Description
    }
    this.update = {
      comment: [{ add: { body: comment } }]
    }
    return this, key
  }
}

module.exports = { NewJiraIssue, UpdateJiraIssue, TransitionJiraIssue, msToJiraConverter }