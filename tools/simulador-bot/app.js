const messages = document.querySelector("#messages");
const choices = document.querySelector("#choices");
const previewEmpty = document.querySelector("#preview-empty");
const payload = document.querySelector("#payload");
const payloadCode = payload.querySelector("code");
const resetButton = document.querySelector("#reset");

const DEMO_SENDER = "simulador-001";
let nextDemoMessage = 1;

const moodOptions = [
  { label: "Bem", value: "bem" },
  { label: "Normal", value: "normal" },
  { label: "Cansada", value: "cansada" },
  { label: "Desconfortável", value: "desconfortavel" },
];

const fictionalComplaints = [
  { label: "Cólicas leves pela manhã", value: "Exemplo fictício: senti cólicas leves pela manhã." },
  { label: "Desconforto abdominal leve", value: "Exemplo fictício: percebi um desconforto abdominal leve depois do almoço." },
  { label: "Dor de cabeça após um dia longo", value: "Exemplo fictício: tive dor de cabeça depois de um dia longo." },
];

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

function makeButton(label, onClick, variant = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `choice-button ${variant}`.trim();
  button.textContent = label;
  button.addEventListener("click", onClick, { once: true });
  return button;
}

function showMainActions() {
  choices.replaceChildren(
    makeButton("Registrar humor", startMoodFlow, "primary"),
    makeButton("Registrar queixa", startComplaintFlow, "secondary"),
  );
}

function isoWithTimezone(date = new Date()) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offset = `${sign}${String(Math.floor(absoluteOffset / 60)).padStart(2, "0")}:${String(absoluteOffset % 60).padStart(2, "0")}`;
  const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 19);
  return `${localDateTime}${offset}`;
}

function buildDemoEvent(tipo, field, value) {
  const sequence = String(nextDemoMessage++).padStart(3, "0");
  return {
    mensagemId: `demo-${sequence}`,
    remetenteRef: DEMO_SENDER,
    recebidaEm: isoWithTimezone(),
    tipo,
    [field]: value,
  };
}

function showPreview(event) {
  previewEmpty.hidden = true;
  payload.hidden = false;
  payloadCode.textContent = JSON.stringify(event, null, 2);
}

function finishSimulation(event, description) {
  showPreview(event);
  addMessage("bot", `${description} A prévia fictícia foi montada, mas não foi enviada nem salva no Histórico.`);
  showMainActions();
}

function startMoodFlow() {
  addMessage("user", "Registrar humor");
  addMessage("bot", "Como você está se sentindo agora? Escolha uma opção.");
  choices.replaceChildren(...moodOptions.map(({ label, value }) => makeButton(label, () => {
    addMessage("user", label);
    const event = buildDemoEvent("HUMOR", "humor", value);
    finishSimulation(event, "Simulação de humor pronta.");
  })));
}

function startComplaintFlow() {
  addMessage("user", "Registrar queixa");
  addMessage("bot", "Escolha um exemplo fictício para esta simulação.");
  choices.replaceChildren(...fictionalComplaints.map(({ label, value }) => makeButton(label, () => {
    addMessage("user", label);
    const event = buildDemoEvent("QUEIXA", "relato", value);
    finishSimulation(event, "Simulação de queixa pronta.");
  })));
}

function resetConversation() {
  messages.replaceChildren();
  choices.replaceChildren();
  payloadCode.textContent = "";
  payload.hidden = true;
  previewEmpty.hidden = false;
  nextDemoMessage = 1;
  addMessage("bot", "Olá! Sou o simulador do CommitAndPray. Posso ajudar a registrar um humor ou uma queixa fictícia.");
  addMessage("bot", "O que você gostaria de fazer?");
  showMainActions();
}

resetButton.addEventListener("click", resetConversation);
resetConversation();
