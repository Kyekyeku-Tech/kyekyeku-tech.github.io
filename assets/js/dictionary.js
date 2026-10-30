"use strict";

const dictionaryForm = document.getElementById("lookup-form");
const wordInput = document.getElementById("word-input");
const dictionaryStatus = document.getElementById("dictionary-status");
const wordResult = document.getElementById("word-result");
const grammarForm = document.getElementById("grammar-form");
const grammarInput = document.getElementById("grammar-input");
const grammarStatus = document.getElementById("grammar-status");
const grammarResult = document.getElementById("grammar-result");
const grammarIssues = document.getElementById("grammar-issues");
const applyFixesButton = document.getElementById("apply-fixes");
const characterCount = document.getElementById("character-count");

let localDictionary = {};
let localDictionaryError = false;
let currentPronunciation = "";
let currentAudio = "";
let checkedText = "";
let currentMatches = [];

fetch("./words.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Dictionary data request failed (${response.status}).`);
    }
    return response.json();
  })
  .then((data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Dictionary data has an unexpected format.");
    }
    localDictionary = data;
  })
  .catch((error) => {
    localDictionaryError = true;
    console.error("Could not load the local dictionary:", error);
  });

dictionaryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  lookupWord();
});

document.getElementById("pronounce-button").addEventListener("click", () => {
  if (currentAudio) {
    const pronunciation = new Audio(currentAudio);
    pronunciation.play().catch(() => {
      setStatus(dictionaryStatus, "Audio pronunciation could not be played. Try the browser's voice instead.", "error");
    });
    return;
  }

  const phrase = currentPronunciation || document.getElementById("result-word").textContent;
  if ("speechSynthesis" in window && phrase) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 0.9;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  } else {
    setStatus(dictionaryStatus, "Pronunciation is not available in this browser.", "error");
  }
});

grammarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkGrammar();
});

grammarInput.addEventListener("input", updateCharacterCount);
grammarIssues.addEventListener("click", (event) => {
  const button = event.target.closest("[data-fix-index]");
  if (!button) return;
  const match = currentMatches[Number(button.dataset.fixIndex)];
  const replacement = match && match.replacements && match.replacements[Number(button.dataset.replacementIndex)];
  if (match && replacement) {
    applyGrammarFixes([{ offset: match.offset, length: match.length, value: replacement.value }]);
  }
});

applyFixesButton.addEventListener("click", () => {
  const fixes = currentMatches
    .map((match) => ({ match, replacement: match.replacements && match.replacements[0] }))
    .filter(({ match, replacement }) => replacement && typeof replacement.value === "string")
    .map(({ match, replacement }) => ({ offset: match.offset, length: match.length, value: replacement.value }));
  applyGrammarFixes(fixes);
});

function setStatus(element, message, state) {
  element.textContent = message;
  if (state) {
    element.dataset.state = state;
  } else {
    delete element.dataset.state;
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

async function lookupWord() {
  const query = wordInput.value.trim();
  if (!query) return;

  dictionaryStatus.textContent = "";
  delete dictionaryStatus.dataset.state;
  wordResult.hidden = true;
  currentPronunciation = "";

  const localEntry = localDictionary[query.toLowerCase()];
  if (localEntry) {
    showLocalEntry(query, localEntry);
    return;
  }

  setStatus(dictionaryStatus, "Searching the English dictionary...");
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      if (response.status === 404) throw new Error("No definition found for that word. Try another spelling.");
      throw new Error(`The dictionary service returned an error (${response.status}).`);
    }
    const entries = await response.json();
    const entry = entries[0];
    if (!entry || !Array.isArray(entry.meanings)) {
      throw new Error("The dictionary did not return a usable definition.");
    }
    showRemoteEntry(entry);
    setStatus(dictionaryStatus, "");
  } catch (error) {
    setStatus(
      dictionaryStatus,
      `${error.message}${localDictionaryError ? " Local word list is also unavailable." : ""}`,
      "error"
    );
  }
}

function showLocalEntry(word, entry) {
  document.getElementById("result-word").textContent = word;
  document.getElementById("result-phonetic").textContent = "";
  document.getElementById("result-definitions").replaceChildren();
  document.getElementById("result-related").hidden = true;
  document.getElementById("result-source").textContent = "Kyekyeku Tech word collection";
  currentAudio = "";

  const group = createElement("section", "definition-group");
  const heading = createElement("h4", "", "Meaning");
  const list = createElement("ol", "definition-list");
  list.append(createElement("li", "", entry.meaning || "No definition is available yet."));
  group.append(heading, list);

  if (entry.usage) {
    const usage = createElement("p", "example", `Example: ${entry.usage.replace(/^Example:\s*/i, "")}`);
    list.firstElementChild.append(usage);
  }

  document.getElementById("result-definitions").append(group);
  currentPronunciation = word;
  wordResult.hidden = false;
  setStatus(dictionaryStatus, "Definition found in the Kyekyeku Tech word collection.", "success");
}

function showRemoteEntry(entry) {
  document.getElementById("result-word").textContent = entry.word || wordInput.value.trim();
  const phonetic = entry.phonetic || (entry.phonetics || []).find((item) => item.text)?.text || "";
  document.getElementById("result-phonetic").textContent = phonetic;
  document.getElementById("result-definitions").replaceChildren();
  document.getElementById("result-source").textContent = "Definitions provided by the Free Dictionary API.";

  const audio = (entry.phonetics || []).find((item) => item.audio)?.audio;
  currentAudio = audio && audio.startsWith("https://") ? audio : "";
  currentPronunciation = entry.word || wordInput.value.trim();

  const definitions = document.getElementById("result-definitions");
  const related = new Set();
  (entry.meanings || []).slice(0, 4).forEach((meaning) => {
    const group = createElement("section", "definition-group");
    group.append(createElement("h4", "", meaning.partOfSpeech || "Meaning"));
    const list = createElement("ol", "definition-list");
    (meaning.definitions || []).slice(0, 3).forEach((definition) => {
      const item = createElement("li", "", definition.definition || "No definition provided.");
      if (definition.example) item.append(createElement("span", "example", `Example: ${definition.example}`));
      list.append(item);
      (definition.synonyms || []).forEach((word) => related.add(word));
    });
    (meaning.synonyms || []).forEach((word) => related.add(word));
    if (list.childElementCount) group.append(list);
    definitions.append(group);
  });

  const relatedSection = document.getElementById("result-related");
  const relatedList = document.getElementById("related-list");
  relatedList.replaceChildren();
  Array.from(related).slice(0, 12).forEach((word) => {
    relatedList.append(createElement("span", "word-chip", word));
  });
  relatedSection.hidden = relatedList.childElementCount === 0;
  wordResult.hidden = false;
}

async function checkGrammar() {
  const text = grammarInput.value.trim();
  if (!text) {
    setStatus(grammarStatus, "Enter a sentence or paragraph to check.", "error");
    return;
  }

  const submitButton = document.getElementById("check-grammar");
  submitButton.disabled = true;
  applyFixesButton.hidden = true;
  grammarResult.hidden = true;
  setStatus(grammarStatus, "Checking spelling and grammar...");

  try {
    const body = new URLSearchParams({ text, language: "en-US" });
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });
    if (!response.ok) {
      throw new Error(`The grammar service returned an error (${response.status}).`);
    }
    const data = await response.json();
    if (!Array.isArray(data.matches)) {
      throw new Error("The grammar service returned an unexpected response.");
    }

    checkedText = text;
    currentMatches = data.matches;
    renderGrammarMatches(data.matches, text);
    setStatus(grammarStatus, "Check complete.", "success");
  } catch (error) {
    setStatus(grammarStatus, `${error.message} Please try again in a moment.`, "error");
  } finally {
    submitButton.disabled = false;
  }
}

function renderGrammarMatches(matches, text) {
  const fixableMatches = matches
    .map((match, index) => ({ match, index }))
    .filter(({ match }) => match.replacements && match.replacements.length > 0);
  grammarIssues.replaceChildren();
  document.getElementById("grammar-summary").textContent = matches.length
    ? `${matches.length} suggestion${matches.length === 1 ? "" : "s"} to review`
    : "Your text looks good.";
  applyFixesButton.hidden = fixableMatches.length === 0;
  grammarResult.hidden = false;

  matches.forEach((match, index) => {
    const item = createElement("li", "issue-card");
    item.append(createElement("p", "issue-message", match.message || "Review this part of your writing."));
    const context = match.context || {};
    if (typeof context.text === "string") {
      item.append(createElement("p", "issue-context", `“…${context.text}…”`));
    } else if (Number.isInteger(match.offset) && Number.isInteger(match.length)) {
      item.append(createElement("p", "issue-context", text.slice(match.offset, match.offset + match.length)));
    }

    const fixes = (match.replacements || []).slice(0, 3);
    if (fixes.length) {
      const fixList = createElement("div", "issue-fixes");
      fixes.forEach((fix, replacementIndex) => {
        const button = createElement("button", "fix-button", fix.value === "" ? "Remove text" : fix.value);
        button.type = "button";
        button.dataset.fixIndex = String(index);
        button.dataset.replacementIndex = String(replacementIndex);
        button.setAttribute("aria-label", `Replace with ${fix.value || "nothing"}`);
        fixList.append(button);
      });
      item.append(fixList);
    }
    grammarIssues.append(item);
  });
}

function applyGrammarFixes(fixes) {
  if (grammarInput.value !== checkedText) {
    setStatus(grammarStatus, "Your text changed after the check. Check it again before applying suggestions.", "error");
    return;
  }

  const orderedFixes = fixes
    .filter((fix) => fix && Number.isInteger(fix.offset) && Number.isInteger(fix.length) && typeof fix.value === "string")
    .sort((left, right) => right.offset - left.offset);
  let text = checkedText;
  let previousStart = Infinity;

  orderedFixes.forEach((fix) => {
    if (fix.offset + fix.length > previousStart) return;
    text = `${text.slice(0, fix.offset)}${fix.value}${text.slice(fix.offset + fix.length)}`;
    previousStart = fix.offset;
  });

  grammarInput.value = text;
  updateCharacterCount();
  grammarResult.hidden = true;
  setStatus(grammarStatus, "Suggestions applied. Check your updated text to review any remaining issues.", "success");
}

function updateCharacterCount() {
  characterCount.textContent = `${grammarInput.value.length.toLocaleString()} / 20,000`;
}

updateCharacterCount();
