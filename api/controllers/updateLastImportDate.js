const FileHero = require('../helpers/FileHero');

const updateLastImportDate = async () => {
  try {
    const reportUpdate = 
    {
      sortingDate: new Date().valueOf(),
      lastImportDate: new Date().toISOString(),
      updatedAtLocal: new Date().toLocaleString("en-AU", {
        timeZone: "Australia/Melbourne",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
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