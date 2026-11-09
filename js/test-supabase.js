var SUPABASE_URL = 'https://rqswwfkkqaqphdnygsjw.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbG...gjnI';

async function testSupabaseConnection() {
  try {
    var response = await fetch(SUPABASE_URL + '/rest/v1/informasi?select=*&limit=5', {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    console.log('Response status:', response.status);
    var text = await response.text();
    console.log('Raw response:', text);
    
    if (response.ok) {
      var data = JSON.parse(text);
      console.log('Successfully connected to informasi table:', data);
    } else {
      var errorMsg = text.match(/\"error\":\"([^\"]+)\"/i)?.[1];
      console.log('Connection failed:', errorMsg || 'Unknown error');
    }
  } catch (err) {
    console.log('Network error:', err);
  }
}

testSupabaseConnection();