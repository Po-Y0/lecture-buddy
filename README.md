# Project: [Tools for Modern Learners]
_A brief, one-sentence description of what your project does._

## Team: 03 [4T]
- 🧑🏻‍💻67025954 กิตติณัฏฐ์ ครรชิตานุรักษ์ @Kaxin78 (หัวหน้าทีม)
- 👩🏻‍💻67026124 วริศรา ปัญญาแก้ว @Warissara-Tahwan
- 👩🏻‍💻67021095 ปาริชาต จันจม @parichatforpj-ux
- 🧑🏻‍💻67021174 ภูมิภัทร โพทา @Po-Y0

---

## 🚀 Getting Started

This section explains how to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Git
- Python 3.10+
- Docker & Docker Compose

### Running the Application (with Docker)

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [your-project-folder]
    ```

2.  **Run the services:**
    *(This section will be updated in later weeks when using Docker Compose)*
    ```bash
    # Example for a single service
    cd services/stats-service
    docker build -t your-team/stats-service .
    docker run -p 5001:5000 your-team/stats-service
    ```

---

## 🏛️ Architecture & Design

Key architectural decisions and diagrams are documented in the `/docs/architecture` directory.

- **[C4 Models & Tech Stack](./docs/architecture/README.md)**
- **[Architectural Decision Records (ADRs)](./docs/architecture/adr/)**

## 👥 Requirements

User personas and key scenarios that drive our development are located in the `/docs/requirements` directory.

- **[User Personas](./docs/requirements/personas/)**
- **[Main User Scenario](./docs/requirements/main_scenario.md)**

# Lecture Buddy — Course Management

## User Story

US-01 — จัดการรายวิชา

As a student, I want to create and manage my courses
so that I can organize my learning materials by subject.

## Type

Prototype

## Why Prototype?

...

## What This Prototype Can Do

- Create a course
- Edit a course
- Delete a course
- Display course information

## What This Prototype Does Not Do

- No database
- No authentication
- No backend
- No real file upload
- No persistent data
- No multi-user support

## User Flow

Add Course → Fill Form → Save → Course Appears
Edit Course → Update → Save
Delete Course → Confirm → Remove

## Next Step

...
