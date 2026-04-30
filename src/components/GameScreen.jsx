import { useState, useEffect, useRef } from 'react'
import './GameScreen.css'

const TEAM_COLORS = ['#4f46e5', '#e05c2c']

export default function GameScreen({ deck, startCardIndex, settings, teamName, teamIndex, giverName, onEndTurn }) {
  const [phase, setPhase] = useState('countdown') // 'countdown' | 'playing' | 'done'
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(settings.timePerRound)
  const [localIdx, setLocalIdx] = useState(startCardIndex)
  const [skipsUsed, setSkipsUsed] = useState(0)
  const [actions, setActions] = useState([])
  const teamColor = TEAM_COLORS[teamIndex]
  const actionsRef = useRef(actions)
  const localIdxRef = useRef(localIdx)

  useEffect(() => { actionsRef.current = actions }, [actions])
  useEffect(() => { localIdxRef.current = localIdx }, [localIdx])

  // 3-2-1 countdown
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) {
      setPhase('playing')
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // Game timer
  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) {
      setPhase('done')
      onEndTurn(actionsRef.current, localIdxRef.current + 1)
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft])

  const currentCard = deck[localIdx % deck.length]
  const freeSkipsLeft = Math.max(0, settings.freeSkips - skipsUsed)
  const correctCount = actions.filter(a => a.type === 'correct').length

  function nextCard() {
    setLocalIdx(i => i + 1)
  }

  function handleCorrect() {
    if (phase !== 'playing') return
    setActions(prev => [...prev, { type: 'correct', word: currentCard.word }])
    nextCard()
  }

  function handleSkip() {
    if (phase !== 'playing') return
    const isFreeSkip = skipsUsed < settings.freeSkips
    setActions(prev => [...prev, { type: 'skip', word: currentCard.word, isFreeSkip }])
    setSkipsUsed(s => s + 1)
    nextCard()
  }

  function handleBuzz() {
    if (phase !== 'playing') return
    setActions(prev => [...prev, { type: 'buzz', word: currentCard.word }])
    nextCard()
  }

  const pct = timeLeft / settings.timePerRound
  const timerColor = pct > 0.4 ? '#22c55e' : pct > 0.2 ? '#f59e0b' : '#ef4444'

  if (phase === 'countdown') {
    return (
      <div className="countdown-screen" style={{ background: teamColor }}>
        <p className="countdown-label">{giverName}, get ready!</p>
        <div className="countdown-number">{countdown}</div>
        <p className="countdown-sub">Don't show the screen to others!</p>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="done-screen" style={{ background: teamColor }}>
        <div className="done-icon">⏰</div>
        <h2>Time's Up!</h2>
        <p>{teamName} got {correctCount} correct</p>
      </div>
    )
  }

  return (
    <div className="game-screen">
      {/* Header */}
      <div className="game-header" style={{ background: teamColor }}>
        <div className="header-left">
          <span className="header-team">{teamName}</span>
          <span className="header-giver">{giverName} giving clues</span>
        </div>
        <div className="header-right">
          <div className="timer-display" style={{ color: timerColor }}>
            {timeLeft}
          </div>
          <div className="timer-label">sec</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="score-bar">
        <span>✅ {correctCount} correct</span>
        <span>⏭ {freeSkipsLeft > 0 ? `${freeSkipsLeft} free skips left` : 'No free skips'}</span>
      </div>

      {/* Card */}
      <div className="card-area">
        <div className="word-card">
          <div className="word-to-guess">{currentCard.word}</div>
          <div className="taboo-divider">
            <span>DO NOT SAY</span>
          </div>
          <ul className="taboo-words">
            {currentCard.taboo.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button className="btn-buzz" onClick={handleBuzz}>
          <span className="btn-icon">🚫</span>
          <span className="btn-label">BUZZ</span>
          <span className="btn-sub">Said taboo word ({settings.pointsWrong > 0 ? `-${settings.pointsWrong} pt` : 'no penalty'})</span>
        </button>
        <button className="btn-skip" onClick={handleSkip}>
          <span className="btn-icon">⏭</span>
          <span className="btn-label">SKIP</span>
          <span className="btn-sub">{freeSkipsLeft > 0 ? `${freeSkipsLeft} free` : '-1 pt'}</span>
        </button>
        <button className="btn-correct" onClick={handleCorrect}>
          <span className="btn-icon">✅</span>
          <span className="btn-label">CORRECT</span>
          <span className="btn-sub">+{settings.pointsCorrect} pt</span>
        </button>
      </div>
    </div>
  )
}
