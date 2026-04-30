// Claude Blocker - v3 (nuclear approach: hide entire post body, inject card)

const FACTS_API = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

const FALLBACK_FACTS = [
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "Oxford University is older than the Aztec Empire.",
  "The shortest war in history lasted 38–45 minutes — Britain vs Zanzibar, 1896.",
  "Woolly mammoths were still alive when the Great Pyramid was being built.",
  "Nintendo was founded in 1889, originally as a playing card company.",
  "A day on Venus is longer than a year on Venus.",
  "The Eiffel Tower grows about 15cm taller in summer due to thermal expansion.",
  "Honey never spoils — 3,000-year-old honey found in Egyptian tombs was still edible.",
  "Scotland's national animal is the unicorn.",
  "The word 'muscle' comes from Latin for 'little mouse' — Romans thought flexing muscles looked like mice under skin.",
];

async function fetchFact() {
  try {
    const res = await fetch(FACTS_API);
    const data = await res.json();
    return data.text || randomFallback();
  } catch {
    return randomFallback();
  }
}

function randomFallback() {
  return FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
}

function containsClaude(text) {
  return /\bclaude\b/i.test(text);
}

function buildCard(fact, onReveal) {
  const card = document.createElement("div");
  card.className = "cb-card";
  card.innerHTML = `
    <div class="cb-fact-area">
      <div class="cb-header">
        <span class="cb-icon">🙈</span>
        <span class="cb-label">Claude Detected · Post Hidden</span>
      </div>
      <div class="cb-divider"></div>
      <p class="cb-fact">"${fact}"</p>
      <span class="cb-source">📚 uselessfacts.jsph.pl</span>
    </div>
    <button class="cb-reveal-btn">
      <span class="cb-reveal-icon">👁️</span>
      <span class="cb-reveal-text">Reveal post</span>
    </button>
  `;

  let revealed = false;
  card.querySelector(".cb-reveal-btn").addEventListener("click", () => {
    revealed = !revealed;
    card.querySelector(".cb-reveal-icon").textContent = revealed ? "🔒" : "👁️";
    card.querySelector(".cb-reveal-text").textContent = revealed ? "Hide post" : "Reveal post";
    onReveal(revealed);
  });

  return card;
}

const processed = new WeakSet();

async function processPost(postEl) {
  if (processed.has(postEl)) return;

  // Grab all text inside the post
  const fullText = postEl.innerText || "";
  if (!containsClaude(fullText)) return;

  processed.add(postEl);

  const fact = await fetchFact();

  // Find the actor (author row) — we keep this visible
  const actorEl = postEl.querySelector(
    ".update-components-actor, .feed-shared-actor"
  );

  // Find ALL children of the post's inner container
  // We'll hide everything except the actor, and inject our card
  const innerContainer =
    postEl.querySelector(".feed-shared-update-v2__control-menu-container") ||
    postEl.querySelector(".feed-shared-update-v2") ||
    postEl;

  // Collect all direct children that are NOT the actor
  const allChildren = [...innerContainer.children];
  const nonActorChildren = allChildren.filter(
    (el) => !el.contains(actorEl) && el !== actorEl
  );

  // Create a wrapper to hold hidden content (for reveal)
  const hiddenWrapper = document.createElement("div");
  hiddenWrapper.className = "cb-hidden-content";
  hiddenWrapper.style.display = "none";

  // Move all non-actor children into the hidden wrapper
  nonActorChildren.forEach((el) => {
    hiddenWrapper.appendChild(el);
  });

  // Build and insert our card + the hidden wrapper
  const card = buildCard(fact, (revealed) => {
    hiddenWrapper.style.display = revealed ? "block" : "none";
    card.style.display = revealed ? "none" : "block";
  });

  innerContainer.appendChild(card);
  innerContainer.appendChild(hiddenWrapper);
}

function scanPosts() {
  document.querySelectorAll(".occludable-update").forEach(processPost);
}

// Watch for new posts as LinkedIn infinite-scrolls
const observer = new MutationObserver(() => scanPosts());
observer.observe(document.body, { childList: true, subtree: true });

// Initial scan
scanPosts();
