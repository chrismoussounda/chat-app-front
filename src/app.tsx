import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Import components
import ThemeProvider from '@/components/provider/theme-provider';
import InitialModal from '@/components/modals/initial-modal';
import ProtectedRoute from '@/features/authentification/protected-route';
import Auth from '@/pages/auth';
import ToastProvider from '@/components/provider/toast-provider';
import MainLayout from '@/layouts/main-layout';

// Import styles
import '@/styles/index.css';
import '@livekit/components-styles/index.css';

// Import components for query and devtools
import QueryClientProvider from '@/components/provider/query-client-provider';

// Import pages
import ChannelPage from '@/pages/channel';
import MemberPage from '@/pages/member';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="chatify-theme">
      <QueryClientProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<InitialModal />} />
                <Route path="/servers/:serverId" element={<MainLayout />}>
                  <Route path="channels/:channelId" element={<ChannelPage />} />
                  <Route path="conversations/:memberId" element={<MemberPage />} />
                </Route>
              </Route>
              <Route path="sign-in" element={<Auth />} />
              <Route path="sign-up" element={<Auth />} />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
