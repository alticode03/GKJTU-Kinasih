# Test Supabase Connection - PowerShell

$SUPABASE_URL = "https://rqswwfkkqaqphdnygsjw.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxc3d3ZmtraWFxcGhkbnlnc2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NTI4NzAsImV4cCI6MjA0MzMyODg3MH0.TtfLLVKzpW5PW9OjWYRvQ8Jj8SwWAbnkU9-0HGjnI"

Write-Host "🔍 Testing Supabase connection to table: informasi`n" -ForegroundColor Cyan

try {
    $headers = @{
        "Content-Type"    = "application/json"
        "apikey"          = $SUPABASE_KEY
        "Authorization"   = "Bearer $SUPABASE_KEY"
    }

    $uri = "$SUPABASE_URL/rest/v1/informasi?select=*&limit=5"
    $response = Invoke-WebRequest -Uri $uri `
                                  -Headers $headers `
                                  -UseBasicParsing

    Write-Host "✅ Successfully connected to informasi table!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "`n📊 Total records retrieved: $($data.Count)" -ForegroundColor Cyan
    
    if ($data.Count -gt 0) {
        Write-Host "`n📋 Sample records:" -ForegroundColor Cyan
        foreach ($record in $data) {
            Write-Host "`n  Record ID: $($record.id)" -ForegroundColor Yellow
            Write-Host "  Date: $($record.date)" -ForegroundColor Yellow
            Write-Host "  Title: $($record.title)" -ForegroundColor Yellow
            $contentPreview = $record.content.Substring(0, [Math]::Min(50, $record.content.Length))
            Write-Host "  Content: $contentPreview..." -ForegroundColor Yellow
            Write-Host "  Created: $($record.created_at)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "`n⚠️  Table exists but is empty. No records found." -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ Supabase connection test PASSED!" -ForegroundColor Green

} catch {
    Write-Host "❌ Connection error!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
