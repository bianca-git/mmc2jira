const {FileHero} = require('../helpers/FileHero');
const {appendToJsonArrayFile} = FileHero;

const updateLastImportDate = async () => {
  try {
    const reportUpdate = 
    {
      sortingDate: new Date().valueOf(),
      lastImportDate: new Date().toISOString(),
      updatedAtLocal: new Date().toString()
    };
    appendToJsonArrayFile('lastImportDate.json', JSON.stringify(reportUpdate))
    return reportUpdate;
  } catch (error) {
    console.log(error);
  }
};

exports.updateLastImportDate = updateLastImportDate;