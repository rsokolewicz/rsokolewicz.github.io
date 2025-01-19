#!/bin/bash

# Ensure the script receives exactly one argument
if [ "$#" -ne 1 ]; then
    echo "Usage: ./bib2json.sh <path-to-bib-file>"
    exit 1
fi

# Get the input BibTeX file
BIB_FILE="$1"

# Check if the BibTeX file exists
if [ ! -f "$BIB_FILE" ]; then
    echo "Error: File not found - $BIB_FILE"
    exit 1
fi

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Please install it first."
    exit 1
fi

# Determine the output JSON file path
OUTPUT_FILE="${BIB_FILE%.*}.json"

# Convert the BibTeX file to CSL-JSON using pandoc
pandoc --from=bibtex --to=csljson -o "$OUTPUT_FILE" "$BIB_FILE"

# Check if the conversion was successful
if [ $? -eq 0 ]; then
    echo "Conversion successful! JSON file saved at: $OUTPUT_FILE"
else
    echo "Error: Conversion failed."
    exit 1
fi
