import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import TransitionScreen from './components/TransitionScreen'
import GameScreen from './components/GameScreen'
import RoundSummaryScreen from './components/RoundSummaryScreen'
import GameOverScreen from './components/GameOverScreen'
import { wordCards } from './data/words'
import './App.css'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const DEFAULT_SETTINGS = {
  timePerRound: 60,
  totalRounds: 5,
  pointsCorrect: 1,
  pointsWrong: 1,
  freeSkips: 3,
}

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [teams, setTeams] = useState([
    { name: 'Team 1', players: ['Dev', 'Gareem'], score: 0, giverIndex: 0 },
    { name: 'Team 2', players: ['Khushi', ''], score: 0, giverIndex: 0 },
  ])
  const [turnNumber, setTurnNumber] = useState(0)
  const [deck, setDeck] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [lastActions, setLastActions] = useState([])

  const totalTurns = settings.totalRounds * 2
  const currentTeamIndex = turnNumber % 2
  const currentRoundNumber = Math.floor(turnNumber / 2) + 1
  const currentTeam = teams[currentTeamIndex]
  const activePlayers = currentTeam.players.filter(p => p.trim() !== '')
  const currentGiver = activePlayers[currentTeam.giverIndex % Math.max(activePlayers.length, 1)] || 'Player'

  function startGame(newSettings, newTeams) {
    setSettings(newSettings)
    setTeams(newTeams.map(t => ({ ...t, score: 0, giverIndex: 0 })))
    setTurnNumber(0)
    setDeck(shuffle(wordCards))
    setCardIndex(0)
    setScreen('transition')
  }

  function startTurn() {
    setLastActions([])
    setScreen('playing')
  }

  function endTurn(actions, newCardIndex) {
    const scoreChange = actions.reduce((sum, a) => {
      if (a.type === 'correct') return sum + settings.pointsCorrect
      if (a.type === 'buzz') return sum - settings.pointsWrong
      if (a.type === 'skip' && !a.isFreeSkip) return sum - 1
      return sum
    }, 0)

    setTeams(prev =>
      prev.map((team, idx) =>
        idx === currentTeamIndex
          ? { ...team, score: Math.max(0, team.score + scoreChange) }
          : team
      )
    )
    setCardIndex(newCardIndex % deck.length)
    setLastActions(actions)
    setScreen('roundSummary')
  }

  function nextTurn() {
    const next = turnNumber + 1
    setTeams(prev =>
      prev.map((team, idx) =>
        idx === currentTeamIndex
          ? { ...team, giverIndex: team.giverIndex + 1 }
          : team
      )
    )
    if (next >= totalTurns) {
      setScreen('gameOver')
    } else {
      setTurnNumber(next)
      setScreen('transition')
    }
  }

  return (
    <div className="app">
      {screen === 'setup' && (
        <SetupScreen onStart={startGame} defaultSettings={DEFAULT_SETTINGS} />
      )}
      {screen === 'transition' && (
        <TransitionScreen
          teamName={currentTeam.name}
          teamIndex={currentTeamIndex}
          giverName={currentGiver}
          roundNumber={currentRoundNumber}
          totalRounds={settings.totalRounds}
          onReady={startTurn}
        />
      )}
      {screen === 'playing' && (
        <GameScreen
          deck={deck}
          startCardIndex={cardIndex}
          settings={settings}
          teamName={currentTeam.name}
          teamIndex={currentTeamIndex}
          giverName={currentGiver}
          onEndTurn={endTurn}
        />
      )}
      {screen === 'roundSummary' && (
        <RoundSummaryScreen
          actions={lastActions}
          teamName={currentTeam.name}
          teamIndex={currentTeamIndex}
          teams={teams}
          settings={settings}
          roundNumber={currentRoundNumber}
          totalRounds={settings.totalRounds}
          isLastTurn={turnNumber + 1 >= totalTurns}
          onNext={nextTurn}
        />
      )}
      {screen === 'gameOver' && (
        <GameOverScreen teams={teams} onPlayAgain={() => setScreen('setup')} />
      )}
    </div>
  )
}
