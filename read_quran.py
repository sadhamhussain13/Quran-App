with open("quran-uthmani.txt", "r", encoding="utf-8") as file:

    for line in file:

        line = line.strip()

        if not line:
            continue

        parts = line.split("|", 2)

        surah_number = parts[0]
        ayah_number = parts[1]
        arabic_text = parts[2]

        if surah_number == "1" and ayah_number == "1":

            print("Surah Number:", surah_number)
            print("Ayah Number:", ayah_number)
            print("Arabic:", arabic_text)

            break