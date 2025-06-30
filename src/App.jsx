import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ContactPage from './ContactPage';
import HireUsPage from './HireUsPage';
import AdminPanel from './AdminPanel';
import WorkerProfile from './WorkerProfile';
import APITest from './components/APITest';
import BackendTest from './components/BackendTest';
import BackendDiagnostic from './components/BackendDiagnostic';
import SimpleApiTest from './components/SimpleApiTest';
import DetailedApiTest from './components/DetailedApiTest';
import AdminTest from './components/AdminTest';
import ErrorPage from './components/ErrorPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hire-us" element={<HireUsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/login" element={<WorkerProfile />} />
          <Route path="/api-test" element={<APITest />} />
          <Route path="/backend-test" element={<BackendTest />} />
          <Route path="/backend-diagnostic" element={<BackendDiagnostic />} />
          <Route path="/simple-api-test" element={<SimpleApiTest />} />
          <Route path="/detailed-api-test" element={<DetailedApiTest />} />
          <Route path="/admin-test" element={<AdminTest />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;