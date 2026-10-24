// MedCore Lite - Script de Injeção e Leitura de Portais Legados (SISREG, SUS, TISS)

chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === "extractPatientData") {
    // Tenta capturar campos comuns em páginas do SUS e portais governamentais
    const data = {
      nome: document.querySelector("input[name*='nome'], input[id*='nome'], .paciente-nome")?.value || 
            document.querySelector("h1, h2, strong")?.innerText || "Nome Capturado",
      cpf: document.querySelector("input[name*='cpf'], input[id*='cpf']")?.value || "",
      cns: document.querySelector("input[name*='cns'], input[id*='cns']")?.value || "",
      dataNascimento: document.querySelector("input[name*='nascimento'], input[id*='nascimento']")?.value || "",
      diagnostico: document.querySelector("textarea[name*='cid'], input[name*='cid']")?.value || "",
    };
    sendResponse({ success: true, data });
  }

  if (request.action === "autofillPortal") {
    const p = request.patientData;
    // Preenche automaticamente inputs correspondentes
    const nomeInput = document.querySelector("input[name*='nome'], input[id*='nome']");
    if (nomeInput && p.nome) nomeInput.value = p.nome;

    const cpfInput = document.querySelector("input[name*='cpf'], input[id*='cpf']");
    if (cpfInput && p.cpf) cpfInput.value = p.cpf;

    sendResponse({ success: true, filled: true });
  }
});
