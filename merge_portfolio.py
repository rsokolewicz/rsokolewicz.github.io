#!/usr/bin/env python3
"""
Comprehensive script for portfolio and transaction management.

- Merges portfolio CSV files and formats for Yahoo Finance import
- Converts transaction CSV files to Yahoo Finance format
- Handles both Dutch and English headers.
"""

from datetime import datetime

import pandas as pd


def clean_numeric_value(value: str) -> float:
    """Convert string numeric values to float, handling commas as decimal separators."""
    if pd.isna(value) or value == "":
        return 0.0
    return float(str(value).replace(",", "."))


def convert_date_format(date_str: str) -> str:
    """Convert DD-MM-YYYY to YYYY/MM/DD format."""
    if pd.isna(date_str) or date_str == "":
        return ""
    try:
        date_obj = datetime.strptime(str(date_str), "%d-%m-%Y")
        return date_obj.strftime("%Y/%m/%d")
    except (ValueError, TypeError):
        return ""


def convert_time_format(time_str: str) -> str:
    """Convert HH:MM to HH:MM format (already correct)."""
    if pd.isna(time_str) or time_str == "":
        return ""
    return str(time_str)


def get_symbol_from_isin(isin: str, product: str) -> str:  # noqa: ARG001
    """Convert ISIN to Yahoo Finance symbol format."""
    symbol_mapping = {
        "IE00B3XXRP09": "VUSA.L",  # VANGUARD S&P500
        "NL0010273215": "ASML.AS",  # ASML HOLDING
        "IE00BMC38736": "SMH.L",  # VANECK SEMICONDUCTOR UCITS ETF
        "US4592001014": "IBM",  # INTERNATIONAL BUSINESS
        "US88160R1014": "TSLA",  # TESLA MOTORS INC.
        "US67066G1040": "NVDA",  # NVIDIA CORPORATION
        "US5949181045": "MSFT",  # MICROSOFT CORPORATION
        "US46120E6023": "ISRG",  # INTUITIVE SURGICAL
        "US0231351067": "AMZN",  # AMAZON.COM INC.
        "US0079031078": "AMD",  # ADVANCED MICRO DEVICES
        "NL0009272749": "TDT.AS",  # VANECK AEX UCITS ETF
        "US75734B1008": "RDDT",  # REDDIT INC
        "IE00BGV5VN51": "XAIX.L",  # XTRACKERS ARTIFICIAL INTELLIGENCE
        "US74766W1080": "QUBT",  # Quantum Computing INC
        "US26740W1099": "QBTS",  # D-Wave Systems Inc.
        "US76655K1034": "RGTI",  # Rigetti Computing INC.
        "US46222L1089": "IONQ",  # IONQ INC.
    }
    return symbol_mapping.get(isin, isin)


def get_transaction_type(quantity: float) -> str:
    """Determine transaction type based on quantity."""
    if quantity > 0:
        return "BUY"
    elif quantity < 0:
        return "SELL"
    else:
        return ""


def detect_and_standardize_headers(df: pd.DataFrame) -> pd.DataFrame:
    """Detect header language and standardize to English."""
    # Dutch to English column mapping
    dutch_mapping = {
        "Datum": "Date",
        "Tijd": "Time",
        "Product": "Product",
        "ISIN": "ISIN",
        "Beurs": "Reference",
        "Uitvoeringsplaa": "Venue",
        "Aantal": "Quantity",
        "Koers": "Price",
        "Lokale waarde": "Local value",
        "Waarde": "Value",
        "Wisselkoers": "Exchange rate",
        "Transactiekosten en/of": "Transaction and/or third",
        "Totaal": "Total",
        "Order ID": "Order ID",
    }

    # Check if this is a Dutch file by looking for Dutch column names
    has_dutch_headers = any(col in df.columns for col in dutch_mapping)

    if has_dutch_headers:
        print("  → Detected Dutch headers, standardizing...")
        return df.rename(columns=dutch_mapping)
    else:
        print("  → Detected English headers, no changes needed")
        return df


def merge_and_convert_transactions(file_paths: list[str], output_path: str) -> None:
    """Merge multiple transaction files and convert to Yahoo Finance format."""
    print("=== Transaction Merge and Convert Tool ===\n")

    if len(file_paths) < 2:  # noqa: PLR2004
        print("❌ Error: At least 2 transaction files are required")
        return

    try:
        # Read and process all transaction files
        dataframes = []

        for i, file_path in enumerate(file_paths, 1):
            print(f"Reading file {i}: {file_path}")
            df = pd.read_csv(file_path)
            print(f"  → {len(df)} records")

            # Standardize headers
            df = detect_and_standardize_headers(df)
            dataframes.append(df)

        # Merge (concatenate) all dataframes
        print(f"\nMerging {len(dataframes)} transaction files...")
        merged_df = pd.concat(dataframes, ignore_index=True)
        print(f"Total merged records: {len(merged_df)}")

        # Convert to Yahoo Finance format
        print("\nConverting to Yahoo Finance format...")
        yahoo_df = pd.DataFrame()

        # Map columns to Yahoo Finance format
        yahoo_df["Symbol"] = merged_df["ISIN"].apply(lambda x: get_symbol_from_isin(x, ""))
        yahoo_df["Current Price"] = merged_df["Price"].apply(
            lambda x: f"{clean_numeric_value(x):.4f}"
        )
        yahoo_df["Date"] = merged_df["Date"].apply(convert_date_format)
        yahoo_df["Time"] = merged_df["Time"].apply(convert_time_format)
        yahoo_df["Change"] = ""  # Leave empty for Yahoo Finance to fill
        yahoo_df["Open"] = ""  # Leave empty for Yahoo Finance to fill
        yahoo_df["High"] = ""  # Leave empty for Yahoo Finance to fill
        yahoo_df["Low"] = ""  # Leave empty for Yahoo Finance to fill
        yahoo_df["Volume"] = ""  # Leave empty for Yahoo Finance to fill
        yahoo_df["Trade Date"] = merged_df["Date"].apply(
            lambda x: convert_date_format(x).replace("/", "")
        )
        yahoo_df["Purchase Price"] = merged_df["Price"].apply(
            lambda x: f"{clean_numeric_value(x):.4f}"
        )
        yahoo_df["Quantity"] = merged_df["Quantity"].apply(
            lambda x: f"{clean_numeric_value(x):.1f}"
        )
        yahoo_df["Commission"] = merged_df["Transaction and/or third"].apply(
            lambda x: f"{abs(clean_numeric_value(x)):.2f}" if x != "" else "0.0"
        )
        yahoo_df["High Limit"] = ""  # Leave empty
        yahoo_df["Low Limit"] = ""  # Leave empty
        yahoo_df["Comment"] = merged_df["Product"]
        yahoo_df["Transaction Type"] = merged_df["Quantity"].apply(
            lambda x: get_transaction_type(clean_numeric_value(x))
        )

        # Filter out rows with zero quantity or invalid data
        yahoo_df = yahoo_df[yahoo_df["Quantity"] != "0.0"]
        yahoo_df = yahoo_df[yahoo_df["Symbol"] != ""]

        # Sort by date (newest first)
        yahoo_df = yahoo_df.sort_values("Date", ascending=False)

        # Save to CSV
        yahoo_df.to_csv(output_path, index=False)

        print("\n✅ Successfully merged and converted transactions!")
        print(f"📁 Output file: {output_path}")
        print(f"📊 Total transactions: {len(yahoo_df)}")
        print(f"📈 Date range: {yahoo_df['Date'].min()} to {yahoo_df['Date'].max()}")
        print("\n🎯 File is ready for Yahoo Finance import!")

    except Exception as e:
        print(f"❌ Error: {e}")


def main() -> None:
    """Execute transaction merge and conversion."""
    # Configure file paths here - add as many files as needed
    transaction_files = [
        "/Users/mac-robertsocolewicz/Downloads/Transactions (3).csv",
        "/Users/mac-robertsocolewicz/Downloads/Transactions (4).csv",
        # Add more files here as needed:
        # "/path/to/Transactions (5).csv",
        # "/path/to/Transactions (6).csv",
    ]

    output_file = "/Users/mac-robertsocolewicz/Downloads/Transactions_merged_yahoo_finance.csv"

    merge_and_convert_transactions(transaction_files, output_file)


if __name__ == "__main__":
    main()
