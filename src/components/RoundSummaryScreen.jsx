import './RoundSummaryScreen.css'

const TEAM_COLORS = ['#4f46e5', '#e05c2c']

export default function RoundSummaryScreen({ actions, teamName, teamIndex, teams, settings, roundNumber, totalRounds, isLastTurn, onNext }) {
  const correct = actions.filter(a => a.type === 'correct')
  const buzz = actions.filter(a => a.type === 'buzz')
  const skips = actions.filter(a => a.type === 'skip')
  const freeSkips = skips.filter(a => a.isFreeSkip)
  const paidSkips = skips.filter(a => !a.isFreeSkip)

  const scoreThisTurn = correct.length * settings.pointsCorrect
    - buzz.length * settings.pointsWrong
    - paidSkips.length

  return (
    <div className="summary-screen">
      <div className="summary-header" style={{ background: TEAM_COLORS[teamIndex] }}>
        <div className="summary-round">Round {roundNumber} of {totalRounds}</div>
        <h2>{teamName}'s Turn — Done!</h2>
        <div className="score-change">
          {scoreThisTurn >= 0 ? '+' : ''}{scoreThisTurn} points this turn
        </div>
      </div>

      <div className="summary-body">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-box green">
            <span className="stat-num">{correct.length}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-box red">
            <span className="stat-num">{buzz.length}</span>
            <span className="stat-label">Buzz</span>
          </div>
          <div className="stat-box yellow">
            <span className="stat-num">{skips.length}</span>
            <span className="stat-label">Skips</span>
          </div>
        </div>

        {/* Word breakdown */}
        {actions.length > 0 && (
          <div className="word-log">
            <h3>Words This Turn</h3>
            <ul>
              {actions.map((a, i) => (
                <li key={i} className={`log-item log-${a.type}`}>
                  <span className="log-icon">
                    {a.type === 'correct' ? '✅' : a.type === 'buzz' ? '🚫' : '⏭'}
                  </span>
                  <span className="log-word">{a.word}</span>
                  {a.type === 'skip' && !a.isFreeSkip && <span className="log-penalty">-1pt</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scoreboard */}
        <div className="scoreboard">
          <h3>Scoreboard</h3>
          {teams.map((team, i) => (
            <div key={i} className="score-row" style={{ borderLeft: `4px solid ${TEAM_COLORS[i]}` }}>
              <span className="score-team">{team.name}</span>
              <span className="score-pts" style={{ color: TEAM_COLORS[i] }}>{team.score} pts</span>
            </div>
          ))}
        </div>

        <button className="next-btn" onClick={onNext}>
          {isLastTurn ? '🏆 See Final Results' : '➡️ Next Team\'s Turn'}
        </button>
      </div>
    </div>
  )
}
