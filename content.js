// This script will run in the context of the web page
let promptHistory = [];
let historyIndex = -1; // Initialize with -1 indicating no history is shown
let currentPrompt = ""; // Variable to hold the current value of the textarea

// Function to safely get the input area
function getInputArea() {
  // Attempt to get the textarea by its ID
  return document.getElementById("prompt-textarea");
}

// Event listener to track every input in the textarea and update currentPrompt
document.addEventListener("input", (e) => {
  const inputArea = getInputArea();
  if (inputArea && e.target === inputArea) {
    currentPrompt = inputArea.value.trim(); // Update currentPrompt with the latest textarea value
  }
});

// Keydown event to handle the Enter key and navigation keys
document.addEventListener("keydown", (e) => {
  const inputArea = getInputArea();

  if (!inputArea) return; // If the input area isn't found, do nothing

  if (e.key === "Enter" && !e.shiftKey) {
    // Handle Enter key press without Shift key
    if (currentPrompt) {
      // Check if currentPrompt has content
      // Add the currentPrompt to the history if it's not empty and not a duplicate of the last entry
      if (
        !promptHistory.length ||
        promptHistory[promptHistory.length - 1] !== currentPrompt
      ) {
        promptHistory.push(currentPrompt); // Add the prompt to the history
        console.log("Prompt saved:", currentPrompt); // Debugging log
      }
      historyIndex = -1; // Reset history index after saving a new prompt
      currentPrompt = ""; // Clear currentPrompt after saving
      inputArea.value = ""; // Clear the textarea
    }
    e.preventDefault(); // Prevent the default action to stop the textarea from being cleared by other means
  } else if (e.key === "ArrowUp") {
    // Handle Up arrow key press
    if (historyIndex === -1 && promptHistory.length > 0) {
      // If no history item is selected and there is history, start from the last item
      historyIndex = promptHistory.length - 1;
    } else if (historyIndex > 0) {
      // If a history item is selected, move up in the history
      historyIndex--;
    }

    if (historyIndex >= 0) {
      // If a valid history index is selected, update the input area with the history item
      inputArea.value = promptHistory[historyIndex];
      e.preventDefault(); // Prevent the default action to keep the cursor in place
    }
  } else if (e.key === "ArrowDown") {
    // Handle Down arrow key press
    if (historyIndex >= 0 && historyIndex < promptHistory.length - 1) {
      // If a history item is selected and it's not the last item, move down in the history
      historyIndex++;
      inputArea.value = promptHistory[historyIndex];
    } else {
      // If the last history item is selected or if navigating past it, clear the selection and the input area
      historyIndex = -1;
      inputArea.value = "";
    }
    e.preventDefault(); // Prevent the default action to keep the cursor in place
  }
});
