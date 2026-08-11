# Quran App

A simple web application for reading and searching the Qur'an.

### Live Link - https://quran-app-hnc2.onrender.com/

## Features

- Browse all 114 Surahs
- Select and read individual Ayahs
- Arabic Qur'an text
- English translation
- Search verses by keyword
- Filter search results by Surah
- Search result pagination
- Read / Search toggle interface
- Responsive and modern UI
- Flask REST API
- Deployed as a live web application

## Tech Stack

- Python
- Flask
- HTML
- CSS
- JavaScript
- JSON
- BeautifulSoup
- Requests

## Project Structure

```text
Quran-App/
├── app.py
├── requirements.txt
├── data/
│   └── quran.json
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── app.js
└── README.md
```

## Run Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Quran-App
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

Windows:

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the application

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## API Endpoints

| Endpoint                                 | Description             |
| ---------------------------------------- | ----------------------- |
| `/`                                      | Main application        |
| `/api/surahs`                            | Get all Surahs          |
| `/api/surah/<number>`                    | Get verses from a Surah |
| `/api/search?q=<keyword>`                | Search verses           |
| `/api/search?q=<keyword>&surah=<number>` | Search within a Surah   |

## Deployment

The application is deployed using Render with Gunicorn.

Production start command:

```bash
gunicorn app:app
```

## Data

The application uses a locally generated JSON dataset containing:

* Surah number
* Surah name
* Ayah number
* Arabic text
* English translation

## Purpose

This project was built as a practical project for learning:

* Web scraping
* Data processing
* Python
* Flask
* REST APIs
* Frontend JavaScript
* Git/GitHub
* Web deployment
