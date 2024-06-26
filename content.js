const allowedDomains = ["chat.openai.com"];

console.log(window.location.hostname);

if (allowedDomains.includes(window.location.hostname)) {
  let promptHistory = [];
  let historyIndex = -1;
  let currentPrompt = "";
  let currentChatId = "";
  let isEditing = false;
  let tempFirstPrompt = "";

  // Updated function to validate chat ID format
  function isValidChatId(chatId) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(chatId);
  }

  function getChatId() {
    const pathSegments = window.location.pathname.split("/");
    const potentialChatId = pathSegments.pop();
    return isValidChatId(potentialChatId) ? potentialChatId : null;
  }

  function resetHistoryVariables() {
    promptHistory = [];
    historyIndex = -1;
  }

  function loadHistory() {
    const chatId = getChatId();
    if (chatId && chatId !== currentChatId) {
      console.log("Detected Chat Change:", chatId);
      resetHistoryVariables();
      currentChatId = chatId;
      const history = localStorage.getItem(`promptHistory_${chatId}`);
      if (history) {
        promptHistory = JSON.parse(history);
      }
      // Check if there's a temporarily stored first prompt and add it to history
      if (tempFirstPrompt) {
        promptHistory.push(tempFirstPrompt);
        // Save the updated history with the first prompt
        saveHistory();
        tempFirstPrompt = "";
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
    } else if (!chatId && currentPrompt) {
      // No chat ID yet, store the first prompt temporarily
      tempFirstPrompt = currentPrompt;
    }
  }

  loadHistory();

  // Function to periodically check for chat ID changes
  function checkForChatChange() {
    const chatId = getChatId();
    if (chatId && chatId !== currentChatId) {
      loadHistory();
    }
  }

  // Set an interval to check for the chat ID every 500 milliseconds
  setInterval(checkForChatChange, 500);

  function getInputArea() {
    return document.getElementById("prompt-textarea");
  }

  // Function to adjust textarea height to fit content
  function adjustTextareaHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  // Event listener for input events in the textarea
  document.addEventListener("input", (e) => {
    const inputArea = getInputArea();
    if (inputArea && e.target === inputArea) {
      currentPrompt = inputArea.value.trim();
      adjustTextareaHeight(inputArea);

      // Check if the textarea is empty after the input event
      if (currentPrompt === "") {
        isEditing = false;
      } else {
        isEditing = true;
      }
    }
  });

  // Event listener for keydown events in the textarea
  document.addEventListener("keydown", (e) => {
    const inputArea = getInputArea();
    if (!inputArea) return;

    if (e.key === "Enter" && !e.shiftKey) {
      if (currentPrompt) {
        if (
          !promptHistory.length ||
          promptHistory[promptHistory.length - 1] !== currentPrompt
        ) {
          // Save only if not a duplicate
          promptHistory.push(currentPrompt);
          // Save updated history to localStorage
          saveHistory();
        }
        historyIndex = -1;
        currentPrompt = "";
        inputArea.value = "";
        isEditing = false;
        adjustTextareaHeight(inputArea);
      }
      e.preventDefault();
    } else if (!isEditing && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      // Only navigate through history if not actively editing
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
        inputArea.value =
          promptHistory[promptHistory.length - 1 - historyIndex];
        currentPrompt = promptHistory[promptHistory.length - 1 - historyIndex];
        adjustTextareaHeight(inputArea);
      }

      e.preventDefault();
    }
    // else if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
    //   // If any other key is pressed, consider the user to be editing
    //   isEditing = true;
    // }
  });

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.action === "getPrompts") {
        const chatId = getChatId();
        if (chatId) {
          const history = localStorage.getItem(`promptHistory_${chatId}`);
          const prompts = history ? JSON.parse(history) : [];
          sendResponse({ prompts: prompts, chatId: chatId });
        }
      }
    },
  );
} else {
  console.log("This extension is not allowed on the current domain.");
}
