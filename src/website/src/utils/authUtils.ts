const CLIENT_ID = 'SHBUK5OCBOJ4AH44XUUTJNFH5Y66BYWB';
const REDIRECT_URI = 'http://localhost:3002/oauth/callback';

export const generateAuthUrl = (): string => {
    return `https://app.clickup.com/api?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
};
