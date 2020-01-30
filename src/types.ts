export type Consulta = {
  id: number;
  data: Date | null;
  responsavel: string | null;
  observacoes: string | null;
  status: number | null;
  pacienteId: number;
}

export type ConsultaProcedimento = {
  id: number;
  descricao: string | null;
  consultaId: number;
}

export type Contato = {
  id: number;
  email: string | null;
  telefone1: string | null;
  telefone2: string | null;
}

export type Endereco = {
  id: number;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  pais: string | null;
  cep: string | null;
}

export type Paciente = {
  id: number;
  cpf: string | null;
  nome: string | null;
  filiacao1: string | null;
  filiacao2: string | null;
  sexo: string | null;
  nascimento: Date | null;
  enderecoId: number | null;
  contatoId: number | null;
}
