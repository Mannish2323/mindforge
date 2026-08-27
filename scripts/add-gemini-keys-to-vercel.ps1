# ============================================================
# Mindforge — Add Gemini API Keys to Vercel Production
# Run this ONCE after you have your Gemini API keys from:
#   https://aistudio.google.com/app/apikey
#
# Usage: .\scripts\add-gemini-keys-to-vercel.ps1
# ============================================================

# Paste your 4 Gemini keys below (or use 1 key repeated if you only have 1)
$key1 = Read-Host "Enter GEMINI_API_KEY_1 (or press Enter to skip)"
$key2 = Read-Host "Enter GEMINI_API_KEY_2 (or press Enter to skip)"
$key3 = Read-Host "Enter GEMINI_API_KEY_3 (or press Enter to skip)"
$key4 = Read-Host "Enter GEMINI_API_KEY_4 (or press Enter to skip)"

if (-not $key1) {
    Write-Error "At least GEMINI_API_KEY_1 is required. Aborting."
    exit 1
}

# Fill remaining keys with first key if not provided
if (-not $key2) { $key2 = $key1 }
if (-not $key3) { $key3 = $key1 }
if (-not $key4) { $key4 = $key1 }

Write-Host "`nAdding Gemini keys to Vercel production environment..." -ForegroundColor Cyan

# Add keys to Vercel (production)
Write-Output $key1 | npx vercel@latest env add GEMINI_API_KEY_1 production --yes
Write-Output $key2 | npx vercel@latest env add GEMINI_API_KEY_2 production --yes
Write-Output $key3 | npx vercel@latest env add GEMINI_API_KEY_3 production --yes
Write-Output $key4 | npx vercel@latest env add GEMINI_API_KEY_4 production --yes

# Also update .env.local for local dev
$envContent = Get-Content ".env.local" -Raw
$envContent = $envContent -replace "GEMINI_API_KEY_1=.*", "GEMINI_API_KEY_1=$key1"
$envContent = $envContent -replace "GEMINI_API_KEY_2=.*", "GEMINI_API_KEY_2=$key2"
$envContent = $envContent -replace "GEMINI_API_KEY_3=.*", "GEMINI_API_KEY_3=$key3"
$envContent = $envContent -replace "GEMINI_API_KEY_4=.*", "GEMINI_API_KEY_4=$key4"
Set-Content ".env.local" $envContent

Write-Host "`n✅ Gemini API keys added successfully!" -ForegroundColor Green
Write-Host "Run 'npx vercel --prod' or push to GitHub to deploy with new keys." -ForegroundColor Yellow
