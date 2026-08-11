const surahSelect = document.getElementById("surahSelect");
const surahInfo = document.getElementById("surahInfo");
const versesContainer = document.getElementById("verses");


// --------------------------------
// Load Surahs
// --------------------------------

async function loadSurahs() {

    try {

        const response = await fetch("/api/surahs");

        const surahs = await response.json();


        surahs.forEach((surah) => {

            const option = document.createElement("option");

            option.value = surah.number;

            option.textContent =
                `${surah.number}. ${surah.english} - ${surah.arabic}`;

            surahSelect.appendChild(option);

        });

    } catch (error) {

        console.error("Error loading Surahs:", error);

    }
}


// --------------------------------
// Load selected Surah
// --------------------------------

async function loadSurah(surahNumber) {

    if (!surahNumber) {

        surahInfo.innerHTML = "";
        versesContainer.innerHTML = "";

        return;
    }


    try {

        const response =
            await fetch(`/api/surah/${surahNumber}`);

        const verses = await response.json();


        if (verses.length === 0) {

            versesContainer.innerHTML =
                "<p>Surah not found.</p>";

            return;
        }


        const firstVerse = verses[0];


        surahInfo.innerHTML = `
            <h2>${firstVerse.surah_arabic}</h2>
            <h3>${firstVerse.surah_english}</h3>
        `;


        versesContainer.innerHTML = "";


        verses.forEach((verse) => {

            const verseElement =
                document.createElement("div");

            verseElement.className = "verse";


            verseElement.innerHTML = `

                <div class="ayah-number">
                    ${verse.ayah_number}
                </div>

                <div class="arabic">
                    ${verse.arabic}
                </div>

                <div class="english">
                    ${verse.english}
                </div>

            `;


            versesContainer.appendChild(
                verseElement
            );

        });


    } catch (error) {

        console.error(
            "Error loading Surah:",
            error
        );

    }
}


// --------------------------------
// Surah selection event
// --------------------------------

surahSelect.addEventListener(
    "change",
    () => {

        loadSurah(
            surahSelect.value
        );

    }
);


// --------------------------------
// Start application
// --------------------------------

loadSurahs();