(function exposeBotConversation(root, createApi) {
  const api = createApi();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.BotConversation = api;
})(globalThis, function createBotConversationApi() {
  const DEMO_SENDER = "simulador-001";

  const MAIN_ACTIONS = Object.freeze([
    Object.freeze({ label: "Registrar humor", value: "mood" }),
    Object.freeze({ label: "Registrar queixa", value: "complaint" }),
  ]);

  const MOOD_OPTIONS = Object.freeze([
    Object.freeze({ label: "Bem", value: "bem" }),
    Object.freeze({ label: "Normal", value: "normal" }),
    Object.freeze({ label: "Cansada", value: "cansada" }),
    Object.freeze({ label: "Desconfortável", value: "desconfortavel" }),
  ]);

  const FICTIONAL_COMPLAINTS = Object.freeze([
    Object.freeze({ label: "Cólicas leves pela manhã", value: "Exemplo fictício: senti cólicas leves pela manhã." }),
    Object.freeze({ label: "Desconforto abdominal leve", value: "Exemplo fictício: percebi um desconforto abdominal leve depois do almoço." }),
    Object.freeze({ label: "Dor de cabeça após um dia longo", value: "Exemplo fictício: tive dor de cabeça depois de um dia longo." }),
  ]);

  function copyOptions(options) {
    return options.map(({ label, value }) => ({ label, value }));
  }

  function validateSubmission(tipo, value) {
    if (tipo === "HUMOR" && MOOD_OPTIONS.some((option) => option.value === value)) {
      return true;
    }

    if (tipo === "QUEIXA" && FICTIONAL_COMPLAINTS.some((option) => option.value === value)) {
      return true;
    }

    throw new TypeError("A opção não pertence ao fluxo guiado selecionado.");
  }

  function validateEvent(event) {
    if (!event || typeof event !== "object" || Array.isArray(event)) {
      throw new TypeError("O evento precisa ser um objeto.");
    }

    if (typeof event.mensagemId !== "string" || event.mensagemId.length === 0) {
      throw new TypeError("mensagemId é obrigatório.");
    }

    if (typeof event.remetenteRef !== "string" || event.remetenteRef.length === 0) {
      throw new TypeError("remetenteRef é obrigatório.");
    }

    if (
      typeof event.recebidaEm !== "string"
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(event.recebidaEm)
      || Number.isNaN(Date.parse(event.recebidaEm))
    ) {
      throw new TypeError("recebidaEm precisa conter data, hora e fuso.");
    }

    if (event.tipo === "HUMOR") {
      validateSubmission(event.tipo, event.humor);
      if (Object.hasOwn(event, "relato")) {
        throw new TypeError("Um evento de humor não deve conter relato.");
      }
      return true;
    }

    if (event.tipo === "QUEIXA") {
      validateSubmission(event.tipo, event.relato);
      if (Object.hasOwn(event, "humor")) {
        throw new TypeError("Um evento de queixa não deve conter humor.");
      }
      return true;
    }

    throw new TypeError("tipo precisa ser HUMOR ou QUEIXA.");
  }

  function isoWithTimezone(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new TypeError("O relógio precisa fornecer uma data válida.");
    }

    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absoluteOffset = Math.abs(offsetMinutes);
    const offset = `${sign}${String(Math.floor(absoluteOffset / 60)).padStart(2, "0")}:${String(absoluteOffset % 60).padStart(2, "0")}`;
    const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 19);
    return `${localDateTime}${offset}`;
  }

  function createSimulatedResponseAdapter() {
    return Object.freeze({
      respond(event) {
        validateEvent(event);
        return Promise.resolve({
          status: "simulated",
          persisted: false,
          message: "A prévia fictícia foi montada, mas não foi enviada nem salva no Histórico.",
        });
      },
    });
  }

  function createConversation({ responseAdapter = createSimulatedResponseAdapter(), now = () => new Date(), remetenteRef = DEMO_SENDER } = {}) {
    if (!responseAdapter || typeof responseAdapter.respond !== "function") {
      throw new TypeError("O adaptador precisa fornecer a função respond(event).");
    }

    if (typeof now !== "function") {
      throw new TypeError("now precisa ser uma função que fornece a data atual.");
    }

    if (typeof remetenteRef !== "string" || remetenteRef.length === 0) {
      throw new TypeError("remetenteRef precisa ser um identificador fictício.");
    }

    let activeFlow = "main";
    let nextMessage = 1;

    function buildEvent(tipo, field, value) {
      validateSubmission(tipo, value);
      const sequence = String(nextMessage++).padStart(3, "0");
      const event = {
        mensagemId: `demo-${sequence}`,
        remetenteRef,
        recebidaEm: isoWithTimezone(now()),
        tipo,
        [field]: value,
      };
      validateEvent(event);
      return event;
    }

    function startFlow(flow, userText, promptText, options) {
      if (activeFlow !== "main") {
        throw new Error("Conclua ou reinicie a etapa atual antes de escolher outra ação.");
      }

      activeFlow = flow;
      return {
        messages: [
          { kind: "user", text: userText },
          { kind: "bot", text: promptText },
        ],
        options: copyOptions(options),
      };
    }

    async function submit(flow, tipo, field, value, description) {
      if (activeFlow !== flow) {
        throw new Error("A opção não corresponde à etapa atual da conversa.");
      }

      validateSubmission(tipo, value);
      const options = tipo === "HUMOR" ? MOOD_OPTIONS : FICTIONAL_COMPLAINTS;
      const selectedOption = options.find((option) => option.value === value);
      const event = buildEvent(tipo, field, value);
      activeFlow = "main";

      const response = await responseAdapter.respond(event);
      if (!response || typeof response.persisted !== "boolean" || typeof response.message !== "string") {
        throw new TypeError("O adaptador retornou uma resposta inválida.");
      }

      const summary = response.status === "simulated" && response.persisted === false
        ? `${description} `
        : "";

      return {
        event,
        response,
        messages: [
          { kind: "user", text: selectedOption.label },
          { kind: "bot", text: `${summary}${response.message}` },
        ],
      };
    }

    return Object.freeze({
      welcome() {
        return [
          { kind: "bot", text: "Olá! Sou o simulador do CommitAndPray. Posso ajudar a registrar um humor ou uma queixa fictícia." },
          { kind: "bot", text: "O que você gostaria de fazer?" },
        ];
      },
      mainActions() {
        return copyOptions(MAIN_ACTIONS);
      },
      startMood() {
        return startFlow("mood", "Registrar humor", "Como você está se sentindo agora? Escolha uma opção.", MOOD_OPTIONS);
      },
      startComplaint() {
        return startFlow("complaint", "Registrar queixa", "Escolha um exemplo fictício para esta simulação.", FICTIONAL_COMPLAINTS);
      },
      submitMood(value) {
        return submit("mood", "HUMOR", "humor", value, "Simulação de humor pronta.");
      },
      submitComplaint(value) {
        return submit("complaint", "QUEIXA", "relato", value, "Simulação de queixa pronta.");
      },
      reset() {
        activeFlow = "main";
        nextMessage = 1;
      },
    });
  }

  return Object.freeze({
    createConversation,
    createSimulatedResponseAdapter,
    validateSubmission,
    validateEvent,
  });
});
