// Simple test script to create a command
const testCommand = {
  fullname: "Test User",
  number: "123456789",
  flor: "5",
  itemtype: "Glass",
  service: "cleaning, delivery",
  workers: "2",
  start: "Cairo",
  distination: "Alexandria"
};

console.log('Testing CreateCommand endpoint...');
console.log('Data to send:', testCommand);

fetch('https://gokrixo.onrender.com/CreateCommand', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testCommand)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Command created successfully:', data);
  
  // Now test GetCommands to see if it appears
  return fetch('https://gokrixo.onrender.com/GetCommands');
})
.then(response => {
  console.log('GetCommands response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('📋 Commands in database:', data);
  console.log('Number of commands:', data.length);
})
.catch(error => {
  console.error('❌ Error:', error);
}); 