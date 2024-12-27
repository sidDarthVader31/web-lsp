document.addEventListener("DOMContentLoaded", function () {
  const myButton = document.getElementById("startLsp");
  myButton.addEventListener('click', async () => {
  console.log(`received an event of click on our button`)
  alert('button clicked yo')
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  console.log(`tablll::`, tab)

  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: startTypingDetection
  });
  });
});


function startTypingDetection() {
  console.log('Detection started');
  document.addEventListener('keyup', function(event) {
    console.log('Typing detected in:', event.target.tagName);
    console.log(`hey` )
    console.log(`data:`, event.key)
    // }
  });
}
