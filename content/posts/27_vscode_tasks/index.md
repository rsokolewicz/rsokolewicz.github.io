+++
title = "Creating custom VSCode tasks"
date = "2025-02-04"
author = "Robert"
cover = ""
description = "For this blog I'm using a plugin to display citations called hugo-cite. Unfortunately, this requires the citations to be stored in a CSL-JSON format, while most of the time I only have bibtex files. Converting one into the other is not so difficult (I have a script for that), but it gets boring to do this manually often. Just like all editors/IDE's, VSCode has a way to simplify this process using tasks."
draft = false
+++

For this blog I'm using a plugin to display citations called hugo-cite {{< cite "hugo-cite" >}}. Unfortunately, this requires the citations to be stored in a CSL-JSON format, while most of the time I only have bibtex files. Converting one into the other is not so difficult (I have a script for that), but it gets boring to do this manually often. Just like all editors/IDE's, VSCode has a way to simplify this process using tasks. 

From the command palette (Ctrl+Shift+P), I can now select "Tasks: Run Task" and then "Convert BibTeX to JSON", to convert the bibtex file that I have open into a JSON file. To setup it is quite easy.

# setup

1. Open the command palette (Ctrl+Shift+P)
2. Select "Tasks: Configure Task"
3. Select "Create task.json file"
4. Select "Others"
5. Create the file

the file:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Convert BibTeX to JSON",
            "type": "shell",
            "command": "./bib2json.sh",
            "args": ["${input:bibFile}"],
            "group": "build",
            "problemMatcher": []
        }
    ],
    "inputs": [
        {
            "id": "bibFile",
            "description": "BibTeX file to convert:",
            "default": "${file}",
            "type": "promptString"
        }
    ]
}
```

and in case anyone is interested in the script:

```bash
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

```

which requires the `pandoc` package to be installed. (on Mac: `brew install pandoc`).


# bibliography

{{< bibliography >}}