export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text } = req.body
  if (!text || typeof text !== 'string') return res.status(400).json({ error: '텍스트 없음' })

  const SYSTEM = `당신은 텍스트 축약 전문가입니다. 아래 규칙을 엄수하고 반드시 순수 JSON만 출력하세요. 마크다운 코드블록 금지.

=== 축약 규칙 ===
1. 띄어쓰기 완전 삭제 (줄바꿈은 반드시 유지)
2. 불필요한 조사·접속어 삭제: 을/를/이/가/은/는/의/에서/에게/으로/로/와/과/하고/그리고/또한/또는/하지만/그러나/따라서/때문에/위해서 등
3. 기호/이모지 적극 활용: 그리고→&, 때문에/인해→∵, 따라서/결과→∴, 대비/비교→vs, 포함→+, 제외→-, 변환/전환→→, 약→≈, 이상→≥, 이하→≤
4. 한자어 치환 (글자수 줄어드는 경우만): 중요→中, 필요→必, 사용→使, 가능→可, 불가능→不可, 현재→現, 이전→前, 이후→後, 완료→完, 시작→始, 전체→全, 주의→注, 예시→例
5. 음슴체: 했습니다→했음, 입니다→임, 합니다→함, 있습니다→있음, 됩니다→됨
6. 중복 표현·군더더기 삭제
7. 인사말·감탄사·ㅎㅎ·ㅋㅋ 등 기능 없는 구어체 제거
8. 절대규칙: 정보 무단 삭제 금지, 디테일 소거 금지, 기능성 98% 이상 유지 필수

=== 출력 형식 (JSON만, 다른 텍스트 절대 금지) ===
{"compressed":"축약결과(줄바꿈은\\n으로표현)","functionality_score":98,"diagnostics":[{"status":"pass","item":"항목","note":"설명"}],"missing_count":0}

status: pass=문제없음 / warn=맥락약화 / fail=정보누락`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: SYSTEM,
        messages: [{ role: 'user', content: text }]
      })
    })

    const data = await response.json()
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'API 오류' })

    const raw = data.content?.map(b => b.text || '').join('').trim() || ''
    const jsonStart = raw.indexOf('{')
    const jsonEnd = raw.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) return res.status(500).json({ error: 'JSON 파싱 실패: ' + raw.slice(0, 200) })

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
    return res.status(200).json(parsed)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
