const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxMXGBo8urLfg9pn00x1QMGiEEJmD1opNGk8F9hwvM62DzQNutS_Ktr8B2WHbRi4uVV/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(req.body)
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

    return res.status(response.ok ? 200 : 502).json(data);
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: 'Gagal menghubungi Google Apps Script: ' + error.message
    });
  }
}
