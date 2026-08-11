import json

with open("quran.json", "r", encoding="utf-8") as file:
    quran = json.load(file)


def find_ayah(surah_number, ayah_number):

    for verse in quran:

        if (
            verse["surah"] == surah_number
            and verse["ayah"] == ayah_number
        ):
            return verse

    return None


verse = find_ayah(1, 1)

if verse:
    print("Surah:", verse["surah"])
    print("Ayah:", verse["ayah"])
    print()
    print("Arabic:")
    print(verse["arabic"])
    print()
    print("English:")
    print(verse["english"])

else:
    print("Ayah not found.")