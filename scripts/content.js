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
const topChatXpath = "(//div[@aria-label='Chats']//a[@aria-current])[1]";
const baseXpath = `${topChatXpath}//span[@dir='auto'])`;

const getChat = (mutationList, obeserver) => {
  console.log('TRIGGERED');
  const baseXpath =
    "((//div[@aria-label='Chats']//a[@aria-current])[1]//span[@dir='auto'])";

  const fromXpath = `${baseXpath}[1]`;
  const messageXpath = `${baseXpath}[2]`;

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

const callback = (mutationList, observer) => {
  console.log(`In callback()`);
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
    } else if (mutation.type === 'attributes') {
      console.log(`The ${mutation.attributeName} attribute was modified.`);
    }
  }
};

const setupObserver = () => {
  console.log(`Setting up obeserver...`);
  targetNode = document.evaluate(
    topChatXpath,
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
