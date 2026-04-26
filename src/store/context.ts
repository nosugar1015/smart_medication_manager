import { createContext } from 'react'
import type { AppState, GrowthTreeState, MedicationItem, ReminderTask } from '../types'
import { getWarningLevel } from '../data/mockData'

export interface AppContextValue {
  state: AppState
  hasActiveMedicationPlan: boolean
  reminderOverview: Array<MedicationItem & { remainingDays: number; warningLevel: ReturnType<typeof getWarningLevel> }>
  pendingReminders: ReminderTask[]
  growthTree: GrowthTreeState
  updateDraft: (payload: Partial<AppState['consultationDraft']>) => void
  generatePlan: () => void
  confirmPlan: () => void
  completePurchase: () => void
  markReminderDone: (reminderId: string) => void
  snoozeReminder: (reminderId: string) => void
  updateReminderPreset: (preMeal: string[], postMeal: string[]) => void
  startRefill: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)
