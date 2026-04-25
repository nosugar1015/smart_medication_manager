import { useNavigate } from 'react-router-dom'
import { getDefaultDisease } from '../data/mockData'
import { useApp } from '../store/useApp'
import type { ConsultationMode } from '../types'

const diseaseOptions = ['高血压', '2型糖尿病']

export const ConsultationPage = () => {
  const navigate = useNavigate()
  const { state, updateDraft, generatePlan } = useApp()
  const draft = state.consultationDraft

  const handleModeChange = (mode: ConsultationMode) => {
    updateDraft({ mode, diseaseType: getDefaultDisease(mode) })
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">AI 智能问诊</p>
        <h2>先收集病情，再生成标准化用药计划</h2>
        <div className="segmented">
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
      </section>

      <section className="panel form-panel">
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
          症状 / 需求描述
          <textarea
            rows={4}
            value={draft.symptomSummary}
            onChange={(event) => updateDraft({ symptomSummary: event.target.value })}
          />
        </label>

        <label>
          AI 追问后的补充信息
          <textarea
            rows={4}
            value={draft.followUpAnswer}
            onChange={(event) => updateDraft({ followUpAnswer: event.target.value })}
          />
        </label>

        <label>
          上传资料文件名（演示）
          <input
            value={draft.uploadedFileName}
            onChange={(event) => updateDraft({ uploadedFileName: event.target.value })}
          />
        </label>

        <div className="chat-preview">
          <div>
            <span className="chat-role">AI 判断</span>
            <p>您是需要咨询关于「{draft.diseaseType}」的用药吗？</p>
          </div>
          <div>
            <span className="chat-role">AI 追问</span>
            <p>请补充最近指标、药物剩余量，以及是否有新的不适。</p>
          </div>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            generatePlan()
            navigate('/plan')
          }}
        >
          生成用药计划单
        </button>
      </section>
    </div>
  )
}
