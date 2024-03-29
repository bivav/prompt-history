// document.addEventListener("DOMContentLoaded", function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     // Request the prompt history for the current tab from the background script
//     chrome.runtime.sendMessage({
//       action: "getPromptsForCurrentTab",
//       tabId: tabs[0].id,
//     });
//   });
// });

// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "displayPrompts") {
//     const promptList = document.getElementById("promptList");
//     promptList.innerHTML = ""; // Clear existing list items

//     message.prompts.forEach((prompt) => {
//       const li = document.createElement("li");
//       li.textContent = prompt;
//       promptList.appendChild(li);
//     });
//   }
// });

// document.addEventListener('DOMContentLoaded', function() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.runtime.sendMessage({action: "getPromptsForCurrentTab", tabId: tabs[0].id});
//     });
// });

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.action === "displayPrompts") {
//         const chatIdValue = document.getElementById('chatIdValue');
//         chatIdValue.textContent = message.chatId; // Update this based on how you receive the chat ID

//         const promptsTable = document.getElementById('promptsTable');
//         message.prompts.forEach(prompt => {
//             const row = promptsTable.insertRow(-1);
//             const promptCell = row.insertCell(0);
//             promptCell.textContent = prompt;
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.runtime.sendMessage({
      action: "getPromptsForCurrentTab",
      tabId: tabs[0].id,
    });
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "displayPrompts") {
    const chatIdValue = document.getElementById("chatIdValue");
    chatIdValue.textContent = message.chatId;

    const promptsTable = document
      .getElementById("promptsTable")
      .getElementsByTagName("tbody")[0];
    promptsTable.innerHTML = ""; // Clear existing rows

    message.prompts.forEach((prompt, index) => {
      const row = promptsTable.insertRow();
      const promptCell = row.insertCell(0);
      promptCell.innerHTML = `<div class="prompt">${prompt}</div>`;

      const actionCell = row.insertCell(1);
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("deleteBtn");
      deleteButton.onclick = function () {
        // Implement delete functionality
      };
      actionCell.appendChild(deleteButton);

      // If the prompt is long, add click-to-expand functionality
      if (promptCell.offsetHeight < promptCell.scrollHeight) {
        promptCell.classList.add("clickable");
        promptCell.title = "Click to expand";
        promptCell.onclick = function () {
          this.firstChild.style.webkitLineClamp = "none";
          this.classList.remove("clickable");
          this.title = "";
        };
      }
    });
  }
});
