export type Consulta = {
  [key: string]: any;
  id?: number;
  data?: Date | null;
  responsavel?: string | null;
  observacoes?: string | null;
  status?: number | null;
  pacienteId: number;
  procedimentos: ConsultaProcedimento[];
}

export type ConsultaProcedimento = {
  id?: number;
  descricao?: string | null;
  consultaId?: number | null;
}

export type Contato = {
  [key: string]: any;
  id?: number;
  email?: string | null;
  telefone1?: string | null;
  telefone2?: string | null;
}

export type Endereco = {
  [key: string]: any;
  id?: number;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  pais?: string | null;
  cep?: string | null;
}

export type FichaMedica = {
  id?: number;
  tipoSangue?: string | null;
  altura?: number | null;
}

export type FichaMedicaDetalhe = {
  id?: number;
  descricao?: string | null;
  fichaMedicaId?: number | null;
}

export type Paciente = {
  [key: string]: any;
  id?: number | null;
  cpf?: string | null;
  nome?: string | null;
  filiacao1?: string | null;
  filiacao2?: string | null;
  sexo?: string | null;
  nascimento?: Date | null;
  enderecoId?: number | null;
  contatoId?: number | null;
  fichaMedicaId?: number | null;
  grupo1Id?: number | null;
  grupo2Id?: number | null;

  endereco?: Endereco | null;
  contato?: Contato | null;
  fichaMedica?: FichaMedica | null;
  grupo1?: PacienteGrupo | null;
  grupo2?: PacienteGrupo | null;

  consultas: Consulta[];
}

export type PacienteGrupo = {
  id?: number;
  tipo?: number | null;
  descricao?: string | null;
}
