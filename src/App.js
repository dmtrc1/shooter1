import React, { useState, useEffect, useCallback } from "react";
import gameConfig from "./gameConfig";
import useMousePosition from "./hooks/useMousePosition";
import useInterval from "./hooks/useInterval";
import {
  generateTargetCoordinates,
  getRandomElementFromArr,
  evaluateResult,
} from "./helpers/helpers";
import Stats from "./components/Stats/Stats";
import StartScreen from "./components/StartScreen/StartScreen";
import ResultsScreen from "./components/ResultsScreen/ResultsScreen";
import GameScreen from "./components/GameScreen/GameScreen";
import luka1 from "./img/enemy1/luka1.png";
import luka2 from "./img/enemy1/luka2.png";
import luka3 from "./img/enemy1/luka3.png";
import luka4 from "./img/enemy1/luka4.png";
import luka5 from "./img/enemy1/luka5.png";

function App() {
  const [state, setState] = useState({
    holes: [],
    holeOnTarget: { x: 0, y: 0 },
    shootingCount: 0,
    hitCount: 0,
    screenElement: null,
    gamePaceCount: 0,
    target: { left: 0, top: 0, backgroundImage: "" },
    targetCount: 0,
    isHitOnTargetMessageShown: false,
    isGameStarted: false,
    isGameFinished: false,
    ammoLeft: gameConfig.ammoLimit,
    isWin: false,
  });

  const {
    screenElement,
    gamePaceCount,
    isGameStarted,
    isGameFinished,
    targetCount,
    ammoLeft,
  } = state;
  const position = useMousePosition(screenElement);

  useInterval(
    () => {
      setState((prev) => ({ ...prev, gamePaceCount: prev.gamePaceCount + 1 }));
    },
    isGameStarted && !isGameFinished ? gameConfig.gameSpeed : null
  );

  useEffect(() => {
    if (gamePaceCount % 2) {
      const newTarget = {
        left: generateTargetCoordinates(
          gameConfig.screenWidth,
          gameConfig.targetWidth
        ),
        top: generateTargetCoordinates(
          gameConfig.screenHeight,
          gameConfig.targetHeight
        ),
        backgroundImage: getRandomElementFromArr([
          luka1,
          luka2,
          luka3,
          luka4,
          luka5,
        ]),
      };
      setState((prev) => ({
        ...prev,
        targetCount: prev.targetCount + 1,
        target: newTarget,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        target: { left: 0, top: 0 },
        holeOnTarget: { x: 0, y: 0 },
      }));
    }
  }, [gamePaceCount]);

  useEffect(() => {
    if (targetCount === gameConfig.enemiesNumber + 1 || ammoLeft === 0) {
      setState((prev) => ({ ...prev, isGameFinished: true }));
    }
  }, [targetCount, ammoLeft]);

  useEffect(() => {
    if (isGameFinished) {
      const result = evaluateResult({
        errorCoef: gameConfig.errorCoef,
        enemiesNumber: gameConfig.enemiesNumber,
        hitNumber: state.hitCount,
      });
      setState((prev) => ({ ...prev, isWin: result }));
    }
  }, [isGameFinished]);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setState((prev) => ({ ...prev, screenElement: node }));
    }
  }, []);

  const handleMiss = useCallback(
    (cursorPosition) => {
      if (!isGameStarted || isGameFinished) return;
      makeHole(cursorPosition);
      setState((prev) => ({
        ...prev,
        shootingCount: prev.shootingCount + 1,
        ammoLeft: prev.ammoLeft - 1,
      }));
    },
    [isGameStarted, isGameFinished]
  );

  const handleHitOnTarget = useCallback(
    (e) => {
      e.stopPropagation();
      setTimeout(() => {
        setState((prev) => ({ ...prev, isHitOnTargetMessageShown: false }));
      }, 1000);
      setState((prev) => ({
        ...prev,
        holeOnTarget: position,
        isHitOnTargetMessageShown: true,
        hitCount: prev.hitCount + 1,
        shootingCount: prev.shootingCount + 1,
        ammoLeft: prev.ammoLeft - 1,
      }));
    },
    [position]
  );

  const makeHole = (cursorPosition) => {
    setState((prev) => ({
      ...prev,
      holes: [
        ...prev.holes,
        {
          id: `${prev.shootingCount}-${cursorPosition.x}-${cursorPosition.y}`,
          ...cursorPosition,
        },
      ],
    }));
  };

  const restartGame = () => {
    setState({
      ...state,
      gamePaceCount: 0,
      hitCount: 0,
      shootingCount: 0,
      holes: [],
      target: { left: 0, top: 0 },
      targetCount: 0,
      isGameFinished: false,
      isGameStarted: true,
      ammoLeft: gameConfig.ammoLimit,
    });
  };

  return (
    <div className="App">
      <div className="game">
        <Stats
          {...{
            ammoLeft,
            hitCount: state.hitCount,
            enemiesNumber: gameConfig.enemiesNumber,
          }}
        />
        <div
          ref={measuredRef}
          id="game-viewport"
          className={`game-viewport ${
            isGameStarted && !isGameFinished ? "game-is-running" : ""
          }`}
          style={{
            width: gameConfig.screenWidth,
            height: gameConfig.screenHeight,
          }}
          onClick={() => handleMiss(position)}
        >
          {!isGameStarted && (
            <StartScreen
              setIsGameStarted={(value) =>
                setState((prev) => ({ ...prev, isGameStarted: value }))
              }
            />
          )}
          {isGameFinished && (
            <ResultsScreen isWin={state.isWin} restartGame={restartGame} />
          )}
          {isGameStarted && !isGameFinished && (
            <GameScreen
              {...state}
              gameConfig={gameConfig}
              handleHitOnTarget={handleHitOnTarget}
            />
          )}
        </div>
      </div>
      <div className="info">cтрельба 1</div>
    </div>
  );
}

export default App;
