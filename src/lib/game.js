// todo vísa í rétta hluti með import
// allar breytur hér eru aðeins sýnilegar innan þessa módúl\

import Question from './question';
import * as helper from './helpers';
import Highscore, { score } from './highscore';
import * as storage from './storage';

let startButton; // takki sem byrjar leik
let problem; // element sem heldur utan um verkefni, sjá index.html
let result; // element sem heldur utan um niðurstöðu, sjá index.html
let probleTimer;

let playTime; // hversu lengi á að spila? Sent inn gegnum init()
let total = 0; // fjöldi spurninga í núverandi leik
let correct = 0; // fjöldi réttra svara í núverandi leik
let points = 0;
let currentProblem; // spurning sem er verið að sýna
let problemInput; // svar frá notanda við núverandi spurningu
let problemAnswer; // form sem heldur utan um svör
let resultText; // birtir niðurstöðu leiks
let resultForm; // form sem heldur utan um útkomu leiks
let resultInput; // tekur inn nafn leikmanns


let hScore;
/**
 * Klárar leik. Birtir result og felur problem. Reiknar stig og birtir í result.
 */
function finish() {
  points = score(total, correct, playTime);
  const text = `Þú svaraðir ${correct} rétt af ${total} spurningum og fékkst ${points} stig fyrir. Skráðu þig á stigatöfluna!`;
  problemInput.value = '';

  const nytt = helper.el('span', text);
  helper.empty(resultText);
  resultText.appendChild(nytt);

  problem.classList.add('problem--hidden');
  result.classList.remove('result--hidden');
}

/**
 * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
 * tími er búinn kallar í finish().
 *
 * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
 * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
 * yfir fjölda sekúnda sem eftir er.
 *
 * @param {number} current Sekúndur eftir
 */
function tick(current) {
  // todo uppfæra tíma á síðu
  helper.empty(probleTimer);
  const nytt = helper.el('span', `${current}`);
  probleTimer.appendChild(nytt);

  setTimeout(() => {
    if (current <= 1) {
      helper.empty(probleTimer);
      return finish();
    }
    return tick(current - 1);
  }, 1000);
}


/**
 * Býr til nýja spurningu og sýnir undir .problem__question
 */
function showQuestion() {
  // todo útfæra
  currentProblem = new Question();
  total += 1;
  const problemQuestion = problem.querySelector('.problem__question');
  helper.empty(problemQuestion);
  const span = helper.el('span', currentProblem.problem);
  problemQuestion.appendChild(span);
}

function nullStilla() {
  total = 0;
  correct = 0;
  points = 0;
}

/**
 * Byrjar leik
 *
 * - Felur startButton og sýnir problem
 * - Núllstillir total og correct
 * - Kallar í fyrsta sinn í tick()
 * - Sýnir fyrstu spurningu
 */
function start() {
  // todo útfæra\
  nullStilla();
  startButton.classList.add('button--hidden');
  problem.classList.remove('problem--hidden');
  tick(playTime);
  showQuestion();
}

/**
 * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
 * rétt, hreinsar input og birtir nýja spurningu.
 *
 * @param {object} e Event þegar spurningu svarað
 */
function onSubmit(e) {
  e.preventDefault();
  const inp = problemInput.value.trim();
  if (!inp) { return; }

  if (parseInt(inp, 10) === currentProblem.answer) {
    correct += 1;
  }
  // todo útfært
  problemInput.value = '';
  showQuestion();
}

/**
 * Event handler fyrir þegar stig eru skráð eftir leik.
 *
 * @param {*} e Event þegar stig eru skráð
 */
function onSubmitScore(e) {
  e.preventDefault();
  const inp = resultInput.value.trim();

  if (!inp) { return; }

  storage.save(inp, points);
  hScore.load();
  result.classList.add('result--hidden');
  problem.classList.add('problem--hidden');
  startButton.classList.remove('button--hidden');
}

/**
 * Finnur öll element DOM og setur upp event handlers.
 *
 * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
 */
export default function init(_playTime) {
  playTime = _playTime;

  // todo útfæra
  problem = document.querySelector('.problem');
  result = document.querySelector('.result');
  problemInput = document.querySelector('.problem__input');
  startButton = document.querySelector('.start');
  probleTimer = document.querySelector('.problem__timer');
  problemAnswer = document.querySelector('.problem__answer');
  resultText = document.querySelector('.result__text');
  resultForm = document.querySelector('.result__form');
  resultInput = document.querySelector('.result__input');

  startButton.addEventListener('click', start);
  problemAnswer.addEventListener('submit', onSubmit);
  resultForm.addEventListener('submit', onSubmitScore);

  hScore = new Highscore();
}
