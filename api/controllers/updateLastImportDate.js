const FileHero = require('../helpers/FileHero');

const updateLastImportDate = async () => {
  try {
    const reportUpdate = 
    {
      sortingDate: new Date().valueOf(),
      lastImportDate: new Date().toISOString(),
      updatedAtLocal: new Date().toLocaleString("en-US", {
        timeZone: "Australia/Melbourne"
    })
    };
    FileHero.appendToJsonArrayFile('./data/lastImportDate.json', JSON.stringify(reportUpdate))
    return reportUpdate;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {updateLastImportDate};