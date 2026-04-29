/* ============================================================
   IWasReady.com — Shared Analytics + Attribution Layer
   analytics.js v3.0  |  GTM: GTM-M7TMDNL7 → GA4: G-ZGMHG7VF66
   Load on every page in <head>, after the GTM snippet.
   All events route through GTM via dataLayer.push().
   No direct GA4 calls. No gtag(). No new dependencies.
   ============================================================ */

'use strict';

// ── Data Layer (GTM reads this) ───────────────────────────────────────────────
window.dataLayer = window.dataLayer || [];

/* ── [ANALYTICS] Core push helper ─────────────────────────────────────────────
   All tracking in this file uses pushIwrEvent().
   Adds page_path and attribution context automatically.
   ─────────────────────────────────────────────────────────────────────────── */
function pushIwrEvent(eventName, payload) {
  window.dataLayer = window.dataLayer || [];
  var ctx = _getAttributionContext();
  window.dataLayer.push(Object.assign(
    { event: eventName, page_path: window.location.pathname },
    ctx,
    payload || {}
  ));
}

/* Legacy wrapper — keeps quiz instrumentation in consciousness-quiz.html
   and script.js working without changes. Routes through pushIwrEvent. */
function trackEvent(name, params) {
  pushIwrEvent(name, params || {});
}

// ── UTM + Click-ID capture ────────────────────────────────────────────────────
var _UTM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'utm_id',
  'fbclid', 'ttclid', 'gclid'
];
var _ATTR_ORIG = 'iwr_attr_orig'; // first-touch — written once, never overwritten
var _ATTR_LAST = 'iwr_attr_last'; // last-touch  — updated on every ad visit

function _captureUTMs() {
  try {
    var params = new URLSearchParams(window.location.search);
    var hit = {};
    var hasAny = false;
    _UTM_KEYS.forEach(function(k) {
      var v = params.get(k);
      if (v) { hit[k] = v; hasAny = true; }
    });
    if (!hasAny) return;
    localStorage.setItem(_ATTR_LAST, JSON.stringify(hit));
    if (!localStorage.getItem(_ATTR_ORIG)) {
      localStorage.setItem(_ATTR_ORIG, JSON.stringify(hit));
    }
  } catch (e) {}
}

function _readAttr(key) {
  try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : {}; }
  catch (e) { return {}; }
}

function _getAttributionContext() {
  var o = _readAttr(_ATTR_ORIG);
  var l = _readAttr(_ATTR_LAST);
  return {
    traffic_source:        o.utm_source   || '',
    traffic_medium:        o.utm_medium   || '',
    traffic_campaign:      o.utm_campaign || '',
    traffic_content:       o.utm_content  || '',
    hook_angle:            o.utm_content  || '',
    creative_id:           o.utm_id       || '',
    last_traffic_source:   l.utm_source   || '',
    last_traffic_medium:   l.utm_medium   || '',
    session_entry_page:    _getEntryPage(),
    original_landing_page: _getEntryPage()
  };
}

// ── Session entry page ────────────────────────────────────────────────────────
var _SESSION_ENTRY = 'iwr_session_entry';
function _getEntryPage() {
  try {
    var v = sessionStorage.getItem(_SESSION_ENTRY);
    if (v) return v;
    sessionStorage.setItem(_SESSION_ENTRY, window.location.pathname);
    return window.location.pathname;
  } catch (e) { return window.location.pathname; }
}

// ── Paid-traffic mode detection ───────────────────────────────────────────────
function isPaidTrafficMode() {
  try {
    var p = new URLSearchParams(window.location.search);
    if (p.get('lp') === 'paid') return true;
    var m = p.get('utm_medium') || _readAttr(_ATTR_LAST).utm_medium || '';
    return m === 'paid_social' || m === 'cpc';
  } catch (e) { return false; }
}

/* ── [ANALYTICS] CTA location helper ──────────────────────────────────────────
   Walks up the DOM from a clicked element to identify which section it's in.
   Returns a short string for cta_location. No DOM mutation.
   ─────────────────────────────────────────────────────────────────────────── */
function _getCtaLocation(el) {
  var node = el;
  while (node && node !== document.body) {
    var id  = (node.id  || '').toLowerCase();
    var cls = (typeof node.className === 'string' ? node.className : '').toLowerCase();
    if (id === 'nav' || cls.indexOf('nav-') !== -1 || cls.indexOf(' nav') !== -1 || cls === 'nav') return 'nav';
    if (cls.indexOf('hero') !== -1)         return 'hero';
    if (id === 'trailer' || cls.indexOf('trailer') !== -1) return 'trailer';
    if (cls.indexOf('post-trailer') !== -1) return 'post_trailer';
    if (cls.indexOf('ecosystem') !== -1)    return 'ecosystem';
    if (cls.indexOf('result-actions') !== -1 || cls.indexOf('result-audiobook') !== -1) return 'result';
    if (cls.indexOf('footer') !== -1)       return 'footer';
    if (node.tagName === 'SECTION' && node.id) return node.id;
    node = node.parentElement;
  }
  return 'page';
}

/* ── [ANALYTICS] Quiz CTA click — quiz_start_click ────────────────────────────
   Fires when user clicks any link pointing toward the quiz pages.
   This is a CLICK event, not a quiz start. It fires on the page BEFORE the quiz.
   Dedup: none needed — each click is a distinct user intent signal.
   ─────────────────────────────────────────────────────────────────────────── */
function _initQuizCtaTracking() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest ? e.target.closest('a[href]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';

    var isFrequencyFinder = href.indexOf('consciousness-quiz.html') !== -1;
    var isSignalActivation = href.indexOf('quiz.html') !== -1 &&
                             href.indexOf('consciousness-quiz.html') === -1;

    if (!isFrequencyFinder && !isSignalActivation) return;

    // [ANALYTICS] quiz_start_click
    pushIwrEvent('quiz_start_click', {
      quiz_name:    isFrequencyFinder ? 'frequency_finder' : 'signal_activation',
      cta_text:     (el.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 100),
      cta_location: _getCtaLocation(el)
    });
  }, true);
}

/* ── [ANALYTICS] CTA click — legacy data-cta tracking ────────────────────────
   Still active for any element that has a data-cta attribute.
   ─────────────────────────────────────────────────────────────────────────── */
function _initCtaTracking() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest ? e.target.closest('[data-cta]') : null;
    if (!el) return;
    pushIwrEvent('cta_click', {
      cta_name:        el.getAttribute('data-cta') || '',
      cta_destination: el.getAttribute('href') || '',
      cta_position:    el.getAttribute('data-pos') || '',
      page_type:       (document.body && document.body.dataset.page) || ''
    });
  }, true);
}

/* ── [ANALYTICS] Outbound + audiobook + checkout click tracking ───────────────
   For helloaudio.fm links, fires THREE events in sequence:
     1. audiobook_cta_click — intent: user wants the audiobook
     2. checkout_click      — intent: user clicked an outbound purchase link
     3. audiobook_click     — legacy event name kept for existing GTM triggers
   For other outbound links: substack_click, builders_path_click, outbound_click.
   ─────────────────────────────────────────────────────────────────────────── */
function _initOutboundTracking() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest ? e.target.closest('a[href]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    var ctaText = (el.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 100);
    var loc = _getCtaLocation(el);

    // HelloAudio / audiobook purchase links
    if (href.indexOf('helloaudio.fm') !== -1) {
      // [ANALYTICS] audiobook_cta_click
      pushIwrEvent('audiobook_cta_click', {
        cta_text:     ctaText,
        cta_location: loc
      });
      // [ANALYTICS] checkout_click
      pushIwrEvent('checkout_click', {
        destination:  'hello_audio',
        offer:        'core_audiobook',
        outbound_url: href
      });
      // Legacy event kept for backward GTM compat
      pushIwrEvent('audiobook_click', {
        cta_destination: href,
        cta_name:        ctaText,
        page_type:       (document.body && document.body.dataset.page) || ''
      });
      return; // don't also fire generic outbound_click for these
    }

    // Substack
    if (href.indexOf('rickbroider.substack.com') !== -1) {
      pushIwrEvent('substack_click', {
        cta_destination: href,
        cta_name: ctaText,
        page_type: (document.body && document.body.dataset.page) || ''
      });
    }

    // Builder's Path
    if (href.indexOf('stopthecollapse.com') !== -1) {
      pushIwrEvent('builders_path_click', {
        cta_destination: href,
        cta_name: ctaText,
        page_type: (document.body && document.body.dataset.page) || ''
      });
    }

    // Internal quiz links — signal_activation_click legacy event
    if (href.indexOf('quiz.html') !== -1 && href.indexOf('consciousness-quiz.html') === -1) {
      pushIwrEvent('signal_activation_click', {
        cta_destination: href,
        cta_name: ctaText,
        page_type: (document.body && document.body.dataset.page) || ''
      });
      return;
    }

    // Book preview
    if (href.indexOf('book-preview.html') !== -1) {
      pushIwrEvent('free_preview_click', {
        cta_destination: href,
        cta_name: ctaText,
        page_type: (document.body && document.body.dataset.page) || ''
      });
      return;
    }

    // Generic outbound — anything leaving the domain
    if (href.indexOf('http') === 0 &&
        href.indexOf('iwasready.com') === -1 &&
        href.indexOf(window.location.hostname) === -1) {
      pushIwrEvent('outbound_click', {
        cta_destination: href,
        cta_name: ctaText,
        page_type: (document.body && document.body.dataset.page) || ''
      });
    }
  }, true);
}

/* ── [ANALYTICS] Video / trailer tracking ─────────────────────────────────────
   Hooks onto the first <video> element found.
   Fires trailer_play on first play, milestones at 25/50/75%, trailer_complete.
   Also fires audio_play (spec event name) alongside trailer_play.
   ─────────────────────────────────────────────────────────────────────────── */
function _initVideoTracking() {
  var video = document.querySelector('video');
  if (!video) return;
  var fired = { play: false, 25: false, 50: false, 75: false, complete: false };

  video.addEventListener('play', function() {
    if (!fired.play) {
      fired.play = true;
      // [ANALYTICS] audio_play — spec-required event name for any media play
      pushIwrEvent('audio_play', {
        audio_name: 'trailer_video'
      });
      // Legacy event name for existing GTM triggers
      pushIwrEvent('trailer_play', { page_type: 'home' });
    }
  });

  video.addEventListener('timeupdate', function() {
    if (!video.duration) return;
    var pct = (video.currentTime / video.duration) * 100;
    [25, 50, 75].forEach(function(m) {
      if (!fired[m] && pct >= m) {
        fired[m] = true;
        pushIwrEvent('trailer_milestone', { milestone: m + '%', page_type: 'home' });
      }
    });
  });

  video.addEventListener('ended', function() {
    if (!fired.complete) {
      fired.complete = true;
      pushIwrEvent('trailer_complete', { page_type: 'home' });
    }
  });
}

/* ── [ANALYTICS] Audio element tracking ───────────────────────────────────────
   Hooks onto <audio> elements (the custom audio player on homepage).
   Fires audio_play once per page load. Pausing and resuming does NOT re-fire.
   window.__iwrAudioPlayed tracks which audio IDs have already fired.
   ─────────────────────────────────────────────────────────────────────────── */
function _initAudioTracking() {
  var audios = document.querySelectorAll('audio');
  if (!audios.length) return;

  window.__iwrAudioPlayed = window.__iwrAudioPlayed || {};

  audios.forEach(function(audio) {
    var audioId = audio.id || audio.src || 'audio_unknown';

    audio.addEventListener('play', function() {
      if (window.__iwrAudioPlayed[audioId]) return; // already fired this session
      window.__iwrAudioPlayed[audioId] = true;

      var audioName = audio.getAttribute('data-audio-name') ||
                      audio.id ||
                      'trailer_audio';

      // [ANALYTICS] audio_play
      pushIwrEvent('audio_play', {
        audio_name: audioName
      });
    });
  });
}

// ── Attribution payload for form submissions ──────────────────────────────────
function getFormAttribution(extra) {
  var o = _readAttr(_ATTR_ORIG);
  var l = _readAttr(_ATTR_LAST);
  return Object.assign({
    orig_source:   o.utm_source   || '',
    orig_medium:   o.utm_medium   || '',
    orig_campaign: o.utm_campaign || '',
    orig_content:  o.utm_content  || '',
    last_source:   l.utm_source   || '',
    last_medium:   l.utm_medium   || '',
    last_campaign: l.utm_campaign || '',
    last_content:  l.utm_content  || '',
    page_url:      window.location.href,
    timestamp:     new Date().toISOString(),
    session_entry: _getEntryPage()
  }, extra || {});
}

// ── Expose globals ────────────────────────────────────────────────────────────
window.pushIwrEvent       = pushIwrEvent;
window.trackEvent         = trackEvent;
window.isPaidTrafficMode  = isPaidTrafficMode;
window.getFormAttribution = getFormAttribution;

// ── Boot ──────────────────────────────────────────────────────────────────────
(function boot() {
  _captureUTMs();

  document.addEventListener('DOMContentLoaded', function() {
    _initCtaTracking();
    _initQuizCtaTracking();   // [ANALYTICS] quiz_start_click
    _initOutboundTracking();  // [ANALYTICS] audiobook_cta_click, checkout_click
    _initVideoTracking();     // [ANALYTICS] audio_play (video), trailer_play
    _initAudioTracking();     // [ANALYTICS] audio_play (audio element)

    var params = new URLSearchParams(window.location.search);
    pushIwrEvent('page_view', {
      page_type:       (document.body && document.body.dataset.page) || '',
      page_url:        window.location.href,
      landing_variant: params.get('lp') || '',
      paid_mode:       isPaidTrafficMode() ? '1' : '0'
    });
  });
})();
