import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { SessionsList } from './pages/SessionsList';
import { CreateSession } from './pages/CreateSession';
import { SessionDetail } from './pages/SessionDetail';
import { QRDisplay } from './pages/QRDisplay';
import { WorkerEnrollment } from './pages/WorkerEnrollment';
import { Compliance } from './pages/Compliance';
import { OTPRExport } from './pages/OTPRExport';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public enrollment route - different layout */}
        <Route path="/enroll/:sessionId" element={<WorkerEnrollment />} />

        {/* Full-screen QR display */}
        <Route path="/sessions/:id/qr" element={<QRDisplay />} />

        {/* Trainer portal with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sessions" element={<SessionsList />} />
          <Route path="/sessions/new" element={<CreateSession />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/sessions/:id/otpr" element={<OTPRExport />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
