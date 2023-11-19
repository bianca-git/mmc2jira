require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

const getAccessToken = async () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const tenantId = process.env.TENANT_ID;
    const scope = 'https://graph.microsoft.com/.default';
    const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const body = {
        client_id: clientId,
        client_secret: clientSecret,
        scope,
        grant_type: 'client_credentials'
    };
    try {
        const response = await axios.post(tokenEndpoint, qs.stringify(body), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
};

exports.getAccessToken = getAccessToken;