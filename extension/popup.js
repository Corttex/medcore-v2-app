document.addEventListener("DOMContentLoaded", () => {
  const btnExtract = document.getElementById("btnExtract");
  const btnFill = document.getElementById("btnFill");

  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab?.title) {
      const pageTitleEl = document.getElementById("pageTitle");
      if (pageTitleEl) pageTitleEl.innerText = currentTab.title.slice(0, 35) + "...";
    }
  });

  btnExtract?.addEventListener("click", () => {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractPatientData" }, (response) => {
        if (response?.data) {
          alert(`📥 Dados capturados com sucesso pelo MedCore Lite!\n\nPaciente: ${response.data.nome}\nCPF: ${response.data.cpf || "Não localizado"}\n\nSincronizando com o prontuário na nuvem...`);
        } else {
          alert("Nenhum formulário ou dado clínico identificado na página aberta.");
        }
      });
    });
  });

  btnFill?.addEventListener("click", () => {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "autofillPortal",
          patientData: {
            nome: "Mariana Silva",
            cpf: "123.456.789-00",
          },
        },
        (response) => {
          if (response?.filled) {
            alert("📤 Formulário legado preenchido com dados do MedCore!");
          }
        }
      );
    });
  });
});
