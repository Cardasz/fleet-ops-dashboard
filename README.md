# 🚚 Fleet Ops Dashboard

[![CI](https://github.com/cardasz/fleet-ops-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/SEU-USUARIO/fleet-ops-dashboard/actions/workflows/ci.yml)
[![Deploy](https://github.com/cardasz/fleet-ops-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/SEU-USUARIO/fleet-ops-dashboard/actions/workflows/deploy.yml)
![License](https://img.shields.io/badge/license-MIT-green)

Dashboard operacional para gestão de frota rodoviária: acompanhamento de metas de faturamento,
ociosidade de veículos e compliance de jornada/férias dos motoristas.

**🔗 Demo ao vivo:** https://cardasz.github.io/fleet-ops-dashboard/

> ⚠️ **Todos os dados são fictícios.** Placas, nomes, CPFs e valores foram gerados para fins de
> demonstração. Nenhum dado real de cliente ou colaborador é utilizado.

<!-- Adicione aqui um print ou GIF: ![Torre de Controle](docs/screenshot-torre.png) -->

## ✨ Funcionalidades

| Aba                               | O que mostra                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Torre de Controle**       | Faturamento do mês, meta, gaps e termômetro de atingimento; produtividade da frota engatada.                                        |
| **Gestão de Inércia**     | Veículos parados há 2+ dias sem faturar e ranking Top 15 de tempo parado.                                                           |
| **Compliance & RH**         | Alertas de vencimento de férias (30 dias) e de motoristas com 10+ dias sem folga; copia o relatório para a área de transferência. |
| **Análise de Performance** | Cards por veículo ordenados por atingimento da meta, com modal de auditoria.                                                         |

Extras: filtros globais (busca, origem, segmento), modo escuro e **importação de CSV próprio**
(processada 100% no navegador, sem enviar nada a servidor).

## 🧰 Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Recharts · PapaParse · Vitest ·
GitHub Actions + GitHub Pages · Python (pandas) para preparação dos dados.

## 🗂️ Dados

- CSV consumido pelo app: [`public/data/frota_operacional.csv`](public/data/frota_operacional.csv) (650 veículos)
- Fonte original (Excel fictício): [`data/source/`](data/source/)
- Dicionário de dados e regras de negócio: [`docs/DICIONARIO_DE_DADOS.md`](docs/DICIONARIO_DE_DADOS.md)

Para regenerar o CSV:

```bash
pip install pandas openpyxl numpy
python scripts/xlsx_para_csv.py
```

> As colunas de RH (`Vencimento Férias`, `Última Folga`, `Dias de Folga`) são sintéticas e
> reprodutíveis (seed fixa).

## 🚀 Como rodar localmente

Pré-requisito: Node.js 20.19+ (ou 22+).

```bash
git clone https://github.com/SEU-USUARIO/fleet-ops-dashboard.git
cd fleet-ops-dashboard
npm install
npm run dev
```

| Comando             | Descrição                      |
| ------------------- | -------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento.     |
| `npm run build`   | Build de produção (`dist/`). |
| `npm run preview` | Visualiza o build localmente.    |
| `npm test`        | Testes unitários (Vitest).      |
| `npm run lint`    | ESLint.                          |

## 🏗️ Arquitetura

```
src/
├── components/   # KpiCard, VehicleCard, VehicleModal
├── views/        # uma view por aba
├── hooks/        # useFleetData (carga do CSV), useDashboardStats
├── lib/          # parser de CSV, cálculo de KPIs, formatadores, constantes
└── types/        # interfaces TypeScript
```

Decisões: regras de negócio isoladas em funções puras (`lib/computeStats.ts`) e cobertas por
testes; parser tolerante a variações de cabeçalho, separador (`,` ou `;`) e BOM; datas relativas à
**data de referência da base** (e não ao relógio), para o demo não "envelhecer".

## 🌐 Deploy

Automático a cada push na `main` via [GitHub Actions](.github/workflows/deploy.yml) →
GitHub Pages (Settings → Pages → Source: **GitHub Actions**).

## 🗺️ Roadmap

- [ ] Gráficos por segmento e por origem
- [ ] Exportação dos alertas em CSV
- [ ] Série histórica (comparativo mensal)
- [ ] Internacionalização (EN)

## 📄 Licença

[MIT](LICENSE)
