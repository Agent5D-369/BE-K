/* ============================================================
   IWasReady.com — Shared Analytics + Attribution Layer
   analytics.js v1.1  |  GA4: G-ZGMHG7VF66
   Load on every page in <head>, after the Google tag snippet.
   ============================================================ */

'use strict';

// ── Data Layer (shared with gtag.js) ─────────────────────────────────────────
window.dataLayer = window.dataLayer || [];

/**
 * Send a named event to GA4 directly via gtag() and to dataLayer.
 * Works with direct gtag.js — no GTM required.
 */
function trackEvent(name, params) {
  var ctx = _getAttributionContext();
  var combined = Object.assign({}, ctx, params || {});

  // Direct GA4 via gtag (primary path)
  if (typeof gtag === 'function') {
    gtag('event', name, combined);
  }

  // dataLayer push for future GTM compatibility
  window.dataLayer.push(Object.assign({ event: name }, combined));
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

    // Always update last-touch
    localStorage.setItem(_ATTR_LAST, JSON.stringify(hit));

    // First-touch: write once only
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

// ── CTA click tracking ────────────────────────────────────────────────────────
function _initCtaTracking() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest ? e.target.closest('[data-cta]') : null;
    if (!el) return;
    trackEvent('cta_click', {
      cta_name:        el.getAttribute('data-cta') || '',
      cta_destination: el.getAttribute('href') || '',
      cta_position:    el.getAttribute('data-pos') || '',
      page_type:       (document.body && document.body.dataset.page) || ''
    });
  }, true);
}

// ── Outbound click tracking ───────────────────────────────────────────────────
var _OUTBOUND = [
  { match: 'helloaudio.fm',            event: 'audiobook_click'         },
  { match: 'rickbroider.substack.com', event: 'substack_click'          },
  { match: 'stopthecollapse.com',      event: 'builders_path_click'     },
  { match: 'book-preview.html',        event: 'free_preview_click'      },
  { match: 'quiz.html',                event: 'signal_activation_click' }
];

function _initOutboundTracking() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest ? e.target.closest('a[href]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';

    _OUTBOUND.forEach(function(rule) {
      if (href.indexOf(rule.match) !== -1) {
        trackEvent(rule.event, {
          cta_destination: href,
          cta_name: el.getAttribute('data-cta') || rule.event,
          page_type: (document.body && document.body.dataset.page) || ''
        });
      }
    });

    // Generic outbound for anything leaving the domain
    if (href.indexOf('http') === 0 &&
        href.indexOf('iwasready.com') === -1 &&
        href.indexOf(window.location.hostname) === -1) {
      trackEvent('outbound_click', {
        cta_destination: href,
        cta_name: el.getAttribute('data-cta') || '',
        page_type: (document.body && document.body.dataset.page) || ''
      });
    }
  }, true);
}

// ── Video / trailer tracking ──────────────────────────────────────────────────
function _initVideoTracking() {
  var video = document.querySelector('video');
  if (!video) return;
  var fired = { play: false, 25: false, 50: false, 75: false, complete: false };
  video.addEventListener('play', function() {
    if (!fired.play) { fired.play = true; trackEvent('trailer_play', { page_type: 'home' }); }
  });
  video.addEventListener('timeupdate', function() {
    if (!video.duration) return;
    var pct = (video.currentTime / video.duration) * 100;
    [25, 50, 75].forEach(function(m) {
      if (!fired[m] && pct >= m) {
        fired[m] = true;
        trackEvent('trailer_milestone', { milestone: m + '%', page_type: 'home' });
      }
    });
  });
  video.addEventListener('ended', function() {
    if (!fired.complete) {
      fired.complete = true;
      trackEvent('trailer_complete', { page_type: 'home' });
    }
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
window.trackEvent         = trackEvent;
window.isPaidTrafficMode  = isPaidTrafficMode;
window.getFormAttribution = getFormAttribution;

// ── Boot ──────────────────────────────────────────────────────────────────────
(function boot() {
  _captureUTMs();

  document.addEventListener('DOMContentLoaded', function() {
    _initCtaTracking();
    _initOutboundTracking();
    _initVideoTracking();

    var params = new URLSearchParams(window.location.search);
    trackEvent('page_view', {
      page_type:       (document.body && document.body.dataset.page) || '',
      page_url:        window.location.href,
      landing_variant: params.get('lp') || '',
      paid_mode:       isPaidTrafficMode() ? '1' : '0'
    });
  });
})();
