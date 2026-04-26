export type ConsultationMode = 'first-visit' | 'refill'
export type TimingType = '饭前' | '饭后' | '空腹' | '随餐'
export type PurchaseMethod = 'online' | 'offline'
export type PurchaseStatus = 'pending' | 'purchased'
export type ReminderStatus = 'pending' | 'done' | 'snoozed'
export type WarningLevel = 'none' | 'yellow' | 'orange' | 'red'

export interface UserProfile {
  name: string
  age: number
  chronicDiseases: string[]
  allergies: string[]
  medicalHistory: string[]
  familyPhone: string
  reminderPreset: {
    preMeal: string[]
    postMeal: string[]
  }
  healthMetrics: {
    bloodPressure: string[]
    bloodSugar: string[]
  }
}

export interface ConsultationRecord {
  id: string
  mode: ConsultationMode
  diseaseType: string
  symptomSummary: string
  followUpAnswer: string
  uploadedFileName?: string
  createdAt: string
}

export interface MedicationItem {
  id: string
  name: string
  genericName: string
  image: string
  dose: string
  frequencyPerDay: number
  timing: TimingType
  cycleDays: number
  totalQuantity: number
  takenQuantity: number
  customReminderTimes?: string[]
}

export interface MedicationPlan {
  id: string
  consultationId: string
  diseaseType: string
  medications: MedicationItem[]
  confirmed: boolean
  purchaseStatus: PurchaseStatus
}

export interface ReminderTask {
  id: string
  medicationId: string
  medicationName: string
  scheduledTime: string
  status: ReminderStatus
  encouragement: string
}

export interface GrowthState {
  points: number
  streakDays: number
  stage: '待提升' | '执行中' | '稳定期' | '依从良好'
}

export interface GrowthTreeState {
  stageName: string
  stageDescription: string
  treeSymbol: string
  nextStageName: string | null
  nextStagePoints: number | null
  remainingPoints: number
  progressPercent: number
  encouragement: string
  todayTip: string
  ruleSummary: string[]
}

export interface AppState {
  profile: UserProfile
  consultationDraft: {
    mode: ConsultationMode
    symptomSummary: string
    diseaseType: string
    followUpAnswer: string
    uploadedFileName: string
  }
  latestConsultation: ConsultationRecord | null
  plan: MedicationPlan | null
  reminders: ReminderTask[]
  growth: GrowthState
}
