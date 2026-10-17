import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputEl = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalId = null;

startBtnEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate <= Date.now()) {
      userSelectedDate = null;
      startBtnEl.disabled = true;
      showError();
      return;
    }

    userSelectedDate = selectedDate;
    startBtnEl.disabled = false;
  },
};

flatpickr(inputEl, options);

startBtnEl.addEventListener('click', onStartClick);

function onStartClick() {
  if (!userSelectedDate || userSelectedDate <= Date.now()) {
    userSelectedDate = null;
    startBtnEl.disabled = true;
    showError();
    return;
  }

  startBtnEl.disabled = true;
  inputEl.disabled = true;

  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const msLeft = userSelectedDate - Date.now();

  if (msLeft <= 0) {
    clearInterval(intervalId);
    renderTime(convertMs(0));
    userSelectedDate = null;
    inputEl.disabled = false;
    return;
  }

  renderTime(convertMs(msLeft));
}

function renderTime({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function showError() {
  iziToast.error({
    message: 'Please choose a date in the future',
    position: 'topRight',
  });
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
