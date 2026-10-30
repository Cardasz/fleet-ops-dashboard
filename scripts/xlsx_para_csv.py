"""
Converte o Excel de dados fictícios no CSV consumido pelo dashboard.

Uso (na raiz do repositório):
    pip install pandas openpyxl numpy
    python scripts/xlsx_para_csv.py

Entrada : data/source/Painel_Logistico_Dados_Ficticios.xlsx
Saída   : public/data/frota_operacional.csv

O que o script faz:
1. Remove colunas vazias e colunas de "links/ações" da interface original.
2. Limpa espaços extras dos textos e padroniza números inteiros.
3. Cria 3 colunas de RH (Vencimento Férias, Última Folga, Dias de Folga),
   de forma SINTÉTICA e reprodutível (seed fixa), porque o Excel não as possui.
   As datas são relativas à data de referência da própria base
   (maior "Data Saída Origem"), então o demo não "envelhece".
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "data" / "source" / "Painel_Logistico_Dados_Ficticios.xlsx"
SAIDA = RAIZ / "public" / "data" / "frota_operacional.csv"

SEED = 42
COLUNAS_DESCARTADAS = ["Link Viagem", "Link Jornada", "Manutenção"]
COLUNAS_INTEIRAS = [
    "KM dia",
    "Dias sem fat Veic",
    "Qtd. Alertas",
    "KM Total",
    "KM Percorrido",
    "Minutos Fim viagem",
    "Qtd. Entregas",
]


def main() -> None:
    df = pd.read_excel(ENTRADA, sheet_name=0)

    # 1) colunas inúteis
    df = df.loc[:, ~df.columns.astype(str).str.startswith("Unnamed")]
    df = df.drop(columns=[c for c in COLUNAS_DESCARTADAS if c in df.columns])

    # 2) limpeza de tipos
    for col in df.columns:
        if pd.api.types.is_string_dtype(df[col]) or pd.api.types.is_object_dtype(df[col]):
            df[col] = df[col].astype("string").str.strip()
    for col in COLUNAS_INTEIRAS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col]).round().astype("Int64")
    for col in df.select_dtypes(include="float").columns:
        df[col] = df[col].round(2)

    # 3) colunas sintéticas de RH
    saida = pd.to_datetime(df["Data Saída Origem"], errors="coerce")
    referencia = saida.max().normalize()
    rng = np.random.default_rng(SEED)
    n = len(df)

    dias_folga = rng.integers(0, 10, size=n)
    folga_critica = rng.random(n) < 0.10
    dias_folga = np.where(folga_critica, rng.integers(10, 22, size=n), dias_folga)
    em_folga = (df["Status"] == "FOLGA").fillna(False).to_numpy(dtype=bool)
    dias_folga = np.where(em_folga, 0, dias_folga)

    ferias_em = rng.integers(31, 330, size=n)
    ferias_proximas = rng.random(n) < 0.08
    ferias_em = np.where(ferias_proximas, rng.integers(0, 30, size=n), ferias_em)

    venc_ferias = (referencia + pd.to_timedelta(ferias_em, unit="D")).strftime("%Y-%m-%d")
    ultima_folga = (referencia - pd.to_timedelta(dias_folga, unit="D")).strftime("%Y-%m-%d")

    df["Vencimento Férias"] = pd.Series(venc_ferias, index=df.index)
    df["Última Folga"] = pd.Series(ultima_folga, index=df.index)
    df["Dias de Folga"] = pd.Series(dias_folga, index=df.index).astype("Int64")

    sem_motorista = df["MOTORISTA"].isna()
    df.loc[sem_motorista, ["Vencimento Férias", "Última Folga", "Dias de Folga"]] = pd.NA

    # 4) saída (UTF-8 sem BOM, separador vírgula, ponto decimal)
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(SAIDA, index=False, encoding="utf-8", lineterminator="\n")

    print(f"OK: {len(df)} linhas, {len(df.columns)} colunas -> {SAIDA.relative_to(RAIZ)}")
    print(f"Data de referência da base: {referencia.date()}")


if __name__ == "__main__":
    main()
