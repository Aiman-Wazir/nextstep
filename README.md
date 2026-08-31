# 🚀 CareerPath AI

<div align="center">

### AI-Powered Career Recommendation & Learning Roadmap Platform

*Helping students and professionals discover suitable career paths through intelligent skill analysis, career matching, and personalized learning roadmaps.*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=next.js\&logoColor=white)](https://nextjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge\&logo=tensorflow\&logoColor=white)](https://www.tensorflow.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)](https://firebase.google.com/)

</div>

---

## 📌 Overview

**CareerPath AI** is an intelligent career guidance platform that analyzes a user's **skills, interests, education, and experience** to recommend suitable technology career paths.

The platform combines **Machine Learning, Generative AI, and Full-Stack Development** to provide personalized career recommendations, skill-gap analysis, and structured learning roadmaps.

### 🎯 What Problem Does It Solve?

Choosing the right career can be difficult because users often don't know:

* Which careers match their current skills
* Which skills they are missing
* How to build a structured learning path

CareerPath AI turns this information into **personalized, actionable career guidance**.

---

## ✨ Key Features

🧠 **AI Career Recommendations**
Machine learning-based career matching with personalized match scores.

🎯 **Skill-Gap Analysis**
Identifies missing and weak skills required for a selected career.

🗺️ **Personalized Learning Roadmaps**
AI-generated structured learning plans to help users achieve career goals.

📊 **Progress Dashboard**
Track learning milestones, skill development, and progress.

🔐 **Authentication & Data Storage**
Firebase Authentication and Firestore for secure user management and persistent data.

---

## 🏗️ Architecture

```text
                 ┌─────────────────────┐
                 │   Next.js Frontend  │
                 │   React + Tailwind  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   FastAPI Backend   │
                 │  API + Services     │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │ TensorFlow │ │  Groq AI   │ │  Firebase  │
      │ ML Model   │ │  Roadmaps  │ │ Firestore  │
      └────────────┘ └────────────┘ └────────────┘
```

---

## 🛠️ Tech Stack

| Category             | Technologies                             |
| -------------------- | ---------------------------------------- |
| **Frontend**         | Next.js, React, TypeScript, Tailwind CSS |
| **Backend**          | Python, FastAPI                          |
| **Machine Learning** | TensorFlow, NumPy, Pandas                |
| **AI**               | Groq API                                 |
| **Database**         | Firebase Firestore                       |
| **Authentication**   | Firebase Auth                            |
| **Deployment**       | Vercel, Render                           |

---

## 🤖 Machine Learning Model

The recommendation engine uses a **TensorFlow neural network** trained to map user profiles to suitable technology career paths.

### Model Highlights

* 🧠 15+ Career Categories
* 📊 75+ Profile Features
* 📁 5,000+ Generated Training Samples
* 🎯 Top-3 Recommendation Accuracy: **92%**
* 📈 Validation Accuracy: **85%**

### Supported Career Paths

`AI Engineer` • `Machine Learning Engineer` • `Data Scientist` • `Data Analyst` • `Full Stack Developer` • `Backend Developer` • `Frontend Developer` • `Cloud Engineer` • `DevOps Engineer` • `Cybersecurity Analyst` • `Computer Vision Engineer` • `NLP Engineer`

---

## 📸 Screenshots

> Project screenshots will be added here.

### 🏠 Landing Page

![Landing Page](https://via.placeholder.com/1000x500/1E293B/FFFFFF?text=CareerPath+AI+Landing+Page)

### 🎯 Career Recommendations

![Recommendations](https://via.placeholder.com/1000x500/1E293B/FFFFFF?text=Career+Recommendations)

### 📊 Learning Dashboard

![Dashboard](https://via.placeholder.com/1000x500/1E293B/FFFFFF?text=Learning+Dashboard)

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/careerpath-ai.git
cd careerpath-ai
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
Frontend → http://localhost:3000
Backend  → http://localhost:8000
API Docs → http://localhost:8000/docs
```

---

## 🔮 Future Improvements

* Real-world job market integration
* LinkedIn profile analysis
* Resume analysis and recommendations
* More career categories
* AI interview preparation
* Personalized course recommendations

---

## 👩‍💻 Author

**Aiman Wazir**

Aspiring Full Stack & AI Developer

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

**Built with ❤️ using Machine Learning, Generative AI, FastAPI, Next.js, and Firebase.**

</div>
