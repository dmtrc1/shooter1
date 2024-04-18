import { useState, memo } from "react";
import useInterval from "../../hooks/useInterval";
import styles from "./styles.module.css";

const StartScreen = ({ setIsGameStarted }) => {
  const COUNT_DOWN_NUM = 3;
  const [startCountdownValue, setStartCountdownValue] =
    useState(COUNT_DOWN_NUM);
  const [countDownIntervalValue, setCountDownIntervalValue] = useState(null);

  // Countdown interval
  useInterval(() => {
    if (startCountdownValue === 0) {
      return setIsGameStarted(true);
    }
    setStartCountdownValue((prev) => prev - 1);
  }, countDownIntervalValue);

  return (
    <div className={styles["start-screen"]}>
      {Boolean(countDownIntervalValue) ? (
        <div className={styles["countdown-text"]}>
          {startCountdownValue || "СТАРТ!"}
        </div>
      ) : (
        <button
          className="nes-btn is-primary"
          onClick={() => setCountDownIntervalValue(1000)}
        >
          Начать!
        </button>
      )}
      <div className={styles["animated"]} />
    </div>
  );
};

export default memo(StartScreen);
