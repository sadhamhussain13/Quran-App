const surahSelect = document.getElementById("surahSelect");
const ayahSelect = document.getElementById("ayahSelect");
const loadAyahButton = document.getElementById("loadAyah");

const surahInfo = document.getElementById("surahInfo");
const versesContainer = document.getElementById("verses");


// --------------------------------
// Store loaded verses
// --------------------------------

let currentVerses = [];


// --------------------------------
// Load all Surahs
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

        console.error(
            "Error loading Surahs:",
            error
        );

    }
}


// --------------------------------
// Load selected Surah
// --------------------------------

async function loadSurah(surahNumber) {

    if (!surahNumber) {

        ayahSelect.innerHTML =
            '<option value="">Select an Ayah</option>';

        ayahSelect.disabled = true;

        currentVerses = [];

        surahInfo.innerHTML = "";

        versesContainer.innerHTML = "";

        return;
    }


    try {

        const response =
            await fetch(`/api/surah/${surahNumber}`);

        currentVerses = await response.json();


        if (currentVerses.length === 0) {

            console.error("Surah not found.");

            return;
        }


        // -----------------------------
        // Display Surah information
        // -----------------------------

        const firstVerse = currentVerses[0];

        surahInfo.innerHTML = `
            <h2>${firstVerse.surah_arabic}</h2>
            <h3>${firstVerse.surah_english}</h3>
        `;


        // -----------------------------
        // Populate Ayah dropdown
        // -----------------------------

        ayahSelect.innerHTML =
            '<option value="">Select an Ayah</option>';


        currentVerses.forEach((verse) => {

            const option =
                document.createElement("option");

            option.value = verse.ayah_number;

            option.textContent =
                `Ayah ${verse.ayah_number}`;

            ayahSelect.appendChild(option);

        });


        ayahSelect.disabled = false;


        // Show complete Surah initially

        displayVerses(currentVerses);


    } catch (error) {

        console.error(
            "Error loading Surah:",
            error
        );

    }
}


// --------------------------------
// Display verses
// --------------------------------

function displayVerses(verses) {

    versesContainer.innerHTML = "";


    verses.forEach((verse) => {

        const verseElement =
            document.createElement("div");

        verseElement.className = "verse";


        verseElement.innerHTML = `

            <div class="ayah-number">
                Ayah ${verse.ayah_number}
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
}


// --------------------------------
// Surah changed
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
// Load selected Ayah
// --------------------------------

loadAyahButton.addEventListener(
    "click",
    () => {

        const ayahNumber =
            Number(ayahSelect.value);


        if (!ayahNumber) {

            displayVerses(currentVerses);

            return;
        }


        const selectedVerse =
            currentVerses.find(
                (verse) =>
                    verse.ayah_number === ayahNumber
            );


        if (selectedVerse) {

            displayVerses([
                selectedVerse
            ]);

        }

    }
);


// --------------------------------
// Start application
// --------------------------------

loadSurahs();