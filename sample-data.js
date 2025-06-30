// Sample data for admin panel screenshots
// Copy and paste this in browser console to populate the admin panel

// Sample Commands Data
const sampleCommands = [
  {
    id: "cmd-001",
    name: "أحمد محمد علي",
    phone: "0123456789",
    email: "ahmed.mohamed@email.com",
    services: ["cleaning", "delivery"],
    workers: "3",
    start: "القاهرة - مصر الجديدة",
    end: "الإسكندرية - سموحة",
    price: "2500",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    description: "نقل أثاث من شقة إلى شقة أخرى مع تنظيف شامل"
  },
  {
    id: "cmd-002", 
    name: "فاطمة أحمد حسن",
    phone: "0987654321",
    email: "fatima.ahmed@email.com",
    services: ["cleaning"],
    workers: "2",
    start: "الجيزة - الدقي",
    end: "الجيزة - الدقي",
    price: "800",
    status: "approved",
    createdAt: "2024-01-14T14:20:00Z",
    description: "تنظيف شقة 3 غرف نوم بعد السكن"
  }
];

// Sample Workers Data
const sampleWorkers = [
  {
    id: "worker-001",
    name: "محمد علي أحمد",
    email: "mohamed.ali@email.com",
    phone: "0111222333",
    position: "عامل تنظيف",
    experience: "5 سنوات",
    message: "لدي خبرة في تنظيف المنازل والمكاتب والفلل",
    isAccepted: null,
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "worker-002",
    name: "علي حسن محمد",
    email: "ali.hassan@email.com", 
    phone: "0444555666",
    position: "سائق نقل",
    experience: "8 سنوات",
    message: "سائق محترف مع رخصة نقل أثاث ومركبات ثقيلة",
    isAccepted: true,
    createdAt: "2024-01-12T16:45:00Z"
  }
];

// Function to populate admin panel with sample data
function populateAdminPanel() {
  console.log('🔄 Populating admin panel with sample data...');
  
  // Store sample data in localStorage to simulate API response
  localStorage.setItem('sampleCommands', JSON.stringify(sampleCommands));
  localStorage.setItem('sampleWorkers', JSON.stringify(sampleWorkers));
  
  console.log('✅ Sample data stored in localStorage');
  console.log('📋 Commands:', sampleCommands.length);
  console.log('👥 Workers:', sampleWorkers.length);
  
  // Reload the admin panel page to see the data
  console.log('🔄 Reload the admin panel page to see the sample data');
}

// Function to clear sample data
function clearSampleData() {
  localStorage.removeItem('sampleCommands');
  localStorage.removeItem('sampleWorkers');
  console.log('🗑️ Sample data cleared');
}

// Auto-run the population
populateAdminPanel();

console.log('📸 Ready for screenshots!');
console.log('💡 Use clearSampleData() to remove sample data when done'); 