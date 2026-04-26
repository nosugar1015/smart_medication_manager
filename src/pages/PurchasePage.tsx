import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../store/useApp'

const pharmacies = [
  { name: '叮当快药', price: '¥86', eta: '30 分钟送达' },
  { name: '社区合作药房', price: '¥82', eta: '1 小时送达' },
]

export const PurchasePage = () => {
  const navigate = useNavigate()
  const { state, completePurchase } = useApp()

  if (!state.plan?.confirmed) {
    return <Navigate to="/plan" replace />
  }

  return (
    <div className="page-stack page-stack-accent page-stack-purchase">
      <section className="hero-card purchase-hero-card">
        <div className="hero-copy">
          <span className="chip consultation-tag-chip">确认购药</span>
          <h2>完成购药后，将自动进入提醒与看板管理</h2>
          <p>请选择线上配送或线下登记，确认购药后系统会继续衔接到提醒管理，让后续按时服药更清晰。</p>
          <div className="purchase-hero-tags">
            <span className="chip consultation-tag-chip">购药后激活提醒</span>
            <span className="chip consultation-tag-chip">继续进入用药看板</span>
          </div>
        </div>
      </section>

      <section className="panel purchase-summary-panel settings-panel-highlight">
        <div className="section-header">
          <div>
            <h3>购药前确认</h3>
            <p>已确认方案将继续沿用当前建议药品，购药完成后会直接纳入提醒。</p>
          </div>
          <span className="warning-badge yellow">{state.plan.medications.length} 种药品</span>
        </div>
        <div className="detail-grid">
          <div>
            <span>当前流程</span>
            <strong>方案已确认，待购药</strong>
          </div>
          <div>
            <span>后续动作</span>
            <strong>购药后进入看板与提醒</strong>
          </div>
        </div>
      </section>

      <section className="grid two-columns purchase-grid">
        <article className="panel purchase-panel purchase-panel-online">
          <div className="section-header">
            <div>
              <h3>线上药房配送</h3>
              <p>适合希望直接送药上门的用户，确认后立即继续到看板管理。</p>
            </div>
          </div>
          <div className="card-list compact">
            {pharmacies.map((pharmacy) => (
              <div key={pharmacy.name} className="list-card purchase-list-card">
                <div>
                  <strong>{pharmacy.name}</strong>
                  <p>{pharmacy.eta}</p>
                </div>
                <span>{pharmacy.price}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              completePurchase()
              navigate('/dashboard')
            }}
          >
            选择线上配送并激活提醒
          </button>
        </article>

        <article className="panel purchase-panel purchase-panel-offline settings-panel-highlight">
          <div className="section-header">
            <div>
              <h3>线下自购登记</h3>
              <p>适合已在线下取得药品的用户，可登记后继续纳入提醒与后续核对。</p>
            </div>
          </div>
          <ul className="bullet-list">
            <li>完成购药后手动登记供应状态</li>
            <li>自动进入提醒与看板管理</li>
            <li>可继续通过拍照核对避免拿错药</li>
          </ul>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              completePurchase()
              navigate('/dashboard')
            }}
          >
            我将线下购药并纳入管理
          </button>
        </article>
      </section>
    </div>
  )
}
