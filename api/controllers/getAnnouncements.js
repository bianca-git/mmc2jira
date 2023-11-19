
const { getServiceAnnouncements } = require('../services/graphApiService');
const { FileHero, getLatestImportDate } = require('../helpers/FileHero');

const getAnnouncements = async () => {
    try {
        const lastDate = getLatestImportDate();
        let announcements = await getServiceAnnouncements(lastDate)
        announcements = JSON.parse(announcements);
        if (!announcements.value) {
            throw new Error('No announcements received from the service');
        }
        announcements.map(announcement => {
            announcement.id = announcement.id.replace('MS', '');
            return announcement;
        }
        );
        announcements = { importDateTime: new Date().toString(), ...announcements };
        FileHero.appendToJsonArrayFile('announcements.json', JSON.stringify(announcements));
        return announcements
    } catch (error) {
        throw error;
    }
}
exports.getAnnouncements = getAnnouncements;