import requests
import xml.etree.ElementTree as ET

url = "https://tanzil.net/res/text/metadata/quran-data.xml"

response = requests.get(url, timeout=10)

response.raise_for_status()

root = ET.fromstring(response.content)

suras = root.find("suras")

for surah in suras:

    surah_number = surah.get("index")
    ayah_count = surah.get("ayas")
    arabic_name = surah.get("name")
    english_name = surah.get("ename")

    print("Surah Number:", surah_number)
    print("Arabic Name:", arabic_name)
    print("English Name:", english_name)
    print("Ayah Count:", ayah_count)

    break