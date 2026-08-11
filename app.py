from flask import Flask, render_template, jsonify, request
import json


app = Flask(__name__)


# -----------------------------
# Load Quran data
# -----------------------------

with open(
    "data/quran.json",
    "r",
    encoding="utf-8"
) as file:

    quran = json.load(file)


# -----------------------------
# Home page
# -----------------------------

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# -----------------------------
# Get all Surahs
# -----------------------------

@app.route("/api/surahs")
def get_surahs():

    surahs = {}

    for verse in quran:

        number = verse["surah_number"]

        if number not in surahs:

            surahs[number] = {
                "number": number,
                "arabic": verse["surah_arabic"],
                "english": verse["surah_english"]
            }

    return jsonify(
        list(surahs.values())
    )


# -----------------------------
# Get Surah verses
# -----------------------------

@app.route("/api/surah/<int:surah_number>")
def get_surah(surah_number):

    verses = [
        verse
        for verse in quran
        if verse["surah_number"] == surah_number
    ]

    return jsonify(verses)


#-----------------------------
# Search Quran
#-----------------------------

@app.route("/api/search")
def search_quran():

    query = request.args.get("q", "").strip().lower()

    if not query:
        return jsonify([])

    results = []

    for verse in quran:

        english_text = verse["english"].lower()

        if query in english_text:

            results.append(verse)

    return jsonify(results)


# -----------------------------
# Run server
# -----------------------------

if __name__ == "__main__":

    app.run(
        debug=True
    )