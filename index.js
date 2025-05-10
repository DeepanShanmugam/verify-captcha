// index.js
const axios = require('axios');

/**
 * Verify Google reCAPTCHA token.
 *
 * @param {string} secret - Your reCAPTCHA secret key.
 * @param {string} token - The token from the frontend.
 * @returns {Promise<boolean>} - true if valid, false otherwise.
 */
async function verifyRecaptcha(secret, token) {
  if (!secret || !token) throw new Error('Secret and token are required');

  try {
    const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret,
        response: token
      }
    });

    return res.data.success === true;
  } catch (err) {
    console.error('reCAPTCHA verification failed:', err.message);
    return false;
  }
}

module.exports = verifyRecaptcha;
