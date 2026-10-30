# Dicionário de Dados

Arquivo: [`public/data/frota_operacional.csv`](../public/data/frota_operacional.csv)
Granularidade: **1 linha = 1 veículo (cavalo mecânico)**. Todos os dados são **fictícios**.

Gerado por [`scripts/xlsx_para_csv.py`](../scripts/xlsx_para_csv.py) a partir de
`data/source/Painel_Logistico_Dados_Ficticios.xlsx`.

## Colunas usadas pelo dashboard

| Coluna | Tipo | Descrição | Onde aparece |
| --- | --- | --- | --- |
| `Placa` | texto | Placa fictícia do cavalo mecânico (identificador). | Todas as telas |
| `Carreta 1` | texto | Placa fictícia da carreta acoplada. Vazio = veículo **desengatado**. | Regra "engatado" |
| `MOTORISTA` | texto | Nome fictício do condutor. | Cards, compliance, busca |
| `Cpf` | texto | CPF fictício (não passa na validação de dígitos). Exibido mascarado. | Modal do veículo |
| `Status` | texto | Situação operacional (EM VIAGEM, DISPONIVEL, MANUTENCAO, FOLGA...). | Inércia, cards |
| `Eficiencia` | texto | ACIMA DO ESPERADO, ABAIXO DO ESPERADO ou IMPRODUTIVO. | Produtividade da frota |
| `Centro de Gasto Veículo` | texto | Segmento/tipo de operação do veículo (GRANELEIRO, VEGETAL, AÇO...). | Filtro "Segmento" |
| `Origem` / `Destino` | texto | Cidade/UF da viagem atual. Vazio quando sem viagem. | Filtros, modal |
| `Frete acum. mês atual` | número (R$) | Faturamento realizado no mês até a data de referência. | KPIs, cards |
| `Faturamento Esperado` | número (R$) | Faturamento esperado até a data de referência ("meta atual"). | Gap da meta atual |
| `Meta Mensal` | número (R$) | Meta de faturamento do mês para o veículo. | Termômetro, cards |
| `Frete Manifesto` | número (R$) | Valor de frete do manifesto da viagem atual. | Modal |
| `Qtd. Entregas` | inteiro | Entregas da viagem atual. | Modal |
| `Tempo Parado` | `H:MM` | Tempo parado acumulado (ex.: `33:34`). | Top 15 tempo parado |
| `Dias sem fat Veic` | inteiro | Dias consecutivos sem faturar. | Veículos inertes |
| `Prev. Fim Viagem` | data/hora | Previsão de término da viagem. | Dados do veículo |
| `Data Saída Origem` | data/hora | Saída da origem. A **maior** data define a *data de referência* da base. | Referência de datas |
| `Vencimento Férias` | data `AAAA-MM-DD` | **Sintética** (gerada pelo script). | Alertas de férias |
| `Última Folga` | data `AAAA-MM-DD` | **Sintética** (gerada pelo script). | Modal |
| `Dias de Folga` | inteiro | Dias sem folga — **sintético** (gerado pelo script). | Controle de jornada |

## Demais colunas

`Carreta 3`, `GRID`, `Mun Ult Entrega`, `Remetente`, `Destinatário`, `Ult Localização`,
`Status Checkpoint`, `Centro de Custo Veículo`, `KM dia`, `Documentação`, `Complemento Status`,
`Faturamento Faltante`, `Classificação Motorista`, `Centro Custo Motorista`,
`Centro de Gasto Motorista`, `Qtd. Alertas`, `Atraso?`, `KM Total`, `KM Percorrido`,
`Minutos Fim viagem` — preservadas do Excel original, ainda não consumidas pelas telas
(ótimas candidatas para evoluções do projeto).

## Regras de negócio do dashboard

| Regra | Definição |
| --- | --- |
| Veículo **engatado** | `Placa` e `Carreta 1` preenchidas. |
| Veículo **improdutivo** | Engatado com `Eficiencia` = `IMPRODUTIVO` (ou `SEM FATURAR`). |
| Veículo **inerte** | Engatado, `Dias sem fat Veic` ≥ 2 e `Status` ≠ `EM VIAGEM`. |
| Alerta de **férias** | Engatado com `Vencimento Férias` em até 30 dias da data de referência. |
| Alerta de **jornada** | Engatado com `Dias de Folga` ≥ 10. |
| % da meta | `Frete acum. mês atual / Meta Mensal` (se a meta for 0, usa `Faturamento Esperado`). |

Os limites (2, 10 e 30 dias) ficam em [`src/lib/constants.ts`](../src/lib/constants.ts).
