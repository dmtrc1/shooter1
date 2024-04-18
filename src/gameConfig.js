export default {
  screenWidth: 600,
  screenHeight: 600,
  targetWidth: 100,
  targetHeight: 100,
  gameSpeed: window.innerWidth > 613 ? 1000 : 2000,
  ammoLimit: 10,
  enemiesNumber: 10,
  errorCoef: 0.1,
  messages: {
    hitOnTargetMessage: 'Прямо в крысу!'
  }
}
