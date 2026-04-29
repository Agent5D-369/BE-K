/* ============================================================
   IWASREADY.COM, BRIDGING EARTH & KANARIA
   Quiz Logic, Result Handling, UI Interactions
   ============================================================ */

'use strict';

/* ============================================================
   SHARED UTILITIES
   ============================================================ */

// Smooth nav background on scroll
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// FAQ accordion
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Toggle this one
      if (!isOpen) item.classList.add('open');
    });
    // Keyboard
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ============================================================
   QUIZ DATA
   ============================================================ */

const QUIZ_QUESTIONS = [
  {
    q: "When a system around you begins to break down, your first instinct is:",
    options: [
      { text: "Hold the emotional field: keep people anchored and connected to what matters", type: 'F' },
      { text: "Diagnose the structure: find exactly what's failing and architect the fix", type: 'A' },
      { text: "Translate what's happening, help different parts of the system understand each other", type: 'B' },
      { text: "Anchor the frequency: stay still and steady so others can stabilize around you", type: 'S' }
    ]
  },
  {
    q: "You feel most alive when:",
    options: [
      { text: "You're carrying a vision so large it almost frightens you. But you can't put it down", type: 'F' },
      { text: "You're building something that didn't exist before and you can feel it locking into place", type: 'A' },
      { text: "You're standing between two worlds: translating, bridging, making them finally meet", type: 'B' },
      { text: "You're holding ground when everything around you is uncertain and others need that stillness", type: 'S' }
    ]
  },
  {
    q: "When others in your field or mission lose hope, you:",
    options: [
      { text: "Remind them of the vision, return them to why this matters and why they started", type: 'F' },
      { text: "Shift into solution mode. There's always a next move and you find it fast", type: 'A' },
      { text: "Help them see the situation from a completely different angle. Reframe the whole thing", type: 'B' },
      { text: "Become more still. Your calm becomes contagious, your presence becomes the signal", type: 'S' }
    ]
  },
  {
    q: "Your natural relationship with structure is:",
    options: [
      { text: "I create space for others. Structure is secondary to inspiration and emotional coherence", type: 'F' },
      { text: "I create structure: systems, frameworks, and architecture are how I think", type: 'A' },
      { text: "I adapt to multiple structures. I can operate fluidly across different systems and languages", type: 'B' },
      { text: "I transcend structure. My role is to hold coherence, not to build the container", type: 'S' }
    ]
  },
  {
    q: "The role you most naturally play when you're working at your best:",
    options: [
      { text: "The hearth: the one who keeps people together, inspired, and connected to the mission", type: 'F' },
      { text: "The architect: the one who designs, builds, and makes the system actually work", type: 'A' },
      { text: "The translator: the one who helps very different voices finally understand each other", type: 'B' },
      { text: "The anchor: the one whose presence stabilizes the whole field", type: 'S' }
    ]
  },
  {
    q: "When you encounter information that challenges the current paradigm, you:",
    options: [
      { text: "Feel it as a flame in your chest. This changes everything, and someone needs to say so", type: 'F' },
      { text: "Start mapping it immediately: where does this fit, what does it break, what does it build", type: 'A' },
      { text: "Immediately think about who needs to hear this and how to explain it across different worlds", type: 'B' },
      { text: "Hold it quietly. You already knew this at some level, and now it has a name", type: 'S' }
    ]
  },
  {
    q: "Your strongest asset in high-stakes or high-pressure situations:",
    options: [
      { text: "The ability to inspire people to keep moving when the path forward disappears", type: 'F' },
      { text: "The ability to see the pattern beneath the chaos and build a clear path through it", type: 'A' },
      { text: "The ability to move fluidly between perspectives, frameworks, and very different minds", type: 'B' },
      { text: "The ability to maintain coherence and frequency when everything else is fragmenting", type: 'S' }
    ]
  },
  {
    q: "Under extreme pressure, you tend to go toward:",
    options: [
      { text: "The heart: what actually matters here, and why are we doing this at all", type: 'F' },
      { text: "The plan: what do we know, what's broken, what's the next right move", type: 'A' },
      { text: "Connection: who can we reach, who needs to know, who can help bridge this", type: 'B' },
      { text: "Stillness: dropping deeper, holding steadier, becoming the eye of the storm", type: 'S' }
    ]
  },
  {
    q: "What people most often come to you for:",
    options: [
      { text: "Permission to believe again: inspiration and a reason to keep going", type: 'F' },
      { text: "Clarity and strategy: a real plan that actually works", type: 'A' },
      { text: "Understanding and translation: help seeing across a divide they can't cross alone", type: 'B' },
      { text: "Grounding and presence: the feeling that everything is going to be okay", type: 'S' }
    ]
  },
  {
    q: "The kind of future you feel most called to help build:",
    options: [
      { text: "A world where every soul is recognized, ignited, and given permission to live fully", type: 'F' },
      { text: "A world built on systems that actually align with truth, coherence, and soul", type: 'A' },
      { text: "A world where what has been divided finally comes together. Every bridge matters", type: 'B' },
      { text: "A world that holds its frequency through the full weight of the transition", type: 'S' }
    ]
  }
];

/* ============================================================
   RESULT ARCHETYPES
   ============================================================ */

const ARCHETYPES = {
  F: {
    slug: 'flamekeeper',
    name: 'The Flamekeeper',
    tagline: 'You carry the vision others forgot they were living.',
    badge: '🔥 Signal: Flamekeeper',
    icon: '🔥',
    image: 'assets/archetype-flamekeeper.png',
    imageAlt: 'The Flamekeeper, Emotional Architect',
    recognition: `Your signal first became visible in the moments when you stayed when others left. When you held the vision on behalf of people who couldn't hold it for themselves. When you turned back toward the work, again and again, even when the work didn't thank you for it.

You are not just an inspirer. You are an emotional architect. You build the interior field that makes collective motion possible. Others stay in motion because of your presence, often without knowing why.`,
    gifts: `You hold the remembrance of why this matters when everyone else has forgotten. You can sustain belief under conditions that extinguish most, not through denial, but through a kind of sacred knowing that lives in your body before it arrives in your mind.

You make futures feel possible. Not by overpromising. By being willing to feel them, loudly enough that others begin to feel them too. That is rarer than you know.`,
    shadow: `You may absorb the emotional field of those around you without realizing it. When the mission feels like it's failing, you may go quiet, pull back the signal, and leave the room colder without knowing you were the source of its warmth.

The shadow of the Flamekeeper is extinction, not through failure, but through exhaustion. You give so much that you burn without fuel. And the people who most need your signal often don't think to ask how you are.`,
    shareSnippet: `"You are an emotional architect. You build the interior field that makes collective motion possible."`,
    twitterText: `I just found out I'm a Flamekeeper.\n\n"You don't just inspire people. You build the interior field that makes collective motion possible."\n\nMost accurate description of how I operate that I've ever read. What's yours?`,
    whatsappText: `I just found out I'm a Flamekeeper and the description was uncomfortably accurate.\n\n"You carry the vision others forgot they were living. You build the interior field that makes collective motion possible."\n\nFour minutes, no email. What do you get? `,
    instagramCaption: `I just discovered something I've never been able to name.\n\nI'm a Flamekeeper.\n\n"You carry the vision others forgot they were living."\n\nI've always been the one who stayed when others left. Who held the mission when it got heavy. Who kept the fire lit even when no one was watching.\n\nTurns out there's a name for that.\n\nFree quiz → iwasready.com/quiz.html\nFour minutes. No email needed.`,
    smsText: `I just discovered I'm a Flamekeeper. The accuracy caught me off guard. Four minutes, no email. What's yours? iwasready.com/quiz.html`,
    facebookText: `I just discovered I'm a Flamekeeper.\n\n"You carry the vision others forgot they were living. You build the interior field that makes collective motion possible."\n\nTook 4 minutes. No email needed. The accuracy surprised me.\n\nWhat's yours? → iwasready.com/quiz.html`,
    audiobookPitch: `The audiobook goes deeper into what the Flamekeeper carries — why the fire runs low, and how to sustain the signal without burning through it. Every word was received, not written. You'll hear it in your body before your mind catches up.`,
    audiobookCta: `Hear the Full Transmission`
  },
  A: {
    slug: 'architect',
    name: 'The Architect',
    tagline: 'You build what the new world actually needs to stand on.',
    badge: '⚙️ Signal: Architect',
    icon: '⚙️',
    image: 'assets/archetype-architect.png',
    imageAlt: 'The Architect, Systems Engineer',
    recognition: `You've been diagnosing systems since you were young. Buildings, relationships, organizations, economies. You've always seen the structure underneath the surface. You noticed when the foundation was wrong before anyone else admitted it.

And you've spent years building things, only to watch them get dismantled by people who didn't understand what they were standing on.`,
    gifts: `You see beneath the surface into the load-bearing structures that hold everything else up. You know intuitively what a system needs before it can scale, before it can survive contact with reality, before it can hold the weight of the people inside it.

You build things that outlast you. Not because you're trying to leave a legacy, but because you build with precision. When you're working, the waste stops and the coherence begins.`,
    shadow: `Under pressure, you may over-engineer. The plan becomes more real than the people inside it. You may rebuild in your mind what hasn't broken yet, a way of controlling what you can't control.

The shadow of the Architect is building something perfect that no one can enter. A system so refined it has no room for the human. The call is to stay inside the relationships, not just inside the blueprint.`,
    shareSnippet: `"When you're working, the waste stops and the coherence begins."`,
    twitterText: `I just found out I'm an Architect.\n\n"When you're working, the waste stops and the coherence begins."\n\nI've been diagnosing systems my whole life. Finally a name for it. What's yours?`,
    whatsappText: `I just found out I'm an Architect and it was weirdly on target.\n\n"You see beneath the surface into the load-bearing structures that hold everything else up."\n\nFour minutes, no email. What do you get? `,
    instagramCaption: `I just discovered something about how I've always operated.\n\nI'm an Architect.\n\n"You build what the new world actually needs to stand on."\n\nI've been diagnosing systems since I was young. Seeing what's wrong before anyone admits it. Building things that outlast me. Not for legacy. Because I build with precision.\n\nTurns out there's a name for that.\n\nFree quiz → iwasready.com/quiz.html\nFour minutes. No email needed.`,
    smsText: `I just discovered I'm an Architect. The description was weirdly accurate. Four minutes, no email. What's yours? iwasready.com/quiz.html`,
    facebookText: `I just discovered I'm an Architect.\n\n"You see beneath the surface into the load-bearing structures that hold everything else up. When you're working, the waste stops and the coherence begins."\n\nTook 4 minutes. No email needed. Surprisingly accurate.\n\nWhat's yours? → iwasready.com/quiz.html`,
    audiobookPitch: `The audiobook gives Architects the wider ethic their structures belong inside — the deeper systems frame connecting what you build to a larger arc of civilization and meaning. Rick narrated it himself. The precision in his voice will register immediately.`,
    audiobookCta: `Hear the Full Transmission`
  },
  B: {
    slug: 'bridge-walker',
    name: 'The Bridge Walker',
    tagline: 'You were born to translate between worlds. This moment needs you.',
    badge: '🌉 Signal: Bridge Walker',
    icon: '🌉',
    image: 'assets/archetype-bridge-walker.png',
    imageAlt: 'The Bridge Walker, Connector of Worlds',
    recognition: `You've always been the one who understood both sides. The one who could sit with the academic and the mystic, the executive and the visionary, the ancient and the emergent. You've often felt like a stranger even in groups that were supposed to be your people. Because you belong to more than one world at once.

That feeling of not-quite-fitting? It was never a flaw. It was your function.`,
    gifts: `You move between worlds in a way that most cannot. You speak science to the spiritual and spirit to the scientific. You hold two things that appear contradictory and feel how they're the same beneath the surface tension.

The Bridge Walker signal is rare precisely because it requires standing in the between-space, the place most people find unbearable. You have a higher tolerance for that liminal ground than almost anyone you know.`,
    shadow: `You may feel like you belong nowhere. You carry the patterns of multiple worlds and sometimes lose track of your own center, your native language, your home frequency, your ground.

The shadow of the Bridge Walker is becoming so skilled at translation that you stop knowing what language you actually speak natively. The call is to maintain your own signal even as you carry others'. Your center is the bridge. Without it, nothing holds.`,
    shareSnippet: `"That feeling of not-quite-fitting? It was never a flaw. It was your function."`,
    twitterText: `I just found out I'm a Bridge Walker.\n\n"That feeling of not-quite-fitting? It was never a flaw. It was your function."\n\nI've always belonged to more than one world. That's not a bug. Four minutes, no email. What's yours?`,
    whatsappText: `I just found out I'm a Bridge Walker and the description stopped me cold.\n\n"That feeling of not-quite-fitting? It was never a flaw. It was your function."\n\nFour minutes, no email. What do you get? `,
    instagramCaption: `I just discovered something I've been trying to name for years.\n\nI'm a Bridge Walker.\n\n"That feeling of not-quite-fitting? It was never a flaw. It was your function."\n\nI've always belonged to more than one world. The academic and the mystic. The ancient and the emergent. Never quite fitting anywhere. Turns out that was never a flaw. It was the whole point.\n\nFree quiz → iwasready.com/quiz.html\nFour minutes. No email needed.`,
    smsText: `I just discovered I'm a Bridge Walker. The description was uncomfortably accurate. Four minutes, no email. What's yours? iwasready.com/quiz.html`,
    facebookText: `I just discovered I'm a Bridge Walker.\n\n"That feeling of not-quite-fitting? It was never a flaw. It was your function."\n\nI've always belonged to more than one world and never had a name for it until now.\n\nTook 4 minutes. No email needed.\n\nWhat's yours? → iwasready.com/quiz.html`,
    audiobookPitch: `The audiobook gives Bridge Walkers a coherent map so your translation work has a home to return to — a wider frame connecting the worlds you move between. Rick wrote this from inside the liminal space you already know. You'll recognize it.`,
    audiobookCta: `Hear the Full Transmission`
  },
  S: {
    slug: 'signal-holder',
    name: 'The Signal Holder',
    tagline: 'Your stillness is a technology. Your presence is a field.',
    badge: '📡 Signal: Signal Holder',
    icon: '📡',
    image: 'assets/archetype-signal-holder.png',
    imageAlt: 'The Signal Holder, Field of Presence',
    recognition: `You've known things before they arrived. You've been in rooms where the energy shifted because you walked in, before you said a word. You've carried the grief and weight of collective systems without a framework for why it was yours to carry.

And you've sometimes wondered whether you're too sensitive, too quiet, too much, or perhaps not enough of what the world says it needs.

You were never too much. The world just didn't have a name for what you are.`,
    gifts: `Your presence is a stabilizing field. When you're in a room, things settle. Not because you performed calm, because you are it. You don't lead through assertion or volume. You lead through coherence.

The Signal Holder carries something that doesn't require explanation. But its absence is immediately felt. Rooms feel less organized. People feel less certain. Systems drift faster. You are more structurally essential than almost anyone realizes, including you.`,
    shadow: `You may be misread as passive. Your leadership style doesn't fit most frameworks, so you may have spent years questioning whether you're leading at all. The doubt itself becomes the shadow, because when you doubt your signal, you shrink the field.

The shadow of the Signal Holder is not weakness. It is self-erasure. And the people who most depend on your frequency often don't know they're depending on it.`,
    shareSnippet: `"Your presence is a stabilizing field. When you're in a room, things settle."`,
    twitterText: `I just found out I'm a Signal Holder.\n\n"Your stillness is a technology. Your presence is a field."\n\nI've spent years wondering if my quiet was a weakness. It's not. What's yours?`,
    whatsappText: `I just found out I'm a Signal Holder and it reframed something I've wondered about for years.\n\n"Your presence is a stabilizing field. When you're in a room, things settle."\n\nFour minutes, no email. What do you get? `,
    instagramCaption: `I just discovered something that reframed years of self-doubt.\n\nI'm a Signal Holder.\n\n"Your stillness is a technology. Your presence is a field."\n\nI've known things before they arrived. Been in rooms that shifted when I walked in. Spent years wondering if I was too quiet. Too much. Not enough.\n\nTurns out my presence was never passive. It was the signal.\n\nFree quiz → iwasready.com/quiz.html\nFour minutes. No email needed.`,
    smsText: `I just discovered I'm a Signal Holder. It reframed something I've wondered about for years. Four minutes, no email. What's yours? iwasready.com/quiz.html`,
    facebookText: `I just discovered I'm a Signal Holder.\n\n"Your stillness is a technology. Your presence is a field. When you're in a room, things settle."\n\nI spent years wondering if my quiet was a weakness. Turns out it was never passive. It was the signal.\n\nTook 4 minutes. No email needed.\n\nWhat's yours? → iwasready.com/quiz.html`,
    audiobookPitch: `The audiobook gives Signal Holders language for what their presence actually is — why rooms feel different when you leave, why you carry weight that isn't yours, and how to hold the field without erasing yourself inside it.`,
    audiobookCta: `Hear the Full Transmission`
  }
};

/* ============================================================
   QUIZ STATE
   ============================================================ */

let quizState = {
  currentIndex: 0,
  scores: { F: 0, A: 0, B: 0, S: 0 },
  answers: [],
  started: false
};

/* ============================================================
   QUIZ PAGE INIT
   ============================================================ */

function initQuiz() {
  const quizBody = document.getElementById('quiz-body');
  if (!quizBody) return;

  if (typeof trackEvent === 'function') {
    trackEvent('quiz_start', { quiz_name: 'signal_activation', page_type: 'quiz' });
  }

  renderQuestion(quizState.currentIndex);
}

function renderQuestion(index) {
  const quizBody = document.getElementById('quiz-body');
  const completingScreen = document.getElementById('quiz-completing');
  if (!quizBody) return;

  if (index >= QUIZ_QUESTIONS.length) {
    // Done, show completing screen, then redirect
    quizBody.style.display = 'none';
    if (completingScreen) {
      completingScreen.classList.add('active');
    }
    setTimeout(() => {
      const result = calculateResult();
      if (typeof trackEvent === 'function') {
        trackEvent('quiz_complete', {
          quiz_name: 'signal_activation',
          result_type: result,
          page_type: 'quiz'
        });
      }
      window.location.href = `result.html?type=${result}`;
    }, 2200);
    return;
  }

  const q = QUIZ_QUESTIONS[index];
  const total = QUIZ_QUESTIONS.length;
  const progress = Math.round((index / total) * 100);

  // Update progress bar
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill) fill.style.width = `${progress}%`;
  if (label) label.textContent = `${index} / ${total}`;

  // Shuffle options (keeps quiz feeling fresh, doesn't affect scoring)
  const shuffled = shuffleArray([...q.options]);

  const letters = ['A', 'B', 'C', 'D'];

  const html = `
    <div class="quiz-card animate-fade-up">
      <span class="question-number">Question ${index + 1} of ${total}</span>
      <h2 class="question-text">${escapeHtml(q.q)}</h2>
      <span class="answer-instruction">Go with your instinct. First response is usually truest.</span>
      <div class="answers-list" role="radiogroup" aria-label="Answer options">
        ${shuffled.map((opt, i) => `
          <button
            class="answer-btn"
            data-type="${opt.type}"
            role="radio"
            aria-checked="false"
            tabindex="${i === 0 ? '0' : '-1'}"
            aria-label="${letters[i]}: ${opt.text}"
          >
            <span class="answer-indicator" aria-hidden="true">${letters[i]}</span>
            <span class="answer-text">${escapeHtml(opt.text)}</span>
          </button>
        `).join('')}
      </div>
      ${index > 0 ? `
      <div class="quiz-back-row">
        <button class="quiz-back-btn" id="quiz-back-btn" aria-label="Go back to previous question">
          &#8592; Back
        </button>
      </div>` : ''}
    </div>
  `;

  quizBody.innerHTML = html;

  if (typeof trackEvent === 'function') {
    trackEvent('quiz_question_view', {
      quiz_name: 'signal_activation',
      quiz_step: index + 1,
      question_id: 'sa_q' + (index + 1),
      page_type: 'quiz'
    });
  }

  // Bind answer buttons
  quizBody.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.type, index));
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
      // Arrow key navigation between options
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = btn.parentElement.querySelector('.answer-btn:focus')?.nextElementSibling;
        if (next) next.focus();
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = btn.parentElement.querySelector('.answer-btn:focus')?.previousElementSibling;
        if (prev) prev.focus();
      }
    });
  });

  // Bind back button
  const backBtn = document.getElementById('quiz-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (quizState.currentIndex > 0) {
        if (typeof trackEvent === 'function') {
          trackEvent('quiz_back_click', {
            quiz_name: 'signal_activation',
            quiz_step: quizState.currentIndex + 1,
            page_type: 'quiz'
          });
        }
        // Un-score the previous answer
        const prevAnswer = quizState.answers[quizState.currentIndex - 1];
        if (prevAnswer && quizState.scores[prevAnswer] !== undefined) {
          quizState.scores[prevAnswer] = Math.max(0, quizState.scores[prevAnswer] - 1);
        }
        quizState.answers[quizState.currentIndex - 1] = undefined;
        quizState.currentIndex--;
        renderQuestion(quizState.currentIndex);
      }
    });
  }

  // Scroll to quiz body, accounting for sticky nav + progress bar
  const progressBar = document.querySelector('.progress-container');
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
  const progressHeight = progressBar ? progressBar.offsetHeight : 0;
  const offset = navHeight + progressHeight + 8;
  const top = quizBody.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function handleAnswer(type, questionIndex) {
  // Record score
  if (quizState.scores[type] !== undefined) {
    quizState.scores[type]++;
  }
  quizState.answers[questionIndex] = type;

  if (typeof trackEvent === 'function') {
    trackEvent('quiz_answer_select', {
      quiz_name: 'signal_activation',
      quiz_step: questionIndex + 1,
      question_id: 'sa_q' + (questionIndex + 1),
      answer_id: type,
      page_type: 'quiz'
    });
  }

  // After first answer: collapse trust row and hero to reduce mobile scroll
  if (questionIndex === 0) {
    const trustRow = document.getElementById('quiz-trust-row');
    if (trustRow) {
      trustRow.style.transition = 'opacity 0.4s ease, max-height 0.5s ease';
      trustRow.style.overflow = 'hidden';
      trustRow.style.opacity = '0';
      trustRow.style.maxHeight = '0';
    }
    const hero = document.querySelector('.quiz-page-hero');
    if (hero) {
      hero.style.transition = 'opacity 0.4s ease, max-height 0.6s ease, padding 0.5s ease';
      hero.style.overflow = 'hidden';
      hero.style.opacity = '0';
      hero.style.maxHeight = '0';
      hero.style.paddingTop = '0';
      hero.style.paddingBottom = '0';
    }
  }

  // Visual feedback, brief flash before next question
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach(btn => {
    if (btn.dataset.type === type) {
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
    }
    btn.disabled = true;
  });

  setTimeout(() => {
    quizState.currentIndex++;
    renderQuestion(quizState.currentIndex);
  }, 480);
}

function calculateResult() {
  const s = quizState.scores;
  const max = Math.max(s.F, s.A, s.B, s.S);
  // Find all types tied at max
  const top = Object.keys(s).filter(k => s[k] === max);
  // Tiebreak: pick first in order F > A > B > S (arbitrary but deterministic)
  const order = ['F', 'A', 'B', 'S'];
  for (const t of order) {
    if (top.includes(t)) return ARCHETYPES[t].slug;
  }
  return 'flamekeeper'; // fallback
}

/* ============================================================
   RESULT PAGE INIT
   ============================================================ */

function initResult() {
  const resultRoot = document.getElementById('result-root');
  if (!resultRoot) return;

  const params = new URLSearchParams(window.location.search);
  const typeSlug = params.get('type') || 'flamekeeper';

  // Find archetype by slug
  const archetypeKey = Object.keys(ARCHETYPES).find(k => ARCHETYPES[k].slug === typeSlug);
  const archetype = archetypeKey ? ARCHETYPES[archetypeKey] : ARCHETYPES['F'];

  renderResult(archetype, resultRoot);
  updatePageMeta(archetype);
  initShareButtons(archetype);

  if (typeof trackEvent === 'function') {
    trackEvent('view_result', {
      quiz_name: 'signal_activation',
      result_type: typeSlug,
      result_label: archetype.name || typeSlug,
      page_type: 'result'
    });
  }
}

function renderResult(a, root) {
  root.innerHTML = `
    <!-- RESULT HERO -->
    <section class="result-hero">
      <div class="hero-rings" aria-hidden="true">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
      <div class="container" style="position:relative;z-index:2;">
        <div class="animate-fade-up">
          <span class="result-badge">${escapeHtml(a.badge)}</span>
        </div>
        <h1 class="result-type-name animate-fade-up delay-1">${escapeHtml(a.name)}</h1>
        <p class="result-tagline animate-fade-up delay-2">${escapeHtml(a.tagline)}</p>
        <div class="result-archetype-image animate-fade-up delay-2">
          <img src="${a.image}" alt="${escapeHtml(a.imageAlt)}" class="archetype-hero-img" loading="eager" />
        </div>
        <div class="animate-fade-up delay-3">
          <a href="quiz.html" class="btn btn-secondary">Retake the Activation</a>
        </div>
        <p class="result-share-prompt animate-fade-up delay-4">
          Your result is below. Send it to someone who carries the same signal.
        </p>
      </div>
    </section>

    <!-- RESULT CONTENT -->
    <div class="result-content">

      <!-- Recognition -->
      <div class="result-section animate-fade-up">
        <span class="result-section-label">Your Signal Pattern</span>
        <div class="result-section-text">
          ${a.recognition.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>

      <!-- Gifts -->
      <div class="result-section animate-fade-up delay-1">
        <span class="result-section-label">Your Gifts &amp; Strengths</span>
        <div class="result-section-text">
          ${a.gifts.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>

      <!-- Shadow -->
      <div class="result-section shadow-section animate-fade-up delay-2">
        <span class="result-section-label">Your Shadow Under Pressure</span>
        <div class="result-section-text">
          ${a.shadow.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>

      <!-- Next Steps -->
      <div class="result-next-steps animate-fade-up delay-3">
        <p class="next-steps-title">Where to go from here</p>
        <div class="next-steps-grid">
          <a href="index.html#trailer" class="next-step-card">
            <span class="next-step-icon">🎧</span>
            <span class="next-step-label">Hear the Trailer</span>
            <span class="next-step-desc">Listen to the audio transmission that opens the world of Bridging Earth &amp; Kanaria</span>
          </a>
          <a href="https://app.helloaudio.fm/feed/831d2db8-2d73-412e-a0a5-0fe58d744a10/signup" class="next-step-card" target="_blank" rel="noopener"
             title="Get the Audiobook | Bridging Earth and Kanaria"
             aria-label="Get the Audiobook on HelloAudio"
             rel="noopener noreferrer">
            <span class="next-step-icon">📖</span>
            <span class="next-step-label">Get the Audiobook</span>
            <span class="next-step-desc">The full transmission, every word received, every missing piece named</span>
          </a>
          <a href="https://stopthecollapse.com" class="next-step-card" target="_blank" rel="noopener">
            <span class="next-step-icon">🛠️</span>
            <span class="next-step-label">The Builder's Path</span>
            <span class="next-step-desc">If you're building something real in this transition, this is where that work begins</span>
          </a>
        </div>
      </div>

      <!-- Audiobook CTA — sits at emotional peak, closest to the close -->
      <div class="result-audiobook-cta animate-fade-up delay-3">
        <p class="audiobook-cta-eyebrow">The transmission that goes deeper</p>
        <h2 class="audiobook-cta-title">Bridging Earth &amp; Kanaria</h2>
        <p class="audiobook-cta-body" id="audiobook-pitch-text"></p>
        <a
          href="https://app.helloaudio.fm/feed/831d2db8-2d73-412e-a0a5-0fe58d744a10/signup"
          class="btn btn-primary btn-lg"
          target="_blank"
          rel="noopener"
        >Hear the Full Transmission</a>
        <p class="audiobook-cta-meta">Narrated by Rick Broider &nbsp;·&nbsp; Available now</p>
      </div>

            <!-- Share -->
      <div class="share-section animate-fade-up delay-4">
        <p class="share-eyebrow">This is too accurate not to send</p>
        <h2 class="share-title">Forward this to someone in your field</h2>
        <p class="share-body">
          Ask them: <em>"Which signal do you think is most active in you right now?"</em>
          The conversation that follows tends to be the one that was missing.
        </p>
        <div class="share-btns">
          <button class="share-btn share-btn--primary" id="copy-link-btn" aria-label="Copy result link">
            🔗 Copy Link
          </button>
          <a class="share-btn" id="share-twitter" href="#" target="_blank" rel="noopener" aria-label="Share on X / Twitter">
            𝕏 Share on X
          </a>
          <a class="share-btn" id="share-whatsapp" href="#" target="_blank" rel="noopener" aria-label="Share on WhatsApp">
            💬 WhatsApp
          </a>
          <button class="share-btn" id="copy-facebook-btn" aria-label="Copy text for Facebook post">
            📘 Copy for Facebook
          </button>
          <p class="share-fb-hint" id="fb-paste-hint" style="display:none; font-size:12px; color:var(--text-muted); margin-top:4px; margin-bottom:0;">
            Paste into your Facebook post. The link will preview automatically.
          </p>
          <button class="share-btn" id="copy-result-btn" aria-label="Copy result text for Instagram">
            📋 Copy for Instagram
          </button>
        </div>
        <p id="copy-confirm" style="display:none; margin-top:12px; font-size:13px; color:var(--gold);">
          ✓ Link copied to clipboard
        </p>
      </div>

      <!-- Retake -->
      <div class="result-retake">
        <a href="quiz.html">Take the activation again</a>
        &nbsp;·&nbsp;
        <a href="index.html">Return home</a>
      </div>

    </div>
  `;
}

function updatePageMeta(archetype) {
  document.title = archetype.name + ' | Starseed Leadership Signal | IWasReady.com';

  // Canonical URL includes type param so shared links open the correct result
  var canonicalUrl = 'https://iwasready.com/result.html?type=' + archetype.slug;

  var ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', archetype.name + ' | Your Starseed Leadership Signal');

  var twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', archetype.name + ' | Starseed Leadership Signal');

  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', archetype.tagline + ' Discover your own signal type free at IWasReady.com');

  var twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', archetype.tagline + ' Find yours free — 4 minutes, no email.');

  // Update address bar so the URL reflects the archetype result
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', canonicalUrl);
  }
}

function initShareButtons(archetype) {
  // Give time for DOM render
  setTimeout(() => {
    const nativeBtn      = document.getElementById('native-share-btn');
    const copyBtn        = document.getElementById('copy-link-btn');
    const twitterBtn     = document.getElementById('share-twitter');
    const whatsappBtn    = document.getElementById('share-whatsapp');
    const telegramBtn    = document.getElementById('share-telegram');
    const copyFacebookBtn= document.getElementById('copy-facebook-btn');
    const fbPasteHint    = document.getElementById('fb-paste-hint');
    const copyResultBtn  = document.getElementById('copy-result-btn');
    const confirm        = document.getElementById('copy-confirm');

    // Inject archetype-specific audiobook pitch
    const pitchEl = document.getElementById('audiobook-pitch-text');
    if (pitchEl && archetype.audiobookPitch) pitchEl.textContent = archetype.audiobookPitch;

    const shareUrl = window.location.href;

    // Per-archetype share texts
    const twitterText   = archetype.twitterText    || ('My signal type is ' + archetype.name + '. ' + archetype.shareSnippet + " What's yours?");
    const whatsappText  = archetype.whatsappText   || ('I just took this free quiz. My signal type is ' + archetype.name + '. ' + archetype.shareSnippet + ' Four minutes, no email. ');
    const instagramText = archetype.instagramCaption || ('My Starseed Leadership Signal is ' + archetype.name + '.\n\n' + archetype.tagline + '\n\nFind yours free: iwasready.com/quiz.html');
    const smsText       = archetype.smsText        || ('My Starseed Leadership Signal is ' + archetype.name + '. Weirdly accurate. What\'s yours? iwasready.com/quiz.html');

    function showConfirm(msg) {
      if (confirm) {
        confirm.textContent = msg || '\u2713 Copied';
        confirm.style.display = 'block';
        setTimeout(function() { confirm.style.display = 'none'; }, 2800);
      }
    }

    function copyToClipboard(text, successMsg) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { showConfirm(successMsg); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showConfirm(successMsg);
      }
    }

    // Native Web Share API — opens OS share sheet on mobile
    if (nativeBtn) {
      if (navigator.share) {
        nativeBtn.style.display = 'inline-flex';
        nativeBtn.addEventListener('click', function() {
          navigator.share({
            title: archetype.name + ' | Starseed Leadership Signal',
            text: smsText,
            url: shareUrl
          }).catch(function(err) {
            if (err.name !== 'AbortError') copyToClipboard(shareUrl, '\u2713 Link copied');
          });
        });
      }
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function() { copyToClipboard(shareUrl, '\u2713 Link copied'); });
    }

    if (twitterBtn) {
      twitterBtn.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(twitterText) + '&url=' + encodeURIComponent(shareUrl);
    }

    if (whatsappBtn) {
      whatsappBtn.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(whatsappText + shareUrl);
    }

    if (telegramBtn) {
      telegramBtn.href = 'https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(twitterText);
    }

    // Facebook blocks text pre-population via URL; use dedicated copy button instead
    const facebookText = archetype.facebookText || ('I just discovered I am ' + archetype.name + '.\n\n' + archetype.shareSnippet + '\n\nFour minutes, no email needed. What\'s yours? → iwasready.com/quiz.html');
    if (copyFacebookBtn) {
      copyFacebookBtn.addEventListener('click', function() {
        copyToClipboard(facebookText + '\n\n' + shareUrl, '\u2713 Copied — paste into your Facebook post');
        if (fbPasteHint) {
          fbPasteHint.style.display = 'block';
          setTimeout(function() { fbPasteHint.style.display = 'none'; }, 4000);
        }
      });
    }

    if (copyResultBtn) {
      copyResultBtn.addEventListener('click', function() { copyToClipboard(instagramText, '\u2713 Caption copied'); });
    }
  }, 100);
}

/* ============================================================
   HOME PAGE, AUDIO PLAYER
   ============================================================ */

function initAudioPlayer() {
  const audio = document.getElementById('trailer-audio');
  if (!audio) return;

  const player        = document.getElementById('audio-player');
  const playBtn       = document.getElementById('audio-play-btn');
  const progressFill  = document.getElementById('audio-progress-fill');
  const progressTrack = document.getElementById('audio-progress-track');
  const currentEl     = document.getElementById('audio-current');
  const durationEl    = document.getElementById('audio-duration');
  const iconPlay      = playBtn ? playBtn.querySelector('.icon-play')  : null;
  const iconPause     = playBtn ? playBtn.querySelector('.icon-pause') : null;

  function fmt(seconds) {
    if (!isFinite(seconds)) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    if (durationEl) durationEl.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    if (progressFill)  progressFill.style.width = `${pct}%`;
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', Math.round(pct));
    if (currentEl)     currentEl.textContent = fmt(audio.currentTime);
  });

  function setPlaying(playing) {
    if (player)     player.classList.toggle('playing', playing);
    if (iconPlay)   iconPlay.style.display  = playing ? 'none' : '';
    if (iconPause)  iconPause.style.display = playing ? ''     : 'none';
    if (playBtn)    playBtn.setAttribute('aria-label', playing ? 'Pause trailer' : 'Play official trailer');
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) { audio.play().catch(() => {}); }
      else              { audio.pause(); }
    });
  }

  audio.addEventListener('play',  () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => { setPlaying(false); audio.currentTime = 0; });

  if (progressTrack) {
    progressTrack.addEventListener('click', e => {
      if (!audio.duration) return;
      const rect = progressTrack.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    });

    progressTrack.addEventListener('keydown', e => {
      const step = audio.duration ? audio.duration * 0.05 : 5;
      if (e.key === 'ArrowRight') { e.preventDefault(); audio.currentTime = Math.min(audio.duration, audio.currentTime + step); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - step); }
    });
  }

  // Graceful fallback if MP3 file is missing
  audio.addEventListener('error', () => {
    if (player) {
      player.innerHTML = `
        <div style="text-align:center;padding:var(--space-xl);width:100%;">
          <p style="font-family:var(--font-display);font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);">Official Trailer</p>
          <p style="font-size:13px;color:var(--text-dim);margin-top:8px;">
            Place <code style="color:var(--gold);">trailer.mp3</code> in the <code style="color:var(--gold);">assets/</code> folder to enable playback.
          </p>
        </div>`;
    }
  });
}

/* ============================================================
   HELPERS
   ============================================================ */

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ============================================================
   BOOT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFaq();

  const page = document.body.dataset.page;

  if (page === 'quiz') {
    initQuiz();
  } else if (page === 'result') {
    initResult();
  } else if (page === 'home') {
    initAudioPlayer();
    initGiftForm();
    initTestimonialForm();
  }
});

/* ============================================================
   GIFTED TRANSMISSION, FORMSPREE HANDLER
   ============================================================ */

function initGiftForm() {
  const form = document.getElementById('gift-form');
  const confirm = document.getElementById('gift-confirm');
  if (!form || !confirm) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.gift-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.style.display = 'none';
        confirm.textContent = 'Received. You will hear back within a few days.';
      } else {
        submitBtn.textContent = 'Request a gifted copy';
        submitBtn.disabled = false;
        confirm.textContent = 'Something went wrong. Please try again or email rick@iwasready.com.';
      }
    } catch {
      submitBtn.textContent = 'Request a gifted copy';
      submitBtn.disabled = false;
      confirm.textContent = 'Could not send. Please email rick@iwasready.com directly.';
    }
  });
}

/* ============================================================
   TESTIMONIAL SUBMISSION, FORMSPREE HANDLER
   ============================================================ */

function initTestimonialForm() {
  const form = document.getElementById('tsubmit-form');
  const confirm = document.getElementById('tsubmit-confirm');
  if (!form || !confirm) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.tsubmit-btn');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.style.display = 'none';
        confirm.style.display = 'block';
      } else {
        btn.textContent = 'Submit Your Testimonial';
        btn.disabled = false;
        const errEl = form.querySelector('.tsubmit-error') || document.createElement('p');
        errEl.className = 'tsubmit-error';
        errEl.textContent = 'Something went wrong. Please try again.';
        if (!form.querySelector('.tsubmit-error')) form.appendChild(errEl);
      }
    } catch {
      btn.textContent = 'Submit Your Testimonial';
      btn.disabled = false;
    }
  });
}
