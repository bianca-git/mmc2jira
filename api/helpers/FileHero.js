const fs = require('fs');
const {cwd} = require('node:process');

function read(fn) {
  try {
    return fs.readFileSync(`${cwd()}/data/${fn}`, 'utf8');
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
}
function write(fn, data) {
  try {
    fs.writeFileSync(`${cwd()}/data/${fn}`, data);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}
function append(fn, data) {
  try {
    fs.appendFileSync(`${cwd()}/data/${fn}`, data);
  }
  catch (err) {
    console.error('Error appending file:', err);
  }
}
function deleteFile(fn) {
  try {
    fs.unlinkSync(`${cwd()}/data/${fn}`);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}

function appendToJsonArrayFile(fn, data) {
  try {
    let fileContent;
    // Check if file exists
    if (fs.existsSync(`${cwd()}/data/${fn}`)) {
      // Read the file if it exists
      fileContent = read(`${cwd()}/data/${fn}`);
      // Check if it's a valid JSON array
      if (!FileHero.isValidJsonArray(fileContent)) {
        throw new Error('File content is not a valid JSON array');
      }
      // Remove the last "]" character
      fileContent = fileContent.slice(0, -1);
    } else {
      // Initialize file content as an empty JSON array if file does not exist
      fileContent = '[';
    }
    // Append new data with a prefixed "," (if fileContent length > 1) and a suffixed "]"
    const dataToAppend = (fileContent.length > 1 ? ',' : '') + data + ']';
    fileContent += dataToAppend;
    // Write the updated content back to the file
    write(`${cwd()}/data/${fn}`, fileContent);
  } catch (err) {
    console.error('Error appending to JSON file:', err);
  }
}

function isValidJsonArray(content) {
  try {
    const json = JSON.parse(content);
    return Array.isArray(json);
  } catch (err) {
    return false;
  }
}

function getLatestImportDate() {
  try {
    // Read the JSON file
    const fileContents = FileHero.read('lastImportDate.json');
    const data = JSON.parse(fileContents);
    // Check if data is an array
    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }
    // Sort the array by 'sortingDate'
    data.sort((a, b) => b.sortingDate - a.sortingDate);
    // Return the latest 'lastImportDate'
    return data.length > 0 ? data[0].lastImportDate : null;
  } catch (err) {
    console.error('Error processing the date:', err);
    return null;
  }
}
exports.FileHero = {read,write,append,deleteFile,appendToJsonArrayFile,isValidJsonArray,getLatestImportDate}