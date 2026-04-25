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
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">购药衔接</p>
        <h2>把用药计划转化为实际药品供应</h2>
        <p>支持线上比价购药，也支持线下自购后手动标记与扫码核对。</p>
      </section>

      <section className="grid two-columns">
        <article className="panel">
          <h3>线上购买（推荐）</h3>
          <div className="card-list compact">
            {pharmacies.map((pharmacy) => (
              <div key={pharmacy.name} className="list-card">
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
            选择线上购药并激活提醒
          </button>
        </article>

        <article className="panel">
          <h3>线下购买（自主记录）</h3>
          <p>适合已经在线下拿药的用户，可后续进入扫码/拍照核对页面确认药品。</p>
          <ul className="bullet-list">
            <li>买到后手动标记【已买到】</li>
            <li>自动进入提醒看板</li>
            <li>可继续用拍照核对避免拿错药</li>
          </ul>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              completePurchase()
              navigate('/dashboard')
            }}
          >
            我将线下购买并开始记录
          </button>
        </article>
      </section>
    </div>
  )
}
