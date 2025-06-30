// Screenshot Mode Control for Admin Panel
// Copy and paste these commands in browser console

// Enable screenshot mode (shows sample data)
function enableScreenshotMode() {
  localStorage.setItem('screenshotMode', 'true');
  console.log('📸 Screenshot mode ENABLED');
  console.log('🔄 Refresh the admin panel page to see sample data');
}

// Disable screenshot mode (returns to normal API calls)
function disableScreenshotMode() {
  localStorage.removeItem('screenshotMode');
  console.log('📸 Screenshot mode DISABLED');
  console.log('🔄 Refresh the admin panel page to return to normal mode');
}

// Check current mode
function checkScreenshotMode() {
  const isEnabled = localStorage.getItem('screenshotMode') === 'true';
  console.log('📸 Screenshot mode is:', isEnabled ? 'ENABLED' : 'DISABLED');
  return isEnabled;
}

// Quick enable
enableScreenshotMode(); 