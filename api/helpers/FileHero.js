const fs = require('fs');
const { cwd } = require('node:process');

function read(fn) {
  try {
    return fs.readFileSync(fn, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

function write(fn, data) {
  try {
    fs.writeFileSync(fn, data);
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

function append(fn, data) {
  try {
    fs.appendFileSync(fn, data);
  }
  catch (error) {
    console.error('Error appending file:', error);
  }
}
function deleteFile(fn) {
  try {
    fs.unlinkSync(fn);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

function appendToJsonArrayFile(fn, data) {
  try {
    let fileContent = fs.existsSync(fn)
    if (fileContent) {
      fileContent = fs.readFileSync(fn).toString()
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
    return fs.writeFileSync(fn, fileContent, 'utf8');
  } catch (error) {
    throw error
  }
}

function isValidJsonArray(content) {
  try {
    const json = JSON.parse(content);
    return Array.isArray(json);
  } catch (error) {
    return false;
  }
}

function getLatestImportDate(fn) {
  try {
    // Read the JSON file
    const fileContents = FileHero.read(fn);
    const data = JSON.parse(fileContents);
    // Check if data is an array
    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }
    // Sort the array by 'sortingDate'
    data.sort((a, b) => b.sortingDate - a.sortingDate);
    // Return the latest 'lastImportDate'
    return data.length > 0 ? data[0].lastImportDate : null;
  } catch (error) {
    console.error('Error processing the date:', error);
    throw error
  }
}

const FileHero = { read, write, append, deleteFile, appendToJsonArrayFile, isValidJsonArray, getLatestImportDate }

module.exports = FileHero