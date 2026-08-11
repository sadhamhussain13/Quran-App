import requests
import xml.etree.ElementTree as ET


url = "https://tanzil.net/res/text/metadata/quran-data.xml"

response = requests.get(url, timeout=10)

response.raise_for_status()

root = ET.fromstring(response.content)

suras = root.find("suras")


surah_data = {}


for surah in suras:

    number = int(surah.get("index"))
    arabic_name = surah.get("name")
    english_name = surah.get("ename")
    ayah_count = int(surah.get("ayas"))

    surah_data[number] = {
        "arabic_name": arabic_name,
        "english_name": english_name,
        "ayah_count": ayah_count
    }


print("Total Surahs:", len(surah_data))

print("\nSurah 1:")
print(surah_data[1])

print("\nSurah 114:")
print(surah_data[114])