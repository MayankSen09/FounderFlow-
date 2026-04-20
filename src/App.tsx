import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { FounderProvider } from './context/FounderContext';
import { Layout } from './components/Layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { StrategyGenerator } from './pages/StrategyGenerator';
import { ROICalculator } from './pages/ROICalculator';
import { Settings } from './pages/Settings';
import FunnelBuilder from './pages/FunnelBuilder';
import AdvancedPlaybookGenerator from './pages/AdvancedPlaybookGenerator';
import AIAdvisor from './pages/AIAdvisor';
import FounderJournal from './pages/FounderJournal';
import FundingTracker from './pages/FundingTracker';
import TrendsNews from './pages/TrendsNews';
import FundingDirectory from './pages/FundingDirectory';
import CapTable from './pages/CapTable';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated || !user) {
        return <Navigate to="/onboarding" replace />;
    }
    return <>{children}</>;
}

function AppContent() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Founder Core */}
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/advisor" element={<PrivateRoute><Layout><AIAdvisor /></Layout></PrivateRoute>} />
            <Route path="/journal" element={<PrivateRoute><Layout><FounderJournal /></Layout></PrivateRoute>} />
            <Route path="/funding" element={<PrivateRoute><Layout><FundingTracker /></Layout></PrivateRoute>} />

            {/* Discover */}
            <Route path="/trends" element={<PrivateRoute><Layout><TrendsNews /></Layout></PrivateRoute>} />
            <Route path="/directory" element={<PrivateRoute><Layout><FundingDirectory /></Layout></PrivateRoute>} />

            {/* Strategy & Ops */}
            <Route path="/strategy" element={<PrivateRoute><Layout><StrategyGenerator /></Layout></PrivateRoute>} />
            <Route path="/roi-calculator" element={<PrivateRoute><Layout><ROICalculator /></Layout></PrivateRoute>} />
            <Route path="/advanced-playbook" element={<PrivateRoute><Layout><AdvancedPlaybookGenerator /></Layout></PrivateRoute>} />
            <Route path="/funnel-builder" element={<PrivateRoute><Layout><FunnelBuilder /></Layout></PrivateRoute>} />
            <Route path="/cap-table" element={<PrivateRoute><Layout><CapTable /></Layout></PrivateRoute>} />

            {/* Settings */}
            <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <DataProvider>
                            <FounderProvider>
                                <AppContent />
                            </FounderProvider>
                        </DataProvider>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
