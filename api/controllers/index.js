// Importing controllers
const { getAnnouncements } = require('./getAnnouncements');
const { searchRelatedIssues } = require('./searchRelatedIssues');
const { sendDetailsToJira } = require('./sendDetailsToJira');
const { updateLastImportDate } = require('./updateLastImportDate');

const main = async () => {
    try {
        const announcementData = await getAnnouncements();
        console.log(announcementData);

        const searchData = await searchRelatedIssues(announcementData);
        console.log(searchData);

        await sendDetailsToJira(searchData);
        console.log('Done');

        await updateLastImportDate();
        console.log('Updated last import date');
    } catch (error) {
        console.log(error);
    }
}

module.exports = main;