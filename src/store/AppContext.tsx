import { useEffect, useMemo, useReducer } from 'react'
import dayjs from 'dayjs'
import {
  calculateRemainingDays,
  createMedicationReminders,
  createPlanByDisease,
  getDefaultDisease,
  getWarningLevel,
  initialState,
} from '../data/mockData'
import type { AppState, GrowthState, MedicationItem, ReminderTask } from '../types'
import { AppContext } from './context'
import type { AppContextValue } from './context'

const STORAGE_KEY = 'chronic-disease-manager-state'

type Action =
  | { type: 'update-draft'; payload: Partial<AppState['consultationDraft']> }
  | { type: 'generate-plan' }
  | { type: 'confirm-plan' }
  | { type: 'complete-purchase' }
  | { type: 'mark-reminder-done'; payload: { reminderId: string } }
  | { type: 'snooze-reminder'; payload: { reminderId: string } }
  | { type: 'update-reminder-preset'; payload: { preMeal: string[]; postMeal: string[] } }
  | { type: 'start-refill' }

const getStoredState = (): AppState => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialState

  try {
    return JSON.parse(raw) as AppState
  } catch {
    return initialState
  }
}

const updateGrowth = (growth: GrowthState, delta: number): GrowthState => {
  const points = Math.max(growth.points + delta, 0)
  const stage = points >= 90 ? '开花' : points >= 70 ? '含苞' : points >= 40 ? '生长' : '萌芽'

  return {
    points,
    streakDays: delta > 0 ? growth.streakDays + 1 : growth.streakDays,
    stage,
  }
}

const updateMedicationProgress = (medications: MedicationItem[], reminder: ReminderTask) =>
  medications.map((medication) =>
    medication.id === reminder.medicationId
      ? { ...medication, takenQuantity: Math.min(medication.takenQuantity + 1, medication.totalQuantity) }
      : medication,
  )

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'update-draft': {
      const nextDraft = { ...state.consultationDraft, ...action.payload }
      if (!nextDraft.diseaseType) {
        nextDraft.diseaseType = getDefaultDisease(nextDraft.mode)
      }
      return { ...state, consultationDraft: nextDraft }
    }
    case 'generate-plan': {
      const consultationId = `consult-${Date.now()}`
      const medications = createPlanByDisease(state.consultationDraft.diseaseType)
      return {
        ...state,
        latestConsultation: {
          id: consultationId,
          mode: state.consultationDraft.mode,
          diseaseType: state.consultationDraft.diseaseType,
          symptomSummary: state.consultationDraft.symptomSummary,
          followUpAnswer: state.consultationDraft.followUpAnswer,
          uploadedFileName: state.consultationDraft.uploadedFileName,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        },
        plan: {
          id: `plan-${Date.now()}`,
          consultationId,
          diseaseType: state.consultationDraft.diseaseType,
          medications,
          confirmed: false,
          purchaseStatus: 'pending',
        },
      }
    }
    case 'confirm-plan': {
      if (!state.plan) return state
      return { ...state, plan: { ...state.plan, confirmed: true } }
    }
    case 'complete-purchase': {
      if (!state.plan) return state
      const medications = state.plan.medications.map((medication) => ({
        ...medication,
        customReminderTimes:
          medication.timing === '饭前' ? state.profile.reminderPreset.preMeal : state.profile.reminderPreset.postMeal,
      }))
      return {
        ...state,
        plan: { ...state.plan, medications, purchaseStatus: 'purchased' },
        reminders: createMedicationReminders(medications),
      }
    }
    case 'mark-reminder-done': {
      if (!state.plan) return state
      const reminder = state.reminders.find((item) => item.id === action.payload.reminderId)
      if (!reminder) return state

      const medications = updateMedicationProgress(state.plan.medications, reminder)
      return {
        ...state,
        plan: { ...state.plan, medications },
        reminders: state.reminders.map((item) =>
          item.id === action.payload.reminderId ? { ...item, status: 'done' } : item,
        ),
        growth: updateGrowth(state.growth, 3),
      }
    }
    case 'snooze-reminder': {
      return {
        ...state,
        reminders: state.reminders.map((item) =>
          item.id === action.payload.reminderId
            ? {
                ...item,
                status: 'snoozed',
                scheduledTime: dayjs(`2026-01-01 ${item.scheduledTime}`).add(10, 'minute').format('HH:mm'),
              }
            : item,
        ),
        growth: updateGrowth(state.growth, 1),
      }
    }
    case 'update-reminder-preset': {
      const reminderPreset = action.payload
      const medications =
        state.plan?.medications.map((medication) => ({
          ...medication,
          customReminderTimes: medication.timing === '饭前' ? reminderPreset.preMeal : reminderPreset.postMeal,
        })) ?? state.plan?.medications

      return {
        ...state,
        profile: { ...state.profile, reminderPreset },
        plan: state.plan ? { ...state.plan, medications: medications ?? state.plan.medications } : state.plan,
        reminders: medications ? createMedicationReminders(medications) : state.reminders,
      }
    }
    case 'start-refill': {
      const diseaseType = state.plan?.diseaseType ?? state.consultationDraft.diseaseType
      return {
        ...state,
        consultationDraft: {
          ...state.consultationDraft,
          mode: 'refill',
          diseaseType,
          symptomSummary: `${diseaseType} 续方，近三日状态平稳，希望续开常用药。`,
          followUpAnswer: '近一周指标整体稳定，药品即将耗尽，需要续方。',
        },
      }
    }
    default:
      return state
  }
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, getStoredState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<AppContextValue>(() => {
    const medications = state.plan?.medications ?? []
    return {
      state,
      reminderOverview: medications.map((medication) => {
        const remainingDays = calculateRemainingDays(medication)
        return {
          ...medication,
          remainingDays,
          warningLevel: getWarningLevel(remainingDays),
        }
      }),
      pendingReminders: state.reminders.filter((reminder) => reminder.status !== 'done'),
      updateDraft: (payload) => dispatch({ type: 'update-draft', payload }),
      generatePlan: () => dispatch({ type: 'generate-plan' }),
      confirmPlan: () => dispatch({ type: 'confirm-plan' }),
      completePurchase: () => dispatch({ type: 'complete-purchase' }),
      markReminderDone: (reminderId) => dispatch({ type: 'mark-reminder-done', payload: { reminderId } }),
      snoozeReminder: (reminderId) => dispatch({ type: 'snooze-reminder', payload: { reminderId } }),
      updateReminderPreset: (preMeal, postMeal) =>
        dispatch({ type: 'update-reminder-preset', payload: { preMeal, postMeal } }),
      startRefill: () => dispatch({ type: 'start-refill' }),
    }
  }, [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

