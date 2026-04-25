import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppProvider } from './store/AppContext'
import { AppShell } from './components/AppShell'
import { ConsultationPage } from './pages/ConsultationPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { PlanPage } from './pages/PlanPage'
import { PurchasePage } from './pages/PurchasePage'
import { RefillPage } from './pages/RefillPage'
import { ReminderPage } from './pages/ReminderPage'
import { SettingsPage } from './pages/SettingsPage'
import { GrowthPage } from './pages/GrowthPage'

function App() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reminders" element={<ReminderPage />} />
          <Route path="/refill" element={<RefillPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </AppProvider>
  )
}

export default App
