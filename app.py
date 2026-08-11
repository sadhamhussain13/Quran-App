from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)


# =========================================
# Load Quran data
# =========================================

with open(
    "data/quran.json",
    "r",
    encoding="utf-8"
) as file:

    quran = json.load(file)


# =========================================
# Home page
# =========================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# =========================================
# Get all Surahs
# =========================================

@app.route("/api/surahs")
def get_surahs():

    surahs = {}

    for verse in quran:

        surah_number = verse["surah_number"]

        if surah_number not in surahs:

            surahs[surah_number] = {
                "number": surah_number,
                "english": verse["surah_english"],
                "arabic": verse["surah_arabic"]
            }


    return jsonify(
        list(surahs.values())
    )


# =========================================
# Get one Surah
# =========================================

@app.route("/api/surah/<int:surah_number>")
def get_surah(surah_number):

    verses = [

        verse

        for verse in quran

        if int(verse["surah_number"]) == surah_number

    ]


    return jsonify(verses)


# =========================================
# Search Quran
# =========================================

@app.route("/api/search")
def search_quran():

    query = request.args.get(
        "q",
        ""
    ).strip().lower()


    surah_number = request.args.get(
        "surah",
        "",
        type=str
    )


    page = request.args.get(
        "page",
        1,
        type=int
    )


    limit = 20


    if page < 1:

        page = 1


    if not query:

        return jsonify({

            "results": [],

            "page": page,

            "limit": limit,

            "total": 0,

            "total_pages": 0

        })


    # =====================================
    # Find matching verses
    # =====================================

    matches = []


    for verse in quran:

        # Filter by Surah
        if surah_number:

            if str(
                verse["surah_number"]
            ) != surah_number:

                continue


        english_text = (
            verse["english"]
            .lower()
        )


        if query in english_text:

            matches.append(verse)


    # =====================================
    # Pagination
    # =====================================

    total = len(matches)


    total_pages = (
        total + limit - 1
    ) // limit


    start = (
        page - 1
    ) * limit


    end = start + limit


    results = matches[start:end]


    return jsonify({

        "results": results,

        "page": page,

        "limit": limit,

        "total": total,

        "total_pages": total_pages

    })


# =========================================
# Run server
# =========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )