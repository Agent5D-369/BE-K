const questions = [
  {
    text: 'When a room feels scattered, what do you naturally do first?',
    answers: [
      { text: 'I ground the energy and create a steadier center so people can settle.', type: 'anchor' },
      { text: 'I name what is really happening and translate confusion into something usable.', type: 'bridge' },
      { text: 'I notice where people are disconnected and start weaving coherence between them.', type: 'weaver' },
      { text: 'I protect what matters most and help the field stop leaking energy.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'What kind of work tends to feel most natural to you when things get complex?',
    answers: [
      { text: 'Holding the center and stabilizing the room.', type: 'anchor' },
      { text: 'Translating signal into language or structure people can use.', type: 'bridge' },
      { text: 'Connecting people, pieces, and patterns into something coherent.', type: 'weaver' },
      { text: 'Guarding the core vision and keeping distortion out.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'When a system starts breaking down, what do you notice first?',
    answers: [
      { text: 'The nervous system of the group feels unstable.', type: 'anchor' },
      { text: 'People do not understand what is actually happening.', type: 'bridge' },
      { text: 'Relationships and trust lines are fragmenting.', type: 'weaver' },
      { text: 'The purpose is being diluted or compromised.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'Which role do others unconsciously hand you?',
    answers: [
      { text: 'The calm one who steadies the field.', type: 'anchor' },
      { text: 'The interpreter who makes it make sense.', type: 'bridge' },
      { text: 'The connector who helps everyone get back into coherence.', type: 'weaver' },
      { text: 'The protector who knows what cannot be compromised.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'What kind of pressure gets under your skin fastest?',
    answers: [
      { text: 'Chaotic pacing and unstable energy.', type: 'anchor' },
      { text: 'Confusion, distortion, or miscommunication.', type: 'bridge' },
      { text: 'Disconnection, exclusion, or quiet relational breakdown.', type: 'weaver' },
      { text: 'Mission drift, leakage, or a compromised container.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'What usually helps people trust you?',
    answers: [
      { text: 'My steadiness under pressure.', type: 'anchor' },
      { text: 'My ability to make things legible.', type: 'bridge' },
      { text: 'My capacity to make people feel included and connected.', type: 'weaver' },
      { text: 'My clarity about what matters and what does not.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'What are you most likely to overdo when you are stretched?',
    answers: [
      { text: 'Over-holding the field for everyone.', type: 'anchor' },
      { text: 'Over-explaining or trying to translate everything.', type: 'bridge' },
      { text: 'Over-relating and carrying too much connective labor.', type: 'weaver' },
      { text: 'Over-protecting and becoming too guarded.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'What kind of result feels most satisfying?',
    answers: [
      { text: 'The room feels calmer, safer, and more regulated.', type: 'anchor' },
      { text: 'People finally understand what they are doing and why.', type: 'bridge' },
      { text: 'The field becomes more connected and relationally alive.', type: 'weaver' },
      { text: 'The mission stays intact and the container gets cleaner.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'What do you instinctively protect?',
    answers: [
      { text: 'The nervous system of the field.', type: 'anchor' },
      { text: 'The clarity of the signal.', type: 'bridge' },
      { text: 'The threads of connection between people.', type: 'weaver' },
      { text: 'The core purpose and clean boundaries.', type: 'flamekeeper' }
    ]
  },
  {
    text: 'Which sentence feels most like you?',
    answers: [
      { text: 'I steady what would otherwise spin out.', type: 'anchor' },
      { text: 'I translate what others sense but cannot yet name.', type: 'bridge' },
      { text: 'I reconnect what fragmentation tries to split apart.', type: 'weaver' },
      { text: 'I protect what is sacred from dilution.', type: 'flamekeeper' }
    ]
  }
];

const resultMap = {
  anchor: {
    name: 'The Anchor',
    blurb: 'You stabilize through grounded presence. When a field starts wobbling, your nervous system instinctively looks for the center and helps restore it.'
  },
  bridge: {
    name: 'The Bridge',
    blurb: 'You stabilize through translation. You help people cross from confusion into clarity, and from signal into structure.'
  },
  weaver: {
    name: 'The Weaver',
    blurb: 'You stabilize through coherence. You track relational fractures, reconnect the field, and help fragmented systems become more alive.'
  },
  flamekeeper: {
    name: 'The Flamekeeper',
    blurb: 'You stabilize through protection of the core. You sense what cannot be compromised, and you help the field stop leaking purpose.'
  }
};

const state = {
  index: 0,
  selections: new Array(questions.length).fill(null)
};

const answersEl = document.getElementById('answers');
const questionTextEl = document.getElementById('questionText');
const questionLabelEl = document.getElementById('questionLabel');
const progressFillEl = document.getElementById('progressFill');
const progressCopyEl = document.getElementById('progressCopy');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const questionCard = document.getElementById('questionCard');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function renderQuestion() {
  const question = questions[state.index];
  questionLabelEl.textContent = `Question ${state.index + 1}`;
  questionTextEl.textContent = question.text;
  progressCopyEl.textContent = `Question ${state.index + 1} of ${questions.length}`;
  progressFillEl.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  answersEl.innerHTML = '';

  question.answers.forEach((answer, idx) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    if (state.selections[state.index] === idx) button.classList.add('selected');
    button.textContent = answer.text;
    button.addEventListener('click', () => {
      state.selections[state.index] = idx;
      if (state.index < questions.length - 1) {
        state.index += 1;
        renderQuestion();
        questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        renderResult();
      }
    });
    answersEl.appendChild(button);
  });

  backBtn.disabled = state.index === 0;
}

function renderResult() {
  const counts = { anchor: 0, bridge: 0, weaver: 0, flamekeeper: 0 };

  state.selections.forEach((choice, qIdx) => {
    if (choice === null) return;
    const type = questions[qIdx].answers[choice].type;
    counts[type] += 1;
  });

  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const result = resultMap[winner];

  questionLabelEl.textContent = 'Your result';
  questionTextEl.textContent = result.name;
  progressCopyEl.textContent = 'Signal recognized';
  progressFillEl.style.width = '100%';
  answersEl.innerHTML = `
    <div class="mini-card">
      <p class="quote" style="margin:0;">${result.blurb}</p>
      <p class="footer-note" style="margin-top:14px;">If this landed, the next move is not more abstraction. It is giving this recognition a larger frame so you can work with it instead of just naming it.</p>
      <div class="stacked-actions" style="margin-top:18px;">
        <a class="cta" href="result.html">Open the sample result page</a>
        <a class="ghost-cta" href="#results-bridge">See where this can lead</a>
      </div>
    </div>
  `;
  backBtn.disabled = false;
}

backBtn?.addEventListener('click', () => {
  if (state.index > 0) {
    state.index -= 1;
    renderQuestion();
  }
});

restartBtn?.addEventListener('click', () => {
  state.index = 0;
  state.selections.fill(null);
  renderQuestion();
});

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileMenu.hidden = !isOpen;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('#mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.hidden = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

renderQuestion();
