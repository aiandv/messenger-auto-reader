const main = () => {
  console.log('ready!');

  async function sendM(message) {
    console.log('SENDING MESSAGE');
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, message);
  }

  $('#mainCheckbox').change(function () {
    let status;
    if ($(this).is(':checked')) {
      console.log('CHECKED');
      status = 'enabled';
    } else {
      console.log('UNCHECKED');
      status = 'disabled';
    }

    sendM({ status });
  });
};

$(document).ready(main);
