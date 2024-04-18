import { memo } from "react";
import styles from './styles.module.css'

const ResultsScreen = ({ isWin, restartGame }) => {
  return (
    <div className={styles['results-screen']}>
      {isWin ? (
          <div className={styles['win-screen']}>
            <div>
              <h2>
                Спасибо!<br />
                Вы сделали это!
              </h2>
              <br />
              <button
                className="nes-btn is-primary"
                onClick={restartGame}
              >
                Сделать еще раз
              </button>
            </div>
            <div className={styles['img']} />
          </div>
        ) : (
          <div className={styles['lose-screen']}>
            <div>
              <h2>Не удалось :(</h2>
              <br />
              <button
                className="nes-btn is-primary"
                onClick={restartGame}
              >
                Повторный запуск
              </button>
            </div>
            <div className={styles['img']}>
              <div className={`${styles['message']} nes-balloon from-left`}>
                <p>Пока вы меня не убьете, других выборов не будет!</p>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}

export default memo(ResultsScreen)
