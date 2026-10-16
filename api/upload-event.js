const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwfcHMfpD8bNW6BRgPbwhpyv12D3nMarQY7SNR-I9xIBqc7mhSj_dFIoCJpQC2eNtVA/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const requestBody = typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body || {});

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: requestBody
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (parseError) {
      data = {
        success: false,
        error: text || 'Respons Google Apps Script tidak valid'
      };
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: 'Google Apps Script merespons HTTP ' + response.status,
        upstream: data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: 'Gagal menghubungi Google Apps Script: ' + error.message
    });
  }
}
