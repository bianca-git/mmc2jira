
require('dotenv').config();
const axios = require('axios');
const { getAccessToken } = require('../helpers/getAccessToken');

const getServiceAnnouncements = async (lastModifiedDateTime) => {
    try {
        const accessToken = await getAccessToken()
        const url = `https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/messages?$count=true&$filter=lastModifiedDateTime gt ${lastModifiedDateTime}&$top=5`
        console.log(url)
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const data = JSON.stringify(response.data);
        return data;
    } catch (error) {
        console.error('Error fetching service announcements:', error.message);
        throw error;
    }
}

exports.getServiceAnnouncements = getServiceAnnouncements;
