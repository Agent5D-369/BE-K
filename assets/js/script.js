const roleContent = {
  anchor: {
    title: 'The Anchor',
    summary: 'Your system is asking you to stabilize energy, nervous systems, and the field itself. You are strongest when you help people come back into steadiness, safety, and grounded presence.',
    gift: 'The Anchor lowers noise, steadies panic, and creates the conditions where clarity becomes possible.',
    shadow: 'When overused, this role can become overholding, emotional overfunctioning, or quiet self erasure.',
    next: 'Use your steadiness intentionally. Then let the audiobook widen the frame so you do not confuse holding everything together with your whole purpose.',
    ctaTitle: 'The full audiobook helps Anchors hold less and guide more cleanly.',
    ctaCopy: 'If your gift is stabilizing the field, the audiobook gives you a wider architecture so you do not disappear into overholding.'
  },
  bridge: {
    title: 'The Bridge',
    summary: 'Your system is asking you to translate signal into form. You help vision become language, structure, sequence, and reality.',
    gift: 'The Bridge makes complex things usable. You help ideas cross from inspiration into implementation.',
    shadow: 'When distorted, this role can stay in explanation, overengineering, or endless architecture without enough embodied movement.',
    next: 'Give your insight a container. Then use the audiobook to deepen the worldview behind the structures you are building.',
    ctaTitle: 'The full audiobook gives Bridges the wider map their structures belong inside.',
    ctaCopy: 'If your role is translation, the audiobook helps you place your designs inside a larger ethic, myth, and systems frame.'
  },
  weaver: {
    title: 'The Weaver',
    summary: 'Your system is asking you to reconnect what has split apart. You sense relationships, missing threads, and the human architecture under the visible work.',
    gift: 'The Weaver builds belonging, alignment, and coherence across people, ideas, and communities.',
    shadow: 'When overextended, this role can overaccommodate, smooth over hard truths, or carry too much relational labor.',
    next: 'Let connection stay load bearing, not self sacrificial. Then use the audiobook to expand the deeper map you are weaving people into.',
    ctaTitle: 'The full audiobook helps Weavers turn connection into enduring structure.',
    ctaCopy: 'If you are the relational thread, the audiobook helps you anchor belonging inside a larger architecture of meaning.'
  },
  flamekeeper: {
    title: 'The Flamekeeper',
    summary: 'Your system is asking you to protect purpose. You track where the real fire lives and where drift, dilution, or performance threaten it.',
    gift: 'The Flamekeeper restores standards, devotion, and fidelity to what matters most.',
    shadow: 'When distorted, this role can become rigid, scorched, impatient, or dismissive of people who are moving more slowly.',
    next: 'Guard the fire without becoming consumed by it. Then use the audiobook to reconnect your intensity with a wider architecture of meaning.',
    ctaTitle: 'The full audiobook helps Flamekeepers protect the fire without hardening around it.',
    ctaCopy: 'If you are tracking the true signal, the audiobook widens your frame so devotion stays sharp without becoming brittle.'
  },
  mirror: {
    title: 'The Mirror',
    summary: 'Your system is asking you to reveal what is hidden. You see the unseen pattern, the avoided truth, or the shadow under the surface story.',
    gift: 'The Mirror makes honest contact possible. You help people face what can no longer stay unconscious.',
    shadow: 'When untempered, this role can cut too quickly, speak without enough pacing, or leave people exposed rather than integrated.',
    next: 'Let truth become usable, not just sharp. Then use the audiobook to place your insight inside a larger field of coherence.',
    ctaTitle: 'The full audiobook helps Mirrors turn truth into integration, not just exposure.',
    ctaCopy: 'If your role is revelation, the audiobook helps place sharp insight inside a broader structure of repair and meaning.'
  }
};

const config = window.__BEK_CONFIG || {};
const helloAudioUrl = config.helloAudioUrl || '#';
const formEndpoint = config.formEndpoint || 'https://formspree.io/f/mnjodqre';

const form = document.getElementById('leadership-quiz');
const resultPanel = document.getElementById('result-panel');
const resultTitle = document.getElementById('result-title');
const resultSecondary = document.getElementById('result-secondary');
const resultSummary = document.getElementById('result-summary');
const resultGift = document.getElementById('result-gift');
const resultShadow = document.getElementById('result-shadow');
const resultNext = document.getElementById('result-next');
const resultCtaTitle = document.getElementById('result-cta-title');
const resultCtaCopy = document.getElementById('result-cta-copy');
const resultCtaLink = document.getElementById('result-cta-link');
const copyButton = document.getElementById('copy-result');
const shareCopy = document.getElementById('share-copy');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistStatus = document.getElementById('waitlist-status');
const waitlistResult = document.getElementById('waitlist-result');
const waitlistSecondary = document.getElementById('waitlist-secondary');
const purchaseButton = document.getElementById('purchase-button');
const stickyCtaLink = document.getElementById('sticky-cta-link');

let latestResult = null;

if (purchaseButton && helloAudioUrl && helloAudioUrl !== '#') {
  purchaseButton.href = helloAudioUrl;
  purchaseButton.removeAttribute('aria-disabled');
  purchaseButton.textContent = 'Buy the audiobook for $33';
}

if (resultCtaLink && helloAudioUrl && helloAudioUrl !== '#') {
  resultCtaLink.href = helloAudioUrl;
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function computeScores(formData) {
  const scores = {
    anchor: 0,
    bridge: 0,
    weaver: 0,
    flamekeeper: 0,
    mirror: 0
  };

  for (const [, value] of formData.entries()) {
    if (scores[value] !== undefined) {
      scores[value] += 1;
    }
  }

  return scores;
}

function getSortedRoles(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

function updateStickyCta(afterResult = false) {
  if (!stickyCtaLink) return;
  if (afterResult) {
    stickyCtaLink.href = '#purchase';
    stickyCtaLink.textContent = 'See the $33 audiobook offer';
  } else {
    stickyCtaLink.href = '#quiz';
    stickyCtaLink.textContent = 'Take the free quiz';
  }
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const formData = new FormData(form);
  const scores = computeScores(formData);
  const sortedRoles = getSortedRoles(scores);
  const [topRole, topScore] = sortedRoles[0];
  const [secondRole, secondScore] = sortedRoles[1];
  const content = roleContent[topRole];

  resultTitle.textContent = content.title;
  resultSummary.textContent = content.summary;
  resultGift.textContent = content.gift;
  resultShadow.textContent = content.shadow;
  resultNext.textContent = content.next;
  resultCtaTitle.textContent = content.ctaTitle;
  resultCtaCopy.textContent = content.ctaCopy;

  if (secondScore > 0) {
    resultSecondary.textContent = `${roleContent[secondRole].title} is also active in your field right now.`;
  } else {
    resultSecondary.textContent = '';
  }

  shareCopy.textContent = `My current leadership signal is ${content.title}. ${resultSecondary.textContent} Forward this to the person carrying the field with you and ask: Which role do you think is most needed in our life or project right now?`;

  if (waitlistResult) waitlistResult.value = content.title;
  if (waitlistSecondary) waitlistSecondary.value = secondScore > 0 ? roleContent[secondRole].title : '';

  latestResult = {
    primary: content.title,
    secondary: secondScore > 0 ? roleContent[secondRole].title : '',
    score: topScore
  };

  resultPanel.hidden = false;
  updateStickyCta(true);
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

copyButton?.addEventListener('click', async () => {
  const text = `${resultTitle.textContent}\n\n${resultSummary.textContent}\n\n${shareCopy.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copied';
    setTimeout(() => {
      copyButton.textContent = 'Copy result';
    }, 1800);
  } catch (error) {
    copyButton.textContent = 'Copy failed';
    setTimeout(() => {
      copyButton.textContent = 'Copy result';
    }, 1800);
  }
});

waitlistForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!waitlistForm.reportValidity()) return;

  waitlistStatus.textContent = 'Submitting...';
  waitlistStatus.style.color = '';

  try {
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: new FormData(waitlistForm)
    });

    if (response.ok) {
      waitlistForm.reset();
      if (waitlistResult && latestResult?.primary) waitlistResult.value = latestResult.primary;
      if (waitlistSecondary && latestResult?.secondary) waitlistSecondary.value = latestResult.secondary;
      waitlistStatus.textContent = 'You are in. Watch your inbox for future transmissions.';
      waitlistStatus.style.color = '#81f0c0';
    } else {
      waitlistStatus.textContent = 'Something did not go through. Please try again.';
      waitlistStatus.style.color = '#ffb1b1';
    }
  } catch (error) {
    waitlistStatus.textContent = 'Something did not go through. Please try again.';
    waitlistStatus.style.color = '#ffb1b1';
  }
});

updateStickyCta(false);
