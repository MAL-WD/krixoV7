import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import logo from './assets/Logo.png';
import { commandAPI } from './services/api';
import { Route } from 'react-router-dom';
import HireUsPage from './HireUsPage';

const BACKEND_URL = 'https://gokrixo.onrender.com';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('commands');
  const [commands, setCommands] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [usingProxy] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setInitialLoading(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Redirect to home page
    window.location.href = '/';
  };

  const  fetchData = async () => {
    setInitialLoading(true);
    try {
      console.log('🔄 Fetching data from admin panel...');
      
      // Fetch commands using the direct API call
      console.log('📋 Fetching commands from backend...');
      let commandsData;
      try {
        // Try the regular API first
        console.log('🔄 Trying regular getCommands...');
        commandsData = await commandAPI.getCommands();
        console.log('✅ Regular getCommands successful');
      } catch (error) {
        console.log('⚠️ Regular getCommands failed, trying direct...');
        console.log('⚠️ Error:', error.message);
        try {
          // Fall back to direct API
          commandsData = await commandAPI.getCommandsDirect();
          console.log('✅ Direct getCommands successful');
        } catch (directError) {
          console.error('❌ Both regular and direct getCommands failed');
          console.error('❌ Regular error:', error.message);
          console.error('❌ Direct error:', directError.message);
          
          // Check if it's the known database error
          if (directError.message.includes('sql: Scan error') || directError.message.includes('converting driver.Value')) {
            console.log('🔧 Detected backend database error - using sample data');
            toast.warning('الخادم يحتوي على خطأ في قاعدة البيانات. يتم عرض بيانات تجريبية.');
            
            // Use sample data as fallback
            commandsData = [
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
          } else {
            // If it's a different error, throw it
            throw directError;
          }
        }
      }
      console.log('📋 Raw commands data:', commandsData);
      
      // Validate and transform commands data if needed
      let processedCommands = commandsData;
      if (Array.isArray(commandsData)) {
        processedCommands = commandsData.map(command => ({
          id: command.id || command._id || `cmd-${Date.now()}-${Math.random()}`,
          name: command.name || command.fullname || command.firstName || 'غير محدد',
          phone: command.phone || command.number || 'غير محدد',
          email: command.email || '',
          floor: command.floor || command.flor || 'غير محدد',
          itemType: command.itemType || command.itemtype || 'غير محدد',
          services: Array.isArray(command.services) 
            ? command.services 
            : typeof command.service === 'string' 
              ? command.service.split(',').map(s => s.trim())
              : [command.service || 'غير محدد'],
          workers: command.workers || 'غير محدد',
          start: command.start || 'غير محدد',
          end: command.end || command.distination || 'غير محدد',
          price: command.price || '',
          status: command.status || 'pending',
          createdAt: command.createdAt || new Date().toISOString(),
          description: command.description || ''
        }));
      } else if (commandsData && typeof commandsData === 'object') {
        // If it's an object, try to extract array from it
        const possibleArrays = Object.values(commandsData).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          processedCommands = possibleArrays[0].map(command => ({
            id: command.id || command._id || `cmd-${Date.now()}-${Math.random()}`,
            name: command.name || command.fullname || command.firstName || 'غير محدد',
            phone: command.phone || command.number || 'غير محدد',
            email: command.email || '',
            floor: command.floor || command.flor || 'غير محدد',
            itemType: command.itemType || command.itemtype || 'غير محدد',
            services: Array.isArray(command.services) 
              ? command.services 
              : typeof command.service === 'string' 
                ? command.service.split(',').map(s => s.trim())
                : [command.service || 'غير محدد'],
            workers: command.workers || 'غير محدد',
            start: command.start || 'غير محدد',
            end: command.end || command.distination || 'غير محدد',
            price: command.price || '',
            status: command.status || 'pending',
            createdAt: command.createdAt || new Date().toISOString(),
            description: command.description || ''
          }));
        } else {
          processedCommands = [];
        }
      } else {
        processedCommands = [];
      }
      
      console.log('📋 Processed commands data:', processedCommands);
      setCommands(processedCommands);
      console.log('✅ Commands loaded successfully:', processedCommands.length, 'commands');
      
      // Fetch workers using the direct API call
      console.log('👥 Fetching workers from backend...');
      // const workersData = await workerAPI.getWorkersDirect();
      // console.log('👥 Raw workers data:', workersData);
      
      // // Validate and transform workers data if needed
      // let processedWorkers = workersData;
      // if (Array.isArray(workersData)) {
      //   processedWorkers = workersData.map(worker => ({
      //     id: worker.id || worker._id || `worker-${Date.now()}-${Math.random()}`,
      //     name: worker.name || worker.fullname || 'غير محدد',
      //     email: worker.email || 'غير محدد',
      //     phone: worker.number || worker.phone || 'غير محدد',
      //     position: worker.position || 'غير محدد',
      //     experience: worker.experience || 'غير محدد',
      //     message: worker.message || '',
      //     isAccepted: worker.isAccepted !== undefined ? worker.isAccepted : null,
      //     createdAt: worker.createdAt || new Date().toISOString()
      //   }));
      // } else if (workersData && typeof workersData === 'object') {
      //   // If it's an object, try to extract array from it
      //   const possibleArrays = Object.values(workersData).filter(val => Array.isArray(val));
      //   if (possibleArrays.length > 0) {
      //     processedWorkers = possibleArrays[0];
      //   } else {
      //     processedWorkers = [];
      //   }
      // } else {
      //   processedWorkers = [];
      // }
      
      // console.log('👥 Processed workers data:', processedWorkers);
      // setWorkers(processedWorkers);
      // console.log('✅ Workers loaded successfully:', processedWorkers.length, 'workers');
      
      // FORCE SCREENSHOT MODE - Always show sample data for screenshots
      console.log('📸 FORCED Screenshot mode - using sample data for commands');
      
      // const sampleCommands = [
      //   {
      //     id: "cmd-001",
      //     name: "أحمد محمد علي",
      //     phone: "0123456789",
      //     email: "ahmed.mohamed@email.com",
      //     services: ["cleaning", "delivery"],
      //     workers: "3",
      //     start: "القاهرة - مصر الجديدة",
      //     end: "الإسكندرية - سموحة",
      //     price: "2500",
      //     status: "pending",
      //     createdAt: "2024-01-15T10:30:00Z",
      //     description: "نقل أثاث من شقة إلى شقة أخرى مع تنظيف شامل"
      //   },
      //   {
      //     id: "cmd-002", 
      //     name: "فاطمة أحمد حسن",
      //     phone: "0987654321",
      //     email: "fatima.ahmed@email.com",
      //     services: ["cleaning"],
      //     workers: "2",
      //     start: "الجيزة - الدقي",
      //     end: "الجيزة - الدقي",
      //     price: "800",
      //     status: "approved",
      //     createdAt: "2024-01-14T14:20:00Z",
      //     description: "تنظيف شقة 3 غرف نوم بعد السكن"
      //   }
      // ];

      // Restore sample workers test data
      // const sampleWorkers = [
      //   {
      //     id: "worker-001",
      //     name: "محمد علي أحمد",
      //     email: "mohamed.ali@email.com",
      //     phone: "0111222333",
      //     position: "عامل تنظيف",
      //     experience: "5 سنوات",
      //     message: "لدي خبرة في تنظيف المنازل والمكاتب والفلل",
      // isAccepted: null,
      //     createdAt: "2024-01-13T09:15:00Z"
      //   },
      //   {
      //     id: "worker-002",
      //     name: "علي حسن محمد",
      //     email: "ali.hassan@email.com", 
      //     phone: "0444555666",
      //     position: "سائق نقل",
      //     experience: "8 سنوات",
      //     message: "سائق محترف مع رخصة نقل أثاث ومركبات ثقيلة",
      //     isAccepted: true,
      //     createdAt: "2024-01-12T16:45:00Z"
      //   }
      // ];

      // setCommands(sampleCommands);
      // setWorkers(sampleWorkers);
      // console.log('✅ Screenshot data loaded - Commands:', sampleCommands.length, 'Workers:', sampleWorkers.length);
      
    } catch (error) {
      console.error('❌ Unexpected error in fetchData:', error);
      console.error('❌ Error stack:', error.stack);
      toast.error('فشل في تحميل البيانات: ' + (error.message || 'خطأ غير متوقع'));
      setBackendError(true);
    } finally {
      setInitialLoading(false);
    }
  };

  // Show network error page if backend is not reachable
  if (backendError && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4" dir="rtl">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#1e40af',
              color: '#f8fafc',
              border: '1px solid #3b82f6'
            }
          }}
        />
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-blue-800/90 to-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-600/50 overflow-hidden">
            <div className="text-center p-8">
              <div className="mb-6">
                <img src={logo} alt="KRIXO" className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
              </div>
              
              <div className="mb-6">
                <div className="text-8xl mb-4 bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-bold">
                  🌐
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  خطأ في الاتصال
                </h1>
                <h2 className="text-2xl font-semibold text-blue-200 mb-4">
                  لا يمكن الاتصال بالخادم
                </h2>
                <p className="text-blue-300 text-lg leading-relaxed max-w-md mx-auto">
                  عذراً، لا يمكن الاتصال بالخادم في الوقت الحالي. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={fetchData}
                  disabled={initialLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {initialLoading ? '🔄 جاري المحاولة...' : '🔄 إعادة المحاولة'}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ⬅️ العودة للخلف
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/30">
              <h3 className="text-lg font-semibold text-blue-200 mb-3">نصائح لحل المشكلة:</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-blue-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  تحقق من اتصال الإنترنت
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  انتظر قليلاً وحاول مرة أخرى
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  تواصل مع الدعم الفني
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // API call functions
  const approveCommand = async (commandId) => {
    setLoading(true);
    try {
      console.log('Approving command:', commandId);
      
      await axios.put(`${BACKEND_URL}/UpdateCommandStatus`, { 
        commandId, 
        status: 'approved' 
      });
      
      console.log('Command approval successful');
      
      // Update local state
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId ? { ...cmd, status: 'approved' } : cmd
      ));

      // Send approval email
      const command = commands.find(cmd => cmd.id === commandId);
      await sendCommandEmail(command, 'approved');
      
      toast.success('تم قبول الطلب وإرسال إيميل للعميل');
    } catch (error) {
      console.error('Error approving command:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء قبول الطلب');
    } finally {
      setLoading(false);
    }
  };

  const rejectCommand = async (commandId) => {
    setLoading(true);
    try {
      console.log('Rejecting command:', commandId);
      
      await axios.put(`${BACKEND_URL}/UpdateCommandStatus`, { 
        commandId, 
        status: 'rejected' 
      });
      
      console.log('Command rejection successful');
      
      // Update local state
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId ? { ...cmd, status: 'rejected' } : cmd
      ));

      // Send rejection email
      const command = commands.find(cmd => cmd.id === commandId);
      await sendCommandEmail(command, 'rejected');
      
      toast.success('تم رفض الطلب وإرسال إيميل للعميل');
    } catch (error) {
      console.error('Error rejecting command:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء رفض الطلب');
    } finally {
      setLoading(false);
    }
  };

  const approveWorker = async (workerId, password) => {
    setLoading(true);
    try {
      console.log('Approving worker:', workerId);
      
      await axios.put(`${BACKEND_URL}/UpdateWorkerStatus`, { 
        workerId, 
        status: 'approved', 
        password 
      });
      
      console.log('Worker approval successful');
      
      // Update local state
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, isAccepted: true, password: password } : worker
      ));
      
      toast.success('تم قبول العامل بنجاح');
    } catch (error) {
      console.error('Error approving worker:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء قبول العامل');
    } finally {
      setLoading(false);
    }
  };

  const rejectWorker = async (workerId) => {
    setLoading(true);
    try {
      console.log('Rejecting worker:', workerId);
      
      await axios.put(`${BACKEND_URL}/UpdateWorkerStatus`, { 
        workerId, 
        status: 'rejected' 
      });
      
      console.log('Worker rejection successful');
      
      // Update local state
      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, isAccepted: false } : worker
      ));
      
      toast.success('تم رفض العامل بنجاح');
    } catch (error) {
      console.error('Error rejecting worker:', error);
      toast.error(error.response?.data?.message || error.message || 'حدث خطأ أثناء رفض العامل');
    } finally {
      setLoading(false);
    }
  };

  const sendCommandEmail = async (command, status) => {
    try {
      const templateParams = {
        to_email: command.email,
        to_name: command.name,
        status: status === 'approved' ? 'مقبول' : 'مرفوض',
        service_details: Array.isArray(command.services) ? command.services.join(', ') : command.services,
        price: command.price,
        start_location: command.start,
        end_location: command.end
      };

      await emailjs.send(
        'service_krixo',
        status === 'approved' ? 'template_command_approved' : 'template_command_rejected',
        templateParams,
        'your_public_key'
      );

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('فشل في إرسال الإيميل للعميل');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" dir="rtl">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e40af',
            color: '#f8fafc',
            border: '1px solid #3b82f6'
          }
        }}
      />
      
      {/* Main Header */}
      <div className="fixed z-50 top-4 sm:top-6 md:top-8 left-0 right-0 w-full px-2 sm:px-4 md:px-6">
        <div className="flex min-h-16 sm:min-h-18 md:min-h-20 bg-white/8 text-black rounded-full shadow w-full max-w-6xl mx-auto justify-between items-center py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 md:px-6 bg-opacity-50 backdrop-blur-2xl shadow-md overflow-x-hidden">
          <div className="flex items-center gap-4">
            <img src={logo} alt="KRIXO" className="w-12 h-12 drop-shadow-lg" />
            <div>
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                لوحة التحكم - KRIXO
              </h1>
              <p className="text-blue-300 text-sm">إدارة الطلبات والعمال</p>
            </div>
            {usingProxy && (
              <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                خادم وسيط
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              disabled={initialLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg"
            >
              {initialLoading ? 'جاري التحميل...' : 'تحديث البيانات'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gradient-to-r from-blue-800/50 to-blue-900/50 backdrop-blur-xl border-b border-blue-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab('commands')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'commands'
                  ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
                  : 'border-transparent text-blue-300 hover:text-blue-200 hover:bg-blue-700/30 rounded-t-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>الطلبات</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {commands.filter(cmd => cmd.status === 'pending').length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'workers'
                  ? 'border-yellow-500 text-yellow-300 bg-yellow-500/10 rounded-t-lg'
                  : 'border-transparent text-blue-300 hover:text-blue-200 hover:bg-blue-700/30 rounded-t-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>طلبات التوظيف</span>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                  {workers.filter(worker => worker.isAccepted === null).length}
                </span>
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {initialLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-6"></div>
              <p className="text-blue-300 text-lg">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'commands' && (
              <div>
            <CommandsTab
              commands={commands}
              onApprove={approveCommand}
              onReject={rejectCommand}
              loading={loading}
            />
              </div>
          )}
          {activeTab === 'workers' && (
              <div>
            <WorkersTab
              workers={workers}
              onApprove={approveWorker}
              onReject={rejectWorker}
              loading={loading}
            />
              </div>
          )}
        </AnimatePresence>
        )}
      </main>
    </div>
  );
};

// Commands Tab Component
const CommandsTab = ({ commands, onApprove, onReject, loading }) => {
  if (!commands || commands.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white mb-8">إدارة الطلبات</h2>
        <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-12 border border-blue-600/50 text-center">
          <div className="text-blue-300 text-6xl mb-4">📋</div>
          <p className="text-blue-200 text-xl">لا توجد طلبات حالياً</p>
          <p className="text-blue-400 mt-2">ستظهر الطلبات الجديدة هنا عند وصولها</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة الطلبات</h2>
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30">
            <span className="text-sm">إجمالي الطلبات: </span>
            <span className="font-bold">{commands.length}</span>
          </div>
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-sm">في الانتظار: </span>
            <span className="font-bold">{commands.filter(cmd => cmd.status === 'pending').length}</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        {commands.map((command) => (
          <div
            key={command.id}
            className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-blue-600/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{command.name}</h3>
                <div className="flex items-center gap-4 text-blue-300">
                  <span className="flex items-center gap-1">
                    <span>📞</span>
                    {command.phone}
                  </span>
                  {command.email && (
                    <span className="flex items-center gap-1">
                      <span>📧</span>
                      {command.email}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  command.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  command.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {command.status === 'pending' ? '⏳ في الانتظار' :
                   command.status === 'approved' ? '✅ مقبول' : '❌ مرفوض'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">الخدمات المطلوبة:</p>
                <p className="font-bold text-blue-200 text-lg">
                  {Array.isArray(command.services) ? command.services.join(', ') : command.services}
                </p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">السعر:</p>
                <p className="font-bold text-yellow-300 text-xl">{command.price} دج</p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">من:</p>
                <p className="font-bold text-white">{command.start}</p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">إلى:</p>
                <p className="font-bold text-white">{command.end}</p>
              </div>
            </div>

            {command.status === 'pending' && (
              <div className="flex gap-4">
                <button
                  onClick={() => onApprove(command.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                >
                  {loading ? '⏳ جاري...' : '✅ قبول'}
                </button>
                <button
                  onClick={() => onReject(command.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                >
                  {loading ? '⏳ جاري...' : '❌ رفض'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Workers Tab Component
const WorkersTab = ({ workers, onApprove, onReject, loading }) => {
  const [passwords, setPasswords] = useState({});

  // Debug logging
  console.log('🔍 WorkersTab received workers:', workers);
  console.log('🔍 Workers type:', typeof workers);
  console.log('🔍 Workers length:', workers?.length);
  console.log('🔍 Workers is array:', Array.isArray(workers));

  const handleApprove = (workerId) => {
    const password = passwords[workerId];
    if (!password) {
      toast.error('يرجى إدخال كلمة مرور للعامل');
      return;
    }
    onApprove(workerId, password);
  };

  // Ensure workers is an array and has content
  const validWorkers = Array.isArray(workers) ? workers : [];
  const hasWorkers = validWorkers.length > 0;

  console.log('🔍 Valid workers count:', validWorkers.length);
  console.log('🔍 Has workers:', hasWorkers);

  if (!hasWorkers) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white mb-8">إدارة طلبات التوظيف</h2>
        <div className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-12 border border-blue-600/50 text-center">
          <div className="text-blue-300 text-6xl mb-4">👥</div>
          <p className="text-blue-200 text-xl">لا توجد طلبات توظيف حالياً</p>
          <p className="text-blue-400 mt-2">ستظهر طلبات التوظيف الجديدة هنا عند وصولها</p>
          <div className="mt-4 p-4 bg-blue-700/30 rounded-xl">
            <p className="text-sm text-blue-300">معلومات التصحيح:</p>
            <p className="text-xs text-blue-400">نوع البيانات: {typeof workers}</p>
            <p className="text-xs text-blue-400">عدد العناصر: {workers?.length || 0}</p>
            <p className="text-xs text-blue-400">مصفوفة: {Array.isArray(workers) ? 'نعم' : 'لا'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">إدارة طلبات التوظيف</h2>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-sm">إجمالي الطلبات: </span>
            <span className="font-bold">{validWorkers.length}</span>
          </div>
          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-sm">في الانتظار: </span>
            <span className="font-bold">{validWorkers.filter(worker => worker.isAccepted === null).length}</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        {validWorkers.map((worker, index) => (
          <div
            key={worker.id || `worker-${index}`}
            className="bg-gradient-to-br from-blue-800/50 to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-blue-600/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{worker.name || worker.fullname || 'غير محدد'}</h3>
                <div className="flex items-center gap-4 text-blue-300">
                  <span className="flex items-center gap-1">
                    <span>📧</span>
                    {worker.email || 'غير محدد'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📞</span>
                    {worker.phone || worker.number || 'غير محدد'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  worker.isAccepted === null ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  worker.isAccepted ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {worker.isAccepted === null ? '⏳ في الانتظار' :
                   worker.isAccepted ? '✅ مقبول' : '❌ مرفوض'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">المنصب المطلوب:</p>
                <p className="font-bold text-yellow-300 text-lg">{worker.position || 'غير محدد'}</p>
              </div>
              <div className="bg-blue-700/30 rounded-xl p-4">
                <p className="text-sm text-blue-300 mb-2">الخبرة:</p>
                <p className="font-bold text-white">{worker.experience || 'غير محدد'}</p>
              </div>
            </div>

            {worker.message && (
              <div className="mb-6">
                <p className="text-sm text-blue-300 mb-2">الرسالة:</p>
                <div className="bg-blue-700/30 p-4 rounded-xl border border-blue-600/30">
                  <p className="text-white">{worker.message}</p>
                </div>
              </div>
            )}

            {worker.isAccepted === null && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    كلمة مرور العامل (مطلوبة للقبول)
                  </label>
                  <input
                    type="password"
                    value={passwords[worker.id] || ''}
                    onChange={(e) => setPasswords(prev => ({ ...prev, [worker.id]: e.target.value }))}
                    className="w-full px-4 py-3 bg-blue-700/50 border border-blue-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder:text-blue-300 transition-all duration-200"
                    placeholder="أدخل كلمة مرور للعامل"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(worker.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                  >
                    {loading ? '⏳ جاري...' : '✅ قبول'}
                  </button>
                  <button
                    onClick={() => onReject(worker.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 shadow-lg flex items-center gap-2"
                  >
                    {loading ? '⏳ جاري...' : '❌ رفض'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;