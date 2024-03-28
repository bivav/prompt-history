let promptHistory = [];
let historyIndex = -1;
let currentPrompt = "";
let currentChatId = ""; // Track the current chat ID

function getChatId() {
  const pathSegments = window.location.pathname.split("/");
  return pathSegments.pop(); // Get the last segment, which is the chat ID
}

function resetHistoryVariables() {
  promptHistory = [];
  historyIndex = -1;
}

function loadHistory() {
  const chatId = getChatId();
  if (chatId && chatId !== currentChatId) {
    resetHistoryVariables(); // Reset history variables on chat change
    currentChatId = chatId; // Update currentChatId to the new one
    const history = localStorage.getItem(`promptHistory_${chatId}`);
    if (history) {
      promptHistory = JSON.parse(history);
    }
  }
}

function saveHistory() {
  const chatId = getChatId();
  if (chatId) {
    localStorage.setItem(
      `promptHistory_${chatId}`,
      JSON.stringify(promptHistory),
    );
  }
}

// Load history from localStorage on script initialization
loadHistory();

// Listen for URL changes and update the history accordingly
window.addEventListener("popstate", loadHistory);
window.addEventListener("hashchange", loadHistory);

function getInputArea() {
  return document.getElementById("prompt-textarea");
}

document.addEventListener("input", (e) => {
  const inputArea = getInputArea();
  if (inputArea && e.target === inputArea) {
    currentPrompt = inputArea.value.trim();
  }
});

document.addEventListener("keydown", (e) => {
  const inputArea = getInputArea();
  if (!inputArea) return;

  if (e.key === "Enter" && !e.shiftKey) {
    if (currentPrompt) {
      if (
        !promptHistory.length ||
        promptHistory[promptHistory.length - 1] !== currentPrompt
      ) {
        promptHistory.push(currentPrompt); // Save only if not a duplicate
        saveHistory(); // Save updated history to localStorage
      }
      historyIndex = -1;
      currentPrompt = "";
      inputArea.value = "";
    }
    e.preventDefault();
  } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    // Handle navigation through history with arrow keys
    if (e.key === "ArrowUp") {
      if (historyIndex < promptHistory.length - 1) {
        historyIndex++;
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        historyIndex--;
      } else {
        historyIndex = -1;
        inputArea.value = "";
        currentPrompt = "";
      }
    }

    if (historyIndex !== -1) {
      inputArea.value = promptHistory[promptHistory.length - 1 - historyIndex];
      currentPrompt = promptHistory[promptHistory.length - 1 - historyIndex];
    }

    e.preventDefault();
  }
});
