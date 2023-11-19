require('dotenv').config();
const { getServiceAnnouncements } = require('../services/graphApiService');
const FileHero = require('../helpers/FileHero');

const getAnnouncements = async () => {
    try {
        const lastDate = FileHero.getLatestImportDate('./data/lastImportDate.json');
        console.log(lastDate);
        let announcements = await getServiceAnnouncements(lastDate)
        announcements = JSON.parse(announcements);
        value = announcements.value
        if (!value || value.length == 0) {
            throw new Error('No announcements received from the service');
        }
        value.forEach(issue => {
            if (process.env.ENV == 'development') {
                const testID = issue.id.replace('MC', '')
                const valueID = parseInt(testID) + getRandomInt(1, 100);
                issue.id = "MC" + valueID.toString()
                issue.environment = 'development'
            }
            issue.importDateTime = new Date().toString()
            const index = value.indexOf(issue)
            issue.index = index
            return issue;
        }
        );
        announcements.value = value;
        FileHero.appendToJsonArrayFile('./data/announcements.json', JSON.stringify(announcements));
        return announcements
    } catch (error) {
        throw error;
    }
}
module.exports = { getAnnouncements };


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

