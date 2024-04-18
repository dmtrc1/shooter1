import { useState, useEffect, useCallback } from 'react';
import gameConfig from './gameConfig';
import useMousePosition from './hooks/useMousePosition'
import useInterval from './hooks/useInterval'
import { generateTargetCoordinates, getRandomElementFromArr, evaluateResult } from './helpers/helpers'
import Stats from './components/Stats/Stats'
import StartScreen from './components/StartScreen/StartScreen'
import ResultsScreen from './components/ResultsScreen/ResultsScreen'
import GameScreen from './components/GameScreen/GameScreen'
import luka1 from './img/enemy1/luka1.png'
import luka2 from './img/enemy1/luka2.png'
import luka3 from './img/enemy1/luka3.png'
import luka4 from './img/enemy1/luka4.png'
import luka5 from './img/enemy1/luka5.png'

function App() {
  const [holes, setHoles] = useState([])
  const [holeOnTarget, setHoleOnTarget] = useState({ x: 0, y: 0 })
  const [shootingCount, setShootingCount] = useState(0)
  const [hitCount, setHitCount] = useState(0)
  const [screenElement, setScreenElement] = useState(null)
  const [gamePaceCount, setGamePaceCount] = useState(0)
  const [target, setTarget] = useState({ left: 0, top: 0, backgroundImage: '' })
  const [targetCount, setTargetCount] = useState(0)
  const [isHitOnTargetMessageShown, setHitOnTargetMessageShown] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)
  const [ammoLeft, setAmmoLeft] = useState(gameConfig.ammoLimit)
  const [isWin, setIsWin] = useState(false)

  const isGameRunning = isGameStarted && !isGameFinished
  const position = useMousePosition(screenElement)

  useInterval(() => {
    setGamePaceCount((prev) => prev + 1);
  }, isGameRunning ? gameConfig.gameSpeed : null);

  useEffect(() => {
    if (gamePaceCount%2) {
      setTargetCount(prev => prev + 1);
      return setTarget({
        left: generateTargetCoordinates(gameConfig.screenWidth, gameConfig.targetWidth),
        top: generateTargetCoordinates(gameConfig.screenHeight, gameConfig.targetHeight),
        backgroundImage: getRandomElementFromArr([luka1, luka2, luka3, luka4, luka5])
      })
    }
    setTarget({ left: 0, top: 0 })
    setHoleOnTarget({ x: 0, y: 0 })
  }, [gamePaceCount])

  // Finish game if run out of ammo of all enemies were shown;
  useEffect(() => {
    if (
      targetCount === gameConfig.enemiesNumber + 1 ||
      ammoLeft === 0
    ) {
      setIsGameFinished(true)
    }
  }, [targetCount, ammoLeft])

  // Check if run out of ammo of all enemies were shown;
  useEffect(() => {
    if (isGameFinished) {
      const result = evaluateResult({
        errorCoef: gameConfig.errorCoef,
        enemiesNumber: gameConfig.enemiesNumber,
        hitNumber: hitCount,
      });
      setIsWin(result)
    }
  }, [isGameFinished])

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setScreenElement(node)
    }
  }, []);

  function handleMiss (cursorPosition) {
    if (!isGameRunning) return;

    makeHole(cursorPosition)
    setShootingCount(prevCount => prevCount + 1)
    setAmmoLeft(prevCount => prevCount - 1)
  }

  function handleHitOnTarget(e) {
    e.stopPropagation()
    setHoleOnTarget(position)
    setHitOnTargetMessageShown(true)
    setHitCount(prevCount => prevCount + 1)
    setShootingCount(prevCount => prevCount + 1)
    setAmmoLeft(prevCount => prevCount - 1)
    setTimeout(() => {
      setHitOnTargetMessageShown(false)
    }, 1000)
  }

  function makeHole(cursorPosition) {
    setHoles((prevHoles) => ([
      ...prevHoles,
      {
        id: `${shootingCount}-${cursorPosition.x}-${cursorPosition.y}`,
        ...cursorPosition
      }
    ]))
  }

  function restartGame() {
    setGamePaceCount(0)
    setHitCount(0)
    setShootingCount(0)
    setHoles([])
    setTarget({ left: 0, right: 0 })
    setTargetCount(0)
    setIsGameFinished(false)
    setIsGameStarted(true)
    setAmmoLeft(gameConfig.ammoLimit)
  }

  return (
    <div className="App">
      <div className="game">
        <Stats {...{ ammoLeft, hitCount, enemiesNumber: gameConfig.enemiesNumber  }}/>
        <div
          ref={measuredRef}
          id="game-viewport"
          className={`game-viewport ${isGameRunning ? 'game-is-running': ''}`}
          style={{ width: gameConfig.screenWidth, height: gameConfig.screenHeight }}
          onClick={() => handleMiss(position)}
        >
          {!isGameStarted && (
            <StartScreen {...{ setIsGameStarted }} />
          )}
          {isGameFinished && (
            <ResultsScreen {...{ isWin, restartGame }} />
          )}
          {isGameRunning && (
            <GameScreen {...{
              isHitOnTargetMessageShown,
              target,
              gameConfig,
              holes,
              holeOnTarget,
              handleHitOnTarget,
            }}/>
          )}
        </div>
      </div>
      <div className='info'>
        cтрельба 1
      </div>
    </div>
  );
}

export default App;
