const SECONDS_MIDDLE_FLAP = document.getElementById('seconds-middle-flap');
const SECONDS_ENCLOSURE = document.getElementById('enclosure-seconds');
const MINUTES_ENCLOSURE = document.getElementById('enclosure-minutes');
const HOURS_ENCLOSURE = document.getElementById('enclosure-hours');
const DAYS_ENCLOSURE = document.getElementById('enclosure-days');
const ALERT = document.getElementById('alert');
const GAOL_TIME = new Date('Nov 01, 2023 00:00:00').getTime();
const FLAP_SOUND_FAST = document.getElementById('flap-sound-fast');
const FLAP_SOUND = document.getElementById('flap-sound');
const ANIMATION_DURATION = Number(getComputedStyle(document.documentElement).getPropertyValue('--_animation-duration').slice(0, -1));
//

let play = true;
let goalTimeReached = false;
let startAnimationRunning = true;
SECONDS_MIDDLE_FLAP.classList.add('animate');
FLAP_SOUND_FAST.play();
SECONDS_MIDDLE_FLAP.addEventListener('animationiteration', () => {
  // run start animation for two seconds
  setTimeout(() => {
    document.querySelectorAll('.middle-flap').forEach((flap) => {
      flap.style = "--_animation-duration: 1s;'";
    });
    startAnimationRunning = false;
    FLAP_SOUND_FAST.pause();
  }, 2000);

  let now = new Date().getTime();
  let d = GAOL_TIME - now;
  let seconds = Math.floor((d % (1000 * 60)) / 1000);
  let minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
  let hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let days = Math.floor(d / (1000 * 60 * 60 * 24));

  if (!startAnimationRunning) {
    updateFlap(seconds, SECONDS_ENCLOSURE, '59');
    updateFlap(minutes, MINUTES_ENCLOSURE, '59');
    updateFlap(hours, HOURS_ENCLOSURE, '23');
    updateFlap(days, DAYS_ENCLOSURE, '99');
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      SECONDS_MIDDLE_FLAP.classList.remove('animate');
      goalTimeReached = true;
    }
    if (!goalTimeReached) {
      if (seconds === 0) {
        flipTheFlap(MINUTES_ENCLOSURE, startAnimationRunning);
        // insert text each minutes to let screen readers know
        ALERT.innerHTML = `Time Left To Launch: ${days} days, ${hours} hours, and ${minutes} minutes`;
      }

      if (minutes === 0 && seconds === 0) {
        flipTheFlap(HOURS_ENCLOSURE, startAnimationRunning);
      }
      if (hours === 0 && minutes === 0 && seconds === 0) {
        flipTheFlap(DAYS_ENCLOSURE, startAnimationRunning);
      }
      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        ALERT.innerHTML = "Time's up";
        SECONDS_MIDDLE_FLAP.classList.remove('animate');
      }
    }
  } else {
    runStartAnimation();
  }
  FLAP_SOUND.play();
});

function updateFlap(i, enclosure, limit) {
  let frontSideNum = ('0' + i).slice(-2);
  let backSideNum = ('0' + (i - 1)).slice(-2);
  let topSideNum = ('0' + (i - 1)).slice(-2);
  let bottomSideNum = ('0' + i).slice(-2);
  // fixed -1 output when clock segments reaches 00;
  if (i - 1 === -1) {
    backSideNum = limit;
    topSideNum = limit;
  }
  enclosure.style = `
            --_front-side-num:'${frontSideNum}';
            --_back-side-num:'${backSideNum}';
            --_top-side-num:'${topSideNum}';
            --_bottom-side-num:'${bottomSideNum}';
            `;
}

function flipTheFlap(enclosure, startAnimationRunning) {
  let flap = document.getElementById(enclosure.getAttribute('data-middle-flap-id'));
  flap.classList.add('animate');
  if (startAnimationRunning) {
    flap.addEventListener('animationiteration', () => {
      flap.classList.remove('animate');
    });
  }
}

function runStartAnimation() {
  let randomSecondsNum = Math.floor(Math.random() * 60);
  let randomMinutesNum = Math.floor(Math.random() * 60);
  let randomHoursNum = Math.floor(Math.random() * 24);
  let randomDaysNum = Math.floor(Math.random() * 100);
  updateFlap(randomSecondsNum, SECONDS_ENCLOSURE, '59');
  updateFlap(randomMinutesNum, MINUTES_ENCLOSURE, '59');
  flipTheFlap(MINUTES_ENCLOSURE, startAnimationRunning);
  updateFlap(randomHoursNum, HOURS_ENCLOSURE, '23');
  flipTheFlap(HOURS_ENCLOSURE, startAnimationRunning);
  updateFlap(randomDaysNum, DAYS_ENCLOSURE, '99');
  flipTheFlap(DAYS_ENCLOSURE, startAnimationRunning);
}
