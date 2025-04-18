

const COGNITO_DOMAIN = 'https://cognito-idp.us-east-1.amazonaws.com';  // Replace with your Cognito domain
const CLIENT_ID = 'o0caq6tqkn3g500oe6q7ia01a';  // Replace with your Cognito client ID
const REDIRECT_URI = 'http://localhost:5173/';  // Your redirect URI
const LOGOUT_URI = 'http://localhost:5173/';  // Redirect URI for after logout

// Construct login URL for Cognito Hosted UI
const LOGIN_URL = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=openid+profile+email&redirect_uri=${REDIRECT_URI}`;

// Redirect to Cognito Hosted UI for login
export const handleLogin = () => {
    window.location.href = LOGIN_URL;
};

// Exchange authorization code for tokens
export const exchangeCodeForTokens = async (code) => {
    const tokenEndpoint = `https://${COGNITO_DOMAIN}/oauth2/token`;

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', CLIENT_ID);
    body.append('code', code);
    body.append('redirect_uri', REDIRECT_URI);

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
    });

    const data = await response.json();

    if (data.error) {
        console.error('Error exchanging code for tokens:', data.error_description);
        return;
    }

    // Store tokens in localStorage or sessionStorage
    const { access_token, id_token, refresh_token } = data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('id_token', id_token);
    localStorage.setItem('refresh_token', refresh_token);

    // Redirect to homepage after successful login
    window.location.href = '/';
};

// Check if the user is logged in (by checking for an access token)
export const isAuthenticated = () => {
    return localStorage.getItem('access_token') !== null;
};

// Get the current access token from localStorage
export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

// Get the current ID token from localStorage
export const getIdToken = () => {
    return localStorage.getItem('id_token');
};

// Logout function
export const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');

    // Redirect to Cognito's logout endpoint
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`;
    window.location.href = logoutUrl;
};

// Handle the callback (i.e., the redirection after a successful login)
export const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        await exchangeCodeForTokens(code);
    }
};

// Redirect the user to the login page if they're not authenticated
export const ensureAuthenticated = () => {
    if (!isAuthenticated()) {
        window.location.href = LOGIN_URL;
    }
};
