// Mutation observer
let obeserver;
let targetNode;
const config = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true,
};

const lastMessageMap = new Map();
// const topChatXpath = "(//div[@aria-label='Chats']//a[@aria-current])[1]";
const baseXpath = `((//div[@aria-label='Chats']//a[@aria-current])[1]//span[@dir='auto'])`;
const messageXpath = `${baseXpath}[2]`;

const getChat = (mutationList, obeserver) => {
  // TODO: Check why this log is triggered when there is a change of sender but can't log the chat
  console.log('TRIGGERED');

  const fromXpath = `${baseXpath}[1]`;
  const from = document.evaluate(
    fromXpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue.textContent;

  const message = document.evaluate(
    messageXpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue.textContent;

  if (lastMessageMap.has(from) && lastMessageMap.get(from) === message) {
    return;
  }

  lastMessageMap.set(from, message);

  console.log(`From: ${from}`);
  console.log(message);
  console.log('-----');
};

const setupObserver = () => {
  console.log(`Setting up obeserver...`);
  targetNode = document.evaluate(
    messageXpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  obeserver = new MutationObserver(getChat);
};

const startObserver = () => {
  console.log(`Starting observer...`);
  obeserver.observe(targetNode, config);
};

const stopObserver = () => {
  console.log(`Stopping observer...`);
  obeserver.disconnect();
};

const startObs = () => {
  getChat(null, null);
  setupObserver();
  startObserver();
};

(() => {
  console.log(`****** Setting listener ******`);
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(`****** Received a message ******`);
      console.dir(request);
      if (request.status === 'enabled') {
        startObs();
      } else {
        stopObserver();
      }

      sendResponse();
    }
  );
})();
