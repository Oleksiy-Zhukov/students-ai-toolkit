# Student AI Toolkit
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?style=for-the-badge&logo=shadcn%2Fui&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Uvicorn](https://img.shields.io/badge/uvicorn-F69220?style=for-the-badge&logo=uvicorn&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-yellow?style=for-the-badge&logo=huggingface&logoColor=black)
![Google reCAPTCHA](https://img.shields.io/badge/reCAPTCHA-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-111113?style=for-the-badge&logo=railway&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Namecheap](https://img.shields.io/badge/Namecheap-E22424?style=for-the-badge&logo=namecheap&logoColor=white)

## Live Now!

* Experience the Student AI Toolkit in action: https://www.studentsai.org/

<a href="https://www.studentsai.org/" target="_blank">
  <img width="1565" height="1308" alt="image" src="https://github.com/user-attachments/assets/3f731e7c-902c-4f26-b076-79776d48721f" />
</a>

## About

A modern, open-source AI-powered study assistant designed to help students learn faster and smarter. Summarize readings, generate questions, and build study plans—all from your documents or text input.

This project serves a dual purpose: it's a powerful productivity tool for students and a comprehensive portfolio piece showcasing full-stack development, AI integration, and robust deployment strategies across modern platforms.

### Goals

**For Students:** To provide a clean, intuitive, and practical AI toolset that enhances the studying experience.

**For Developers:** To demonstrate proficiency in cutting-edge technologies including React, FastAPI, OpenAI, and effective deployment practices.

## Project Status

*   **Deployed & Functional:** Live and ready for use.
*   **Enhanced UI/UX:** Recently updated with improved design, animations, and user experience.
*   **Actively Maintained:** Continuously improved with new features and optimizations.
*   **Secure & Reliable:** Features like reCAPTCHA v3 and rate limiting ensure a secure and smooth user experience.

## Tech Stack

| Layer     | Technologies                               |
| :-------- | :----------------------------------------- |
| Frontend  | React 19, Vite, Tailwind CSS 4, shadcn/ui, Framer Motion |
| Backend   | FastAPI (Python 3.11+), Uvicorn            |
| AI        | OpenAI (default), Hugging Face (optional)  |
| Security  | Google reCAPTCHA v3, Rate Limiting, CORS   |
| Deployment| Frontend → Vercel, Backend → Railway, DNS → Cloudflare + Namecheap |

## Architecture

### Frontend

A component-based React Single Page Application (SPA) featuring intuitive modules like `FileUploader`, `ActionSelector`, and `ResultsDisplay`. It leverages React hooks and `fetch` for seamless communication with the backend.

**Enhanced Features:**
- **Progressive Disclosure UI:** Smart flow that guides users through the process
- **Japanese-Inspired Design:** Clean, minimal aesthetic with subtle animations
- **Gruvbox Dark Theme:** Beautiful color palette with proper dark mode support
- **Responsive Animations:** Smooth transitions and micro-interactions
- **Keyboard Shortcuts:** Enhanced accessibility and power-user features
- **Retro Tooltips:** Contextual help with 90s-inspired styling

### Backend

A modular FastAPI application structured for scalability and maintainability:

*   `main.py`: The application's entry point, defining routes and middleware.
*   `ai_backends.py`: Abstracts AI service integration, supporting both OpenAI and Hugging Face.
*   `file_processor.py`: Handles parsing of `.pdf`, `.txt`, and `.docx` file formats.
*   `models.py`: Defines input/output schemas using Pydantic for robust data validation.
*   `config.py`: Manages environment-driven configurations.

For a detailed architectural breakdown, refer to the [Architecture Document](docs/architecture.md).

## Features

*   **Versatile Content Input:** Upload and parse `.pdf`, `.txt`, or `.docx` files, or paste text directly.
*   **AI-Powered Learning Tools:** Summarize content, generate insightful questions, and create personalized study plans.
*   **Enhanced User Experience:** Progressive disclosure, smooth animations, and intuitive navigation.
*   **Export & Share:** Easily export results or copy them to your clipboard.
*   **Mobile-Responsive:** Optimized for a seamless experience across all devices.
*   **Swappable AI Backends:** Flexibility to choose between OpenAI and Hugging Face for AI processing.
*   **Keyboard Shortcuts:** Power-user features for faster navigation and interaction.

## Local Setup

To get the Student AI Toolkit running locally, follow these steps:

### Prerequisites

*   Node.js v18+ (with npm or pnpm)
*   Python 3.11+
*   API keys for:
    *   OpenAI and/or Hugging Face
    *   Google reCAPTCHA v3

### Installation (Development)

```bash
git clone https://github.com/Oleksiy-Zhukov/students-ai-toolkit.git
cd students-ai-toolkit
```

#### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

**Example `.env` values:**

```env
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_TOKEN=hf_...
AI_BACKEND=openai
RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

#### Frontend (React + Vite)

```bash
cd ../frontend
npm install
```

### Running the Application

**Backend:**

```bash
cd backend && python main.py
```

**Frontend:**

```bash
cd frontend && npm run dev
```

Access the application in your browser at: [http://localhost:5173](http://localhost:5173) (or similar)

## Deployment

The Student AI Toolkit is already deployed and accessible:

*   **Frontend:** [Vercel](https://vercel.com/) → [studentsai.org](https://www.studentsai.org/)
*   **Backend:** [Railway](https://railway.app/) → [api.studentsai.org](https://api.studentsai.org/)

## Recent Updates

### Enhanced UI/UX (Latest)
- **Progressive Disclosure:** Smart UI flow that reveals features as users progress
- **Japanese-Inspired Design:** Clean, minimal aesthetic with subtle animations
- **Enhanced Animations:** Smooth transitions and micro-interactions throughout
- **Keyboard Shortcuts:** Power-user features for faster navigation
- **Retro Tooltips:** Contextual help with 90s-inspired styling
- **Improved Accessibility:** Better focus states and keyboard navigation
- **Responsive Improvements:** Enhanced mobile and tablet experience

## Future

Our vision for the Student AI Toolkit includes:

*   User accounts & history
*   Flashcard generation
*   Database for persistence
*   More input types (URLs, web pages)
*   Custom AI prompt builder
*   Collaborative study features
*   Advanced analytics and insights

Explore our progress and contribute to future enhancements by viewing [open issues](https://github.com/Oleksiy-Zhukov/students-ai-toolkit/issues).

## Contributing

We welcome contributions and feedback from the community! Whether you're a student, developer, or AI enthusiast, your insights are valuable.

*   Fork the repository.
*   Star ⭐ the project.
*   Suggest improvements and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE)—free for personal and commercial use.

## 👋 About the Developer

Hi, I'm Oleksii Zhukov, the creator of the Student AI Toolkit. I'm a student and developer dedicated to exploring the intersection of AI and education. Passionate about Data Science and AI.

Let's connect:

*   [LinkedIn](https://www.linkedin.com/in/oleksiizhukov/)
*   [Kaggle](https://www.kaggle.com/zhukovoleksiy)
*   [X (Twitter)](https://x.com/oleksii_zh) (recently created)
*   [Telegram](https://t.me/zhukovoleksii)

Support the Project: [Buy Me a Coffee link](https://buymeacoffee.com/oleksiizh)
