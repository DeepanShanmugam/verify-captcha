// index.js
const axios = require('axios');

/**
 * Verify Google reCAPTCHA token (supports v2 and v3).
 *
 * @param {string} secret - Your reCAPTCHA secret key.
 * @param {string} token - The token from the frontend.
 * @param {object} [options] - Optional settings (like expectedAction, minimumScore).
 * @returns {Promise<object>} - { success, score, action, challenge_ts, hostname, ... }
 */
async function verifyRecaptcha(secret, token, options = {}) {
  if (!secret || !token) throw new Error('Secret and token are required');

  try {
    const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret,
        response: token
      }
    });

    const data = res.data;

    // Optional v3 validation: check score and action
    if (options.minimumScore !== undefined && data.score !== undefined) {
      if (data.score < options.minimumScore) {
        data.success = false;
        data.reason = 'Low score';
      }
    }

    if (options.expectedAction && data.action) {
      if (data.action !== options.expectedAction) {
        data.success = false;
        data.reason = 'Unexpected action';
      }
    }

    return data;
  } catch (err) {
    console.error('reCAPTCHA verification failed:', err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = verifyRecaptcha;
