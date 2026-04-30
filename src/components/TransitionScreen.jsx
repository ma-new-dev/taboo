import './TransitionScreen.css'

const TEAM_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5, #7c3aed)',
  'linear-gradient(135deg, #e05c2c, #e11d48)',
]

export default function TransitionScreen({ teamName, teamIndex, giverName, roundNumber, totalRounds, onReady }) {
  return (
    <div className="transition-screen" style={{ background: TEAM_GRADIENTS[teamIndex] }}>
      <div className="transition-content">
        <div className="round-badge">Round {roundNumber} of {totalRounds}</div>
        <h1 className="team-name">{teamName}</h1>
        <div className="giver-block">
          <p className="giver-label">Clue Giver</p>
          <p className="giver-name">{giverName}</p>
        </div>
        <div className="instructions">
          <p>📱 Pass the device to <strong>{giverName}</strong></p>
          <p>Only <strong>{giverName}</strong> should see the screen!</p>
        </div>
        <button className="ready-btn" onClick={onReady}>
          I'm Ready — Start! 🚀
        </button>
      </div>
    </div>
  )
}
