with open("translation-en.txt", "r", encoding="utf-8") as file:

    lines = file.readlines()

print("Total lines:", len(lines))

print("First 5 lines:")

for line in lines[:5]:
    print(line.strip())