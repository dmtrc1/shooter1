import { memo } from "react";
import styles from "./styles.module.css";

const Stats = ({ ammoLeft, hitCount, enemiesNumber }) => {
  return (
    <div className={styles["game-stats"]}>
      <div className="item">
        <span>Убито:</span>
        <span>
          {hitCount}/{enemiesNumber}
        </span>
      </div>
      <div className="item">
        <span>Патроны:</span>
        <span>{ammoLeft}</span>
      </div>
    </div>
  );
};

export default memo(Stats);
