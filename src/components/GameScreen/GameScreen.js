import { memo } from "react";
import styles from "./styles.module.css";

const GameScreen = ({
  isHitOnTargetMessageShown,
  target,
  gameConfig,
  holes,
  handleHitOnTarget,
  holeOnTarget,
}) => {
  return (
    <>
      {isHitOnTargetMessageShown && (
        <div
          className={`${styles["hit-on-target-message"]} nes-text is-success`}
        >
          {gameConfig.messages.hitOnTargetMessage}
        </div>
      )}
      {Boolean(target?.left) && (
        <div
          className={styles.target}
          style={{
            width: gameConfig.targetWidth,
            height: gameConfig.targetHeight,
            left: `${target.left}px`,
            top: `${target.top}px`,
            backgroundImage: `url(${target.backgroundImage})`,
          }}
          onClick={(e) => handleHitOnTarget(e)}
        />
      )}
      {Boolean(holeOnTarget.x) && (
        <div
          style={{ left: holeOnTarget.x, top: holeOnTarget.y }}
          className={styles["hole-on-target"]}
        />
      )}
      {holes.map(({ id, x, y }) => (
        <div key={id} style={{ left: x, top: y }} className={styles.hole} />
      ))}
    </>
  );
};

export default memo(GameScreen);
