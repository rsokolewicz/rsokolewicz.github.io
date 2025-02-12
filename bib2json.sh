#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: ./bib2json.sh <path-to-bib-file>"
    exit 1
fi

BIB_FILE="$1"

if [ ! -f "$BIB_FILE" ]; then
    echo "Error: File not found - $BIB_FILE"
    exit 1
fi

if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Please install it first."
    exit 1
fi

OUTPUT_FILE="${BIB_FILE%.*}.json"

pandoc --from=bibtex --to=csljson -o "$OUTPUT_FILE" "$BIB_FILE"

if [ $? -eq 0 ]; then
    echo "Conversion successful! JSON file saved at: $OUTPUT_FILE"
else
    echo "Error: Conversion failed."
    exit 1
fi
