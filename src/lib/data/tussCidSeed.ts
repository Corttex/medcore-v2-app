export interface ProcedimentoTUSS {
  codigo: string;
  descricao: string;
  grupo: "consulta" | "exame" | "cirurgia" | "terapia" | "taxa";
  rolAns: boolean;
  porteAnestesico?: string;
  valorReferenciaCh?: number;
}

export interface DiagnosticoCID {
  codigo: string;
  descricao: string;
  capitulo: string;
  sexoRestrito?: "M" | "F" | "TODOS";
}

// Procedimentos mais frequentes da Tabela TUSS da ANS
export const PROCEDIMENTOS_TUSS_BASE: ProcedimentoTUSS[] = [
  { codigo: "10101012", descricao: "Consulta médica em consultório (no horário normal ou preestabelecido)", grupo: "consulta", rolAns: true },
  { codigo: "10101020", descricao: "Consulta médica em pronto-socorro / pronto atendimento", grupo: "consulta", rolAns: true },
  { codigo: "10101039", descricao: "Consulta médica domiciliar / Home Care", grupo: "consulta", rolAns: true },
  { codigo: "40101010", descricao: "Eletrocardiograma de repouso (ECG) convencional de 12 derivações", grupo: "exame", rolAns: true },
  { codigo: "40301633", descricao: "Hemograma completo com contagem de plaquetas ou frações", grupo: "exame", rolAns: true },
  { codigo: "40302044", descricao: "Glicemia de jejum / pós-prandial ou curva glicêmica", grupo: "exame", rolAns: true },
  { codigo: "40302230", descricao: "Lipidograma completo (Colesterol total, HDL, LDL, VLDL e Triglicerídeos)", grupo: "exame", rolAns: true },
  { codigo: "40316525", descricao: "Hormônio tireoestimulante (TSH ultra-sensível)", grupo: "exame", rolAns: true },
  { codigo: "40808033", descricao: "Ressonância magnética de crânio com e sem contraste paramagnético", grupo: "exame", rolAns: true },
  { codigo: "40901122", descricao: "Ultrassonografia de abdome total (inclui abdome superior, rins e pelve)", grupo: "exame", rolAns: true },
  { codigo: "40901238", descricao: "Ultrassonografia transvaginal pélvica", grupo: "exame", rolAns: true },
  { codigo: "30101786", descricao: "Sutura de múltiplos ferimentos com desbridamento e planos subdérmicos", grupo: "cirurgia", rolAns: true, porteAnestesico: "2" },
  { codigo: "30501067", descricao: "Biópsia de pele, tecido subcutâneo e anexos cutâneos", grupo: "cirurgia", rolAns: true, porteAnestesico: "1" },
  { codigo: "30801052", descricao: "Rinoplastia reparadora / septoplastia funcional", grupo: "cirurgia", rolAns: true, porteAnestesico: "4" },
  { codigo: "20104081", descricao: "Sessão de fisioterapia motora individual e cinesioterapia", grupo: "terapia", rolAns: true },
  { codigo: "20104103", descricao: "Sessão de psicoterapia individual ambulatorial", grupo: "terapia", rolAns: true },
  { codigo: "20104138", descricao: "Atendimento ou consulta em nutrição clínica individual", grupo: "terapia", rolAns: true },
];

// Principais Códigos da CID-10 para Clínicas e Consultórios
export const DIAGNOSTICOS_CID10_BASE: DiagnosticoCID[] = [
  { codigo: "I10", descricao: "Hipertensão essencial (primária)", capitulo: "Doenças do aparelho circulatório" },
  { codigo: "E11", descricao: "Diabetes mellitus não-insulino-dependente (Tipo 2)", capitulo: "Doenças endócrinas e metabólicas" },
  { codigo: "E03.9", descricao: "Hipotireoidismo não especificado", capitulo: "Doenças endócrinas e metabólicas" },
  { codigo: "F41.1", descricao: "Ansiedade generalizada", capitulo: "Transtornos mentais e comportamentais" },
  { codigo: "F32.1", descricao: "Episódio depressivo moderado", capitulo: "Transtornos mentais e comportamentais" },
  { codigo: "M54.5", descricao: "Dor lombar baixa (Lombalgia mecânica)", capitulo: "Doenças do sistema osteomuscular" },
  { codigo: "M75.1", descricao: "Síndrome do manguito rotador / Tendinopatia", capitulo: "Doenças do sistema osteomuscular" },
  { codigo: "J00", descricao: "Nasofaringite aguda (resfriado comum)", capitulo: "Doenças do aparelho respiratório" },
  { codigo: "J01.9", descricao: "Sinusite aguda não especificada", capitulo: "Doenças do aparelho respiratório" },
  { codigo: "K21.0", descricao: "Doença de refluxo gastroesofágico com esofagite", capitulo: "Doenças do aparelho digestivo" },
  { codigo: "L70.0", descricao: "Acne vulgar", capitulo: "Doenças da pele e do tecido subcutâneo" },
  { codigo: "L81.1", descricao: "Cloasma / Melasma facial", capitulo: "Doenças da pele e do tecido subcutâneo" },
  { codigo: "Z00.0", descricao: "Exame médico geral (Check-up clínico preventivo)", capitulo: "Fatores que influenciam o estado de saúde" },
  { codigo: "Z01.0", descricao: "Exame dos olhos e da visão", capitulo: "Fatores que influenciam o estado de saúde" },
];
