const main = () => {
  console.log('ready!');

  async function sendM(message) {
    console.log('SENDING MESSAGE');
    const response = await chrome.runtime.sendMessage(message);
  }

  $('#mainCheckbox').change(function () {
    let status;
    if ($(this).is(':checked')) {
      console.log('CHECKED1');
      status = 'enabled';
    } else {
      console.log('UNCHECKED1');
      status = 'disabled';
    }

    sendM({ status });
  });
};

$(document).ready(main);
