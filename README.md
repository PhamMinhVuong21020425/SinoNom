# Detect and Recognize SinoNom text. -HANOMIZE-

Hanomize is an application that integrates a character-level recognition model for Han-Nom characters and an image annotation tool for computer vision. The application's goal is to help organizations and users, especially those researching in the field of Nom script, effectively address practical issues such as digitizing valuable historical documents or studying SinoNom script. This is achieved by using Deep Learning machine learning models.

## Features

-   **Character Recognition:** Accurate identification of Han-Nom characters using Deep Learning models.
-   **Image Annotation:** User-friendly annotation tool to label and edit recognized characters.
-   **Document Digitization:** Efficiently export physical documents into digital format.

## Requirements

```
node: 20.13.1
python: 3.11.5
docker: 26.1.4
```

## How to run with docker compose

**Step 1:** Clone this repository

```bash
   git clone https://github.com/PhamMinhVuong21020425/SinoNom.git
```

**Step 2:** Create `.env` file in the root directory at the same level as `docker-compose.yml`

```
# .env
PORT=8000
```

**Step3:** Build and run application with docker compose

```bash
docker compose up -d --build
```

Now, the application is running on http://127.0.0.1:3000
