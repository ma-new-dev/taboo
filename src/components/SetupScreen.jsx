import { useState } from 'react'
import './SetupScreen.css'

const PRESETS = [30, 60, 90, 120]

export default function SetupScreen({ onStart, defaultSettings }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [playerNames, setPlayerNames] = useState(['Dev', 'Khushi', 'Gareem', ''])
  const [teamAssign, setTeamAssign] = useState([0, 1, 0, 1]) // which team each player is on
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2'])
  const [error, setError] = useState('')

  function updateSetting(key, value) {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setSettings(s => ({ ...s, [key]: num }))
    }
  }

  function handlePlayerName(i, val) {
    setPlayerNames(prev => prev.map((n, idx) => idx === i ? val : n))
  }

  function toggleTeam(i) {
    setTeamAssign(prev => prev.map((t, idx) => idx === i ? (t === 0 ? 1 : 0) : t))
  }

  function handleStart() {
    const filled = playerNames.filter(n => n.trim() !== '')
    if (filled.length < 2) {
      setError('Please enter at least 2 player names.')
      return
    }

    const team0 = playerNames.filter((n, i) => n.trim() !== '' && teamAssign[i] === 0)
    const team1 = playerNames.filter((n, i) => n.trim() !== '' && teamAssign[i] === 1)

    if (team0.length === 0 || team1.length === 0) {
      setError('Each team needs at least 1 player.')
      return
    }

    setError('')
    onStart(settings, [
      { name: teamNames[0], players: team0 },
      { name: teamNames[1], players: team1 },
    ])
  }

  const teamColors = ['#4f46e5', '#e05c2c']

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <h1>🎮 Taboo Game</h1>
        <p className="subtitle">Set up your game and get ready to play!</p>
      </div>

      <div className="setup-body">
        {/* Players */}
        <section className="setup-section">
          <h2>Players & Teams</h2>
          <div className="players-grid">
            {playerNames.map((name, i) => (
              <div className="player-row" key={i}>
                <input
                  className="player-input"
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  value={name}
                  onChange={e => handlePlayerName(i, e.target.value)}
                  maxLength={16}
                />
                <button
                  className="team-toggle"
                  style={{ background: teamColors[teamAssign[i]] }}
                  onClick={() => toggleTeam(i)}
                  title="Click to switch team"
                >
                  {teamNames[teamAssign[i]]}
                </button>
              </div>
            ))}
          </div>
          <p className="hint">Tap the team button to switch a player's team</p>
        </section>

        {/* Team Names */}
        <section className="setup-section">
          <h2>Team Names</h2>
          <div className="team-names-row">
            {teamNames.map((tn, i) => (
              <div className="team-name-wrapper" key={i}>
                <span className="team-dot" style={{ background: teamColors[i] }} />
                <input
                  className="team-name-input"
                  type="text"
                  value={tn}
                  onChange={e => setTeamNames(prev => prev.map((t, idx) => idx === i ? e.target.value : t))}
                  maxLength={16}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="setup-section">
          <h2>Game Settings</h2>

          <div className="setting-row">
            <label>⏱ Time per turn</label>
            <div className="preset-buttons">
              {PRESETS.map(p => (
                <button
                  key={p}
                  className={`preset-btn ${settings.timePerRound === p ? 'active' : ''}`}
                  onClick={() => setSettings(s => ({ ...s, timePerRound: p }))}
                >
                  {p}s
                </button>
              ))}
              <input
                className="num-input"
                type="number"
                min="10"
                max="300"
                value={settings.timePerRound}
                onChange={e => updateSetting('timePerRound', e.target.value)}
              />
            </div>
          </div>

          <div className="setting-row">
            <label>🔄 Rounds (each team plays this many times)</label>
            <div className="preset-buttons">
              {[5, 10, 15, 20].map(p => (
                <button
                  key={p}
                  className={`preset-btn ${settings.totalRounds === p ? 'active' : ''}`}
                  onClick={() => setSettings(s => ({ ...s, totalRounds: p }))}
                >
                  {p}
                </button>
              ))}
              <input
                className="num-input"
                type="number"
                min="1"
                max="20"
                value={settings.totalRounds}
                onChange={e => updateSetting('totalRounds', e.target.value)}
              />
            </div>
          </div>

          <div className="setting-row">
            <label>✅ Points per correct answer</label>
            <div className="preset-buttons">
              {[1, 2].map(p => (
                <button
                  key={p}
                  className={`preset-btn ${settings.pointsCorrect === p ? 'active' : ''}`}
                  onClick={() => setSettings(s => ({ ...s, pointsCorrect: p }))}
                >
                  +{p}
                </button>
              ))}
              <input
                className="num-input"
                type="number"
                min="0"
                max="10"
                value={settings.pointsCorrect}
                onChange={e => updateSetting('pointsCorrect', e.target.value)}
              />
            </div>
          </div>

          <div className="setting-row">
            <label>🚫 Points lost for saying a taboo word</label>
            <div className="preset-buttons">
              {[0, 1].map(p => (
                <button
                  key={p}
                  className={`preset-btn ${settings.pointsWrong === p ? 'active' : ''}`}
                  onClick={() => setSettings(s => ({ ...s, pointsWrong: p }))}
                >
                  {p === 0 ? 'None' : `-${p}`}
                </button>
              ))}
              <input
                className="num-input"
                type="number"
                min="0"
                max="10"
                value={settings.pointsWrong}
                onChange={e => updateSetting('pointsWrong', e.target.value)}
              />
            </div>
          </div>

          <div className="setting-row">
            <label>⏭ Free skips per turn (extra skips lose 1 point)</label>
            <div className="preset-buttons">
              {[0, 1, 2, 3].map(p => (
                <button
                  key={p}
                  className={`preset-btn ${settings.freeSkips === p ? 'active' : ''}`}
                  onClick={() => setSettings(s => ({ ...s, freeSkips: p }))}
                >
                  {p}
                </button>
              ))}
              <input
                className="num-input"
                type="number"
                min="0"
                max="20"
                value={settings.freeSkips}
                onChange={e => updateSetting('freeSkips', e.target.value)}
              />
            </div>
          </div>
        </section>

        {error && <p className="error-msg">{error}</p>}

        <button className="start-btn" onClick={handleStart}>
          🎉 Start Game!
        </button>
      </div>
    </div>
  )
}
