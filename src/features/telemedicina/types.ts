export type TelemedicinaStatus = 'agendado' | 'sala_espera' | 'em_andamento' | 'concluido' | 'cancelado';

export interface Teleconsulta {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: TelemedicinaStatus;
  link: string;
  tokenPublico: string;
  isPublic?: boolean;
  user_id?: string | null;
  user?: {
    id?: string;
    fullName: string | null;
    especialidade?: string | null;
    crm?: string | null;
  } | null;
  pacienteId?: string | null;
  paciente?: {
    id?: string;
    nome: string;
    cpf?: string | null;
    telefone?: string | null;
    email?: string | null;
    convenio?: { nome: string } | null;
  } | null;
  prontuario?: {
    anamnese?: string | null;
    diagnostico?: string | null;
    conduta?: string | null;
    prescricao?: string | null;
    transcricaoCrua?: string | null;
    resumoJSON?: string | null;
  } | null;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'medico' | 'paciente' | 'sistema';
  senderName: string;
  text: string;
  timestamp: string;
  fileUrl?: string;
}
