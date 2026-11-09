#!/usr/bin/env node

// Test koneksi Supabase ke tabel 'informasi'

const SUPABASE_URL = 'https://rqswwfkkqaqphdnygsjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc3d3ZmtraWFxcGhkbnlnc2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NTI4NzAsImV4cCI6MjA0MzMyODg3MH0.TtfLLVKzpW5PW9OjWYRvQ8Jj8SwWAbnkU9-0HGjnI';

async function checkInformasiTable() {
  try {
    console.log('🔍 Testing Supabase connection to table: informasi...\n');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/informasi?select=*&limit=5`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to connect to informasi table');
      console.error('Status:', response.status);
      console.error('Error:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ Successfully connected to informasi table!');
    console.log(`📊 Total records retrieved: ${data.length}`);
    
    if (data.length > 0) {
      console.log('\n📋 Sample records:');
      data.forEach((record, index) => {
        console.log(`\n  Record ${index + 1}:`);
        console.log(`    ID: ${record.id}`);
        console.log(`    Date: ${record.date}`);
        console.log(`    Title: ${record.title}`);
        console.log(`    Content: ${record.content.substring(0, 50)}...`);
        console.log(`    Created at: ${record.created_at}`);
      });
    } else {
      console.log('\n⚠️  Table exists but is empty. No records found.');
    }

    return true;

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the check
checkInformasiTable().then(success => {
  process.exit(success ? 0 : 1);
});
