import './GameOverScreen.css'

const TEAM_COLORS = ['#4f46e5', '#e05c2c']
const MEDALS = ['🥇', '🥈']

export default function GameOverScreen({ teams, onPlayAgain }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)
  const isTie = sorted[0].score === sorted[1].score
  const winner = sorted[0]

  return (
    <div className="gameover-screen">
      <div className="fireworks-bg" />

      <div className="gameover-content">
        <div className="winner-banner">
          {isTie ? (
            <>
              <div className="winner-emoji">🤝</div>
              <h1>It's a Tie!</h1>
              <p>Amazing game — both teams scored {sorted[0].score} points!</p>
            </>
          ) : (
            <>
              <div className="winner-emoji">🏆</div>
              <h1>{winner.name} Wins!</h1>
              <p>Incredible performance with {winner.score} points!</p>
            </>
          )}
        </div>

        <div className="final-scores">
          <h2>Final Scores</h2>
          {sorted.map((team, i) => {
            const originalIdx = teams.findIndex(t => t.name === team.name)
            return (
              <div
                key={team.name}
                className={`final-score-row ${i === 0 && !isTie ? 'winner' : ''}`}
                style={{ borderLeft: `6px solid ${TEAM_COLORS[originalIdx]}` }}
              >
                <span className="medal">{MEDALS[i]}</span>
                <span className="final-team">{team.name}</span>
                <span className="final-pts" style={{ color: TEAM_COLORS[originalIdx] }}>
                  {team.score} pts
                </span>
              </div>
            )
          })}
        </div>

        <div className="players-list">
          {teams.map((team, i) => (
            <div key={i} className="team-players">
              <span className="team-label" style={{ color: TEAM_COLORS[i] }}>{team.name}:</span>
              <span className="players-names">{team.players.filter(p => p.trim()).join(' & ')}</span>
            </div>
          ))}
        </div>

        <button className="play-again-btn" onClick={onPlayAgain}>
          🎮 Play Again
        </button>
      </div>
    </div>
  )
}
