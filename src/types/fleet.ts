export type TabId = 'torre_controle' | 'ociosidade' | 'compliance' | 'performance';

export interface FleetVehicle {
  placa: string;
  status: string;
  motorista: string;
  cpf: string;
  carreta: string;
  segmento: string;
  eficiencia: string;
  origem: string;
  destino: string;
  destinatario: string;
  fatEsperado: number;
  fatAtual: number;
  metaMensal: number;
  freteManifesto: number;
  qtdEntregas: number;
  isEngatado: boolean;
  isImprodutivo: boolean;
  percentual: number;
  tempoParadoHoras: number;
  diasSemFat: number;
  diasFolga: number;
  prevChegada: Date | null;
  dataSaidaOrigem: Date | null;
  vencFerias: Date | null;
  ultimaFolga: Date | null;
}

export interface DashboardStats {
  totalAtual: number;
  totalMeta: number;
  metaDiariaTotal: number;
  gapDiario: number;
  veiculosInertes: FleetVehicle[];
  feriasAlerta: FleetVehicle[];
  folgaAlerta: FleetVehicle[];
  totalComplianceAlerts: number;
  totalEngatados: number;
  improdutivosCount: number;
  percImprodutivo: number;
  topOciosidade: FleetVehicle[];
  analiseFinanceira: FleetVehicle[];
}
