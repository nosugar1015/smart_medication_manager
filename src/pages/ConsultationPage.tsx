import { useNavigate } from 'react-router-dom'
import { getDefaultDisease } from '../data/mockData'
import { useApp } from '../store/useApp'
import type { ConsultationMode } from '../types'

const diseaseOptions = ['高血压', '2型糖尿病']

const symptomTagsByMode = {
  'first-visit': ['最近血压偏高', '血糖波动大', '头晕头痛', '想确认是否要开始用药'],
  refill: ['药快吃完了', '想续方原来的药', '最近指标不稳定', '服药后有点不舒服'],
}

export const ConsultationPage = () => {
  const navigate = useNavigate()
  const { state, updateDraft, generatePlan } = useApp()
  const draft = state.consultationDraft

  const handleModeChange = (mode: ConsultationMode) => {
    updateDraft({ mode, diseaseType: getDefaultDisease(mode) })
  }

  const appendSymptomTag = (tag: string) => {
    const nextSummary = draft.symptomSummary.trim() ? `${draft.symptomSummary.trim()}；${tag}` : tag
    updateDraft({ symptomSummary: nextSummary })
  }

  const symptomTags = symptomTagsByMode[draft.mode]

  return (
    <div className="page-stack page-stack-accent page-stack-consultation">
      <section className="panel consultation-entry-panel">
        <div className="section-header">
          <div>
            <h3>先说这次想问什么</h3>
            <p>像搜索一样先描述问题，再补充病情信息，系统会继续整理问诊建议。</p>
          </div>
        </div>
        <div className="segmented consultation-mode-switch">
          {[
            { value: 'first-visit', label: '首次咨询' },
            { value: 'refill', label: '复诊购药' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={draft.mode === item.value ? 'segment active' : 'segment'}
              onClick={() => handleModeChange(item.value as ConsultationMode)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="consultation-search-box">
          <label>
            主要症状 / 就诊需求
            <textarea
              rows={4}
              placeholder="例如：最近血压总是偏高，药快吃完了，想问是否需要调整用药。"
              value={draft.symptomSummary}
              onChange={(event) => updateDraft({ symptomSummary: event.target.value })}
            />
          </label>
        </div>

        <div className="consultation-tag-block">
          <span className="consultation-tag-title">快捷标签</span>
          <div className="chip-row consultation-tag-row">
            {symptomTags.map((tag) => (
              <button key={tag} type="button" className="chip consultation-tag-chip" onClick={() => appendSymptomTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel form-panel">
        <div className="section-header">
          <div>
            <h3>补充病情信息</h3>
            <p>继续完善慢病类型、近期情况和已有资料，便于后续生成用药建议。</p>
          </div>
        </div>
        <label>
          慢病类型
          <select
            value={draft.diseaseType}
            onChange={(event) => updateDraft({ diseaseType: event.target.value })}
          >
            {diseaseOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          补充病情信息
          <textarea
            rows={4}
            value={draft.followUpAnswer}
            onChange={(event) => updateDraft({ followUpAnswer: event.target.value })}
          />
        </label>
      </section>

      <section className="panel form-panel consultation-support-panel">
        <div className="section-header">
          <div>
            <h3>补充资料与系统识别</h3>
            <p>可录入病历、检验单或处方资料名称，便于后续核对。</p>
          </div>
        </div>
        <label>
          已补充资料名称
          <input
            value={draft.uploadedFileName}
            onChange={(event) => updateDraft({ uploadedFileName: event.target.value })}
          />
        </label>

        <div className="chat-preview">
          <div>
            <span className="chat-role">系统识别</span>
            <p>已识别本次问诊主题为「{draft.diseaseType}」相关用药咨询。</p>
          </div>
          <div>
            <span className="chat-role">补充采集</span>
            <p>建议继续核对近期指标、药品剩余量，以及近期是否出现新的不适或不良反应。</p>
          </div>
        </div>

        <button
          type="button"
          className="primary-button consultation-primary-button"
          onClick={() => {
            generatePlan()
            navigate('/plan')
          }}
        >
          开始问诊并生成用药建议
        </button>
      </section>
    </div>
  )
}
