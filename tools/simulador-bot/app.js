const messages = document.querySelector("#messages");
const choices = document.querySelector("#choices");
const previewEmpty = document.querySelector("#preview-empty");
const payload = document.querySelector("#payload");
const payloadCode = payload.querySelector("code");
const resetButton = document.querySelector("#reset");

const conversation = BotConversation.createConversation({
  responseAdapter: BotConversation.createSimulatedResponseAdapter(),
});

function addMessage(kind, text) {
  const item = document.createElement("li");
  const bubble = document.createElement("div");
  item.className = `message ${kind}`;
  bubble.className = "bubble";
  bubble.textContent = text;
  item.append(bubble);
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}

function addMessages(items) {
  items.forEach(({ kind, text }) => addMessage(kind, text));
}

function makeButton(label, onClick, variant = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `choice-button ${variant}`.trim();
  button.textContent = label;
  button.addEventListener("click", onClick, { once: true });
  return button;
}

function showMainActions() {
  const handlers = {
    mood: startMoodFlow,
    complaint: startComplaintFlow,
  };

  choices.replaceChildren(...conversation.mainActions().map(({ label, value }) => (
    makeButton(label, handlers[value], value === "mood" ? "primary" : "secondary")
  )));
}

function showOptions(flow, result) {
  addMessages(result.messages);
  choices.replaceChildren(...result.options.map(({ label, value }) => makeButton(label, () => submitSelection(flow, value, label))));
}

function showPreview(event) {
  previewEmpty.hidden = true;
  payload.hidden = false;
  payloadCode.textContent = JSON.stringify(event, null, 2);
}

async function submitSelection(flow, value, label) {
  choices.replaceChildren();

  try {
    const result = flow === "mood"
      ? await conversation.submitMood(value)
      : await conversation.submitComplaint(value);
    addMessages(result.messages);
    showPreview(result.event);
  } catch {
    addMessage("user", label);
    addMessage("bot", "Não foi possível concluir a simulação. Reinicie a conversa para tentar novamente.");
  }

  showMainActions();
}

function startMoodFlow() {
  showOptions("mood", conversation.startMood());
}

function startComplaintFlow() {
  showOptions("complaint", conversation.startComplaint());
}

function resetConversation() {
  conversation.reset();
  messages.replaceChildren();
  choices.replaceChildren();
  payloadCode.textContent = "";
  payload.hidden = true;
  previewEmpty.hidden = false;
  addMessages(conversation.welcome());
  showMainActions();
}

resetButton.addEventListener("click", resetConversation);
resetConversation();
