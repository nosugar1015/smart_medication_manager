import type { AppState, ConsultationMode, MedicationItem, ReminderTask, WarningLevel } from '../types'

export const encouragements = [
  '坚持用药，身体会越来越稳。',
  '今天也在认真照顾自己，继续加油。',
  '按时服药一步步，健康就会更靠近。',
]

export const defaultReminderPreset = {
  preMeal: ['07:30', '11:30', '17:30'],
  postMeal: ['08:30', '12:30', '18:30'],
}

export const createMedicationReminders = (medications: MedicationItem[]): ReminderTask[] =>
  medications.flatMap((medication) => {
    const source = medication.customReminderTimes?.length
      ? medication.customReminderTimes
      : medication.timing === '饭前'
        ? defaultReminderPreset.preMeal
        : defaultReminderPreset.postMeal

    return source.slice(0, medication.frequencyPerDay).map((time, index) => ({
      id: `${medication.id}-${index + 1}`,
      medicationId: medication.id,
      medicationName: medication.name,
      scheduledTime: time,
      status: 'pending' as const,
      encouragement: encouragements[index % encouragements.length],
    }))
  })

export const calculateRemainingDays = (medication: MedicationItem) => {
  const remaining = Math.max(medication.totalQuantity - medication.takenQuantity, 0)
  return Math.floor(remaining / medication.frequencyPerDay)
}

export const getWarningLevel = (remainingDays: number): WarningLevel => {
  if (remainingDays <= 0) return 'red'
  if (remainingDays <= 1) return 'orange'
  if (remainingDays <= 3) return 'yellow'
  return 'none'
}

export const getDefaultDisease = (mode: ConsultationMode) =>
  mode === 'first-visit' ? '高血压' : '2型糖尿病'

export const createPlanByDisease = (diseaseType: string): MedicationItem[] => {
  if (diseaseType === '2型糖尿病') {
    return [
      {
        id: 'med-1',
        name: '二甲双胍片',
        genericName: 'Metformin',
        image: '💊',
        dose: '1片 / 0.5g',
        frequencyPerDay: 2,
        timing: '饭后',
        cycleDays: 30,
        totalQuantity: 60,
        takenQuantity: 54,
      },
      {
        id: 'med-2',
        name: '阿卡波糖片',
        genericName: 'Acarbose',
        image: '🧃',
        dose: '1片 / 50mg',
        frequencyPerDay: 3,
        timing: '饭前',
        cycleDays: 30,
        totalQuantity: 90,
        takenQuantity: 81,
      },
    ]
  }

  return [
    {
      id: 'med-1',
      name: '氨氯地平片',
      genericName: 'Amlodipine',
      image: '💊',
      dose: '1片 / 5mg',
      frequencyPerDay: 1,
      timing: '饭后',
      cycleDays: 30,
      totalQuantity: 30,
      takenQuantity: 26,
    },
    {
      id: 'med-2',
      name: '缬沙坦胶囊',
      genericName: 'Valsartan',
      image: '🩺',
      dose: '1粒 / 80mg',
      frequencyPerDay: 1,
      timing: '饭前',
      cycleDays: 30,
      totalQuantity: 30,
      takenQuantity: 29,
    },
  ]
}

export const initialState: AppState = {
  profile: {
    name: '王阿姨',
    age: 63,
    chronicDiseases: ['高血压', '2型糖尿病'],
    allergies: ['青霉素'],
    medicalHistory: ['高血压病史8年', '糖耐量异常2年'],
    familyPhone: '138****1024',
    reminderPreset: defaultReminderPreset,
    healthMetrics: {
      bloodPressure: ['126/82', '130/85', '128/80'],
      bloodSugar: ['6.8', '7.2', '6.5'],
    },
  },
  consultationDraft: {
    mode: 'first-visit',
    symptomSummary: '最近血压波动，偶尔头晕，担心药快吃完。',
    diseaseType: '高血压',
    followUpAnswer: '最近一周晨起血压约 138/88，剩余药量不到 3 天。',
    uploadedFileName: '门诊病历.jpg',
  },
  latestConsultation: null,
  plan: null,
  reminders: [],
  growth: {
    points: 72,
    streakDays: 6,
    stage: '含苞',
  },
}
