import json
import requests
import xml.etree.ElementTree as ET


# --------------------------------
# Load verse file
# --------------------------------

def load_verses(filename):

    verses = {}

    with open(filename, "r", encoding="utf-8") as file:

        for line in file:

            line = line.strip()

            if not line:
                continue

            parts = line.split("|", 2)

            if len(parts) != 3:
                continue

            surah_number = parts[0]
            ayah_number = parts[1]
            text = parts[2]

            key = f"{surah_number}:{ayah_number}"

            verses[key] = text

    return verses


# --------------------------------
# Load Arabic and English
# --------------------------------

arabic_verses = load_verses(
    "quran-uthmani.txt"
)

english_verses = load_verses(
    "translation-en.txt"
)


# --------------------------------
# Load Surah metadata
# --------------------------------

url = "https://tanzil.net/res/text/metadata/quran-data.xml"

response = requests.get(
    url,
    timeout=10
)

response.raise_for_status()

root = ET.fromstring(
    response.content
)

suras = root.find("suras")


surah_data = {}


for surah in suras:

    number = int(
        surah.get("index")
    )

    surah_data[number] = {
        "arabic_name": surah.get("name"),
        "english_name": surah.get("ename"),
        "ayah_count": int(
            surah.get("ayas")
        )
    }


# --------------------------------
# Build final dataset
# --------------------------------

quran = []


for key in arabic_verses:

    arabic = arabic_verses[key]

    english = english_verses.get(
        key,
        ""
    )

    surah_number, ayah_number = key.split(":")

    surah_number = int(surah_number)
    ayah_number = int(ayah_number)


    metadata = surah_data.get(
        surah_number
    )


    if not metadata:
        continue


    verse = {

        "surah_number": surah_number,

        "surah_arabic": metadata[
            "arabic_name"
        ],

        "surah_english": metadata[
            "english_name"
        ],

        "ayah_number": ayah_number,

        "arabic": arabic,

        "english": english
    }


    quran.append(verse)


# --------------------------------
# Save JSON
# --------------------------------

with open(
    "quran.json",
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        quran,
        file,
        ensure_ascii=False,
        indent=2
    )


print(
    "Dataset created successfully!"
)

print(
    "Total verses:",
    len(quran)
)