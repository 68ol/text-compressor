import { useState, useRef } from 'react'
import Head from 'next/head'
import '../styles/globals.css'

// ─── 공통 스타일 ───────────────────────────────────────────────
const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg3)' },
  header: { display: 'flex', alignItems: 'center', gap: 24, padding: '0 1.5rem', background: 'var(--bg)', borderBottom: '0.5px solid var(--border)', height: 48, flexShrink: 0 },
  logo: { fontSize: 14, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em' },
  nav: { display: 'flex', gap: 0, height: '100%' },
  tab: { fontSize: 13, fontWeight: 500, padding: '0 16px', border: 'none', background: 'transparent', color: 'var(--text2)', cursor: 'pointer', borderBottom: '2px solid transparent', height: '100%' },
  tabActive: { color: 'var(--text)', borderBottom: '2px solid var(--text)' },
  body: { display: 'flex', flex: 1, gap: 0, maxWidth: 1100, width: '100%', margin: '24px auto', background: 'var(--bg)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', overflow: 'hidden' },
  panelLeft: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem 1.5rem', gap: 10, borderRight: '0.5px solid var(--border)' },
  panelRight: { flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem 1.5rem', gap: 10 },
  panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 11, fontWeight: 500, color: 'var(--text2)', letterSpacing: '0.06em', textTransform: 'uppercase' },
  count: { fontSize: 12, color: 'var(--text3)' },
  countWarn: { color: '#BA7517' },
  countDanger: { color: '#A32D2D' },
  textarea: { flex: 1, minHeight: 280, resize: 'none', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 12, fontSize: 14, lineHeight: 1.7, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)', outline: 'none' },
  outputBox: { flex: 1, minHeight: 280, border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--text)', background: 'var(--bg2)', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' },
  placeholder: { color: 'var(--text3)', fontSize: 13 },
  codeBlock: { background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text)', position: 'relative' },
  btnRow: { display: 'flex', gap: 8 },
  btnPrimary: { background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--radius)', padding: '9px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  btnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  btnGhost: { background: 'transparent', color: 'var(--text2)', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', padding: '8px 14px', fontSize: 13, cursor: 'pointer' },
  btnMini: { fontSize: 11, padding: '3px 10px', background: 'var(--bg)', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--text2)' },
  statRow: { display: 'flex', gap: 8 },
  statCard: { flex: 1, background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 },
  statLabel: { fontSize: 11, color: 'var(--text3)' },
  statVal: { fontSize: 18, fontWeight: 500 },
  diagSection: { border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  diagHeader: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--bg2)', borderBottom: '0.5px solid var(--border)' },
  diagDot: { width: 8, height: 8, borderRadius: '50%' },
  diagTitle: { fontSize: 12, fontWeight: 500, color: 'var(--text2)' },
  diagBody: { padding: '10px 12px' },
  diagItem: { fontSize: 13, lineHeight: 1.6, padding: '4px 0', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' },
  tag: { display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '1px 7px', borderRadius: 100, marginRight: 6 },
}

// ─── 유틸 ──────────────────────────────────────────────────────
function StatCard({ label, value, status }) {
  const color = status === 'good' ? 'var(--green)' : status === 'warn' ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={S.statCard}>
      <span style={S.statLabel}>{label}</span>
      <span style={{ ...S.statVal, color }}>{value}</span>
    </div>
  )
}

function DiagItem({ status, item, note }) {
  const tagStyle = { pass: { background: 'var(--green-bg)', color: 'var(--green)' }, warn: { background: 'var(--amber-bg)', color: 'var(--amber)' }, fail: { background: 'var(--red-bg)', color: 'var(--red)' } }[status] || {}
  const tagLabel = status === 'pass' ? 'PASS' : status === 'warn' ? 'WARN' : 'MISS'
  return (
    <div style={S.diagItem}>
      <span style={{ ...S.tag, ...tagStyle }}>{tagLabel}</span>
      {item && <strong style={{ fontWeight: 500 }}>{item}</strong>}
      {note && <span style={{ color: 'var(--text2)' }}>{item ? ' — ' : ''}{note}</span>}
    </div>
  )
}

function CopyButton({ getText, style = {} }) {
  const [label, setLabel] = useState('복사')
  function handleClick() {
    const t = getText()
    if (!t) return
    navigator.clipboard.writeText(t).then(() => {
      setLabel('완료!')
      setTimeout(() => setLabel('복사'), 1400)
    })
  }
  return <button style={{ ...S.btnMini, ...style }} onClick={handleClick}>{label}</button>
}

// ─── 탭1: 텍스트 축약 ──────────────────────────────────────────
function CompressTab() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  const charLen = input.length
  const charClass = charLen > 9000 ? 'danger' : charLen > 7000 ? 'warn' : ''

  async function handleCompress() {
    if (!input.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/compress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input.trim() }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '서버 오류')
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleClear() { setInput(''); setResult(null); setError(''); textareaRef.current?.focus() }

  const origLen = input.replace(/\s/g, '').length
  const compLen = result?.compressed?.length || 0
  const ratio = origLen > 0 ? Math.round((1 - compLen / origLen) * 100) : 0
  const funcScore = result?.functionality_score || 0
  const missCount = (result?.diagnostics || []).filter(d => d.status === 'fail').length
  const overallStatus = result ? ((result.diagnostics || []).some(d => d.status === 'fail') ? 'fail' : (result.diagnostics || []).some(d => d.status === 'warn') ? 'warn' : 'pass') : null

  return (
    <div style={S.body}>
      <div style={S.panelLeft}>
        <div style={S.panelHeader}>
          <span style={S.label}>원문</span>
          <span style={{ ...S.count, ...(charClass === 'danger' ? S.countDanger : charClass === 'warn' ? S.countWarn : {}) }}>
            {charLen.toLocaleString()} / 10,000자
          </span>
        </div>
        <textarea ref={textareaRef} style={S.textarea} value={input} onChange={e => setInput(e.target.value)} maxLength={10000} placeholder="축약할 텍스트를 입력하세요." />
        <div style={S.btnRow}>
          <button style={{ ...S.btnPrimary, ...(loading || !input.trim() ? S.btnDisabled : {}) }} onClick={handleCompress} disabled={loading || !input.trim()}>
            {loading ? '축약 중...' : '축약 실행'}
          </button>
          <button style={S.btnGhost} onClick={handleClear}>초기화</button>
        </div>
      </div>

      <div style={S.panelRight}>
        <div style={S.panelHeader}>
          <span style={S.label}>축약 결과</span>
          {result && <span style={S.count}>{compLen.toLocaleString()}자</span>}
        </div>

        <div style={S.outputBox}>
          {!result && !error && !loading && <span style={S.placeholder}>축약 결과가 여기에 표시됩니다.</span>}
          {loading && <span style={S.placeholder}>AI가 분석 중...</span>}
          {error && <span style={{ color: 'var(--red)', fontSize: 13 }}>오류: {error}</span>}
          {result && (
            <>
              <div style={{ ...S.codeBlock, marginBottom: 0 }}>
                <span style={{ display: 'block', paddingRight: 48 }}>{result.compressed}</span>
                <CopyButton getText={() => result.compressed} style={{ position: 'absolute', top: 8, right: 8 }} />
              </div>
            </>
          )}
        </div>

        {result && (
          <div style={S.statRow}>
            <StatCard label="압축률" value={ratio + '%'} status={ratio >= 20 ? 'good' : ratio >= 10 ? 'warn' : 'bad'} />
            <StatCard label="기능성 유지" value={funcScore + '%'} status={funcScore >= 95 ? 'good' : funcScore >= 85 ? 'warn' : 'bad'} />
            <StatCard label="누락 항목" value={missCount + '건'} status={missCount === 0 ? 'good' : missCount <= 2 ? 'warn' : 'bad'} />
          </div>
        )}

        {result && (
          <div style={S.diagSection}>
            <div style={S.diagHeader}>
              <div style={{ ...S.diagDot, background: overallStatus === 'pass' ? '#1D9E75' : overallStatus === 'warn' ? '#EF9F27' : '#E24B4A' }} />
              <span style={S.diagTitle}>{overallStatus === 'pass' ? '자가검진 통과' : overallStatus === 'warn' ? '자가검진 — 주의 항목 있음' : '자가검진 — 누락 감지'}</span>
            </div>
            <div style={S.diagBody}>
              {(!result.diagnostics || result.diagnostics.length === 0)
                ? <DiagItem status="pass" item="" note="누락 또는 손실된 정보 없음" />
                : result.diagnostics.map((d, i) => <DiagItem key={i} status={d.status} item={d.item} note={d.note} />)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 탭2: 50자 분할 ────────────────────────────────────────────
function SplitTab() {
  const [input, setInput] = useState('')
  const [chunkSize, setChunkSize] = useState(50)

  const chunks = input.trim()
    ? (() => {
        const result = []
        let i = 0
        while (i < input.length) { result.push(input.slice(i, i + chunkSize)); i += chunkSize }
        return result
      })()
    : []

  return (
    <div style={S.body}>
      <div style={S.panelLeft}>
        <div style={S.panelHeader}>
          <span style={S.label}>입력 텍스트</span>
          <span style={S.count}>{input.length.toLocaleString()}자</span>
        </div>
        <textarea style={S.textarea} value={input} onChange={e => setInput(e.target.value)} placeholder="분할할 텍스트를 입력하세요." />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>분할 단위</span>
          <input
            type="number"
            min={1} max={500}
            value={chunkSize}
            onChange={e => setChunkSize(Math.max(1, parseInt(e.target.value) || 50))}
            style={{ width: 64, padding: '6px 8px', fontSize: 13, border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
          />
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>자</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)' }}>
            {chunks.length > 0 ? `총 ${chunks.length}개 블록` : ''}
          </span>
        </div>
      </div>

      <div style={{ ...S.panelRight, overflowY: 'auto' }}>
        <div style={S.panelHeader}>
          <span style={S.label}>분할 결과</span>
          {chunks.length > 0 && (
            <CopyButton getText={() => chunks.join('\n\n')} />
          )}
        </div>

        {chunks.length === 0 && (
          <div style={{ ...S.outputBox, alignItems: 'flex-start' }}>
            <span style={S.placeholder}>분할 결과가 여기에 표시됩니다.</span>
          </div>
        )}

        {chunks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {chunks.map((chunk, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ ...S.codeBlock, paddingRight: 56 }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 2 }}>
                    {i + 1} / {chunks.length} · {chunk.length}자
                  </span>
                  {chunk}
                </div>
                <CopyButton getText={() => chunk} style={{ position: 'absolute', top: 8, right: 8 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 메인 ──────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState('compress')

  return (
    <>
      <Head>
        <title>텍스트 도구</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={S.page}>
        <div style={S.header}>
          <span style={S.logo}>텍스트 도구</span>
          <nav style={S.nav}>
            <button style={{ ...S.tab, ...(activeTab === 'compress' ? S.tabActive : {}) }} onClick={() => setActiveTab('compress')}>
              텍스트 축약
            </button>
            <button style={{ ...S.tab, ...(activeTab === 'split' ? S.tabActive : {}) }} onClick={() => setActiveTab('split')}>
              글자 분할
            </button>
          </nav>
        </div>
        {activeTab === 'compress' ? <CompressTab /> : <SplitTab />}
      </div>
    </>
  )
}
