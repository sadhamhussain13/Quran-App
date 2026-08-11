import json

with open("quran.json", "r", encoding="utf-8") as file:
    quran = json.load(file)

print("Total verses:", len(quran))

print("\nFirst verse:")
print(quran[0])

print("\nLast verse:")
print(quran[-1])