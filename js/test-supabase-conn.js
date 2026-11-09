var SUPABASE_URL = 'https://rqswwfkkqaqphdnygsjw.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbG...gjnI';

async function testSupabase() {
  try {
    console.log('Testing Supabase connection to informasi table...');
    
    var testUrl = SUPABASE_URL + '/rest/v1/informasi?select=id,date,title,status,created_at&limit=5';
    
    var response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    var text = await response.text();
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      try {
        var data = JSON.parse(text);
        if (data && data.length > 0) {
          console.log('✅ SUCCESS: Connected to informasi table');
          console.log('Sample data:', data[0]);
          console.log('Total records:', data.length);
          
          // Check for status column
          if (data[0].status !== undefined) {
            console.log('✅ Status column exists:', data.map(item => item.status).join(', '));
          } else {
            console.log('⚠️  Status column missing in current data');
          }
        } else {
          console.log('⚠️ Table exists but empty or no records returned');
        }
      } catch (parseErr) {
        console.log('⚠️ Response received but JSON parsing failed:', parseErr);
        console.log('Raw response:', text.substring(0, 50));
      }
    } else {
      var errorText = text.replace(/\/g, '\\').replace(/\/g, '\\');
      var errorMsg = errorText.match(/\"error\":\"([^\"]+)\"/i)?.[1];
      console.log('❌ FAILED: Connection failed with status', response.status);
      console.log('Error message:', errorMsg || 'No error details available');
      console.log('Response preview:', text.substring(0, 100));
    }
  } catch (err) {
    console.log('❌ Network error:', err.message);
  }
}

testSupabase();