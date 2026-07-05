# 🎯 Advanced Age & Gender Detection 

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15-black.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

A complete, production-ready full-stack application that leverages state-of-the-art Deep Learning models to instantly detect faces and predict their **Age** and **Gender** with incredible accuracy.

---

## ✨ Features

- **🧠 State-of-the-Art Deep Learning:** Upgraded to use **DeepFace** (backed by VGG-Face / TensorFlow) for highly precise real-world demographic predictions, completely replacing outdated OpenCV Caffe models.
- **📸 Real-time Webcam Support:** Seamlessly integrated browser-based webcam capturing to instantly analyze faces on the fly!
- **⚡ High-Performance Backend:** A fully optimized **FastAPI** Python backend capable of processing multiple faces in a single frame.
- **🎨 Premium UI/UX:** A stunning, dark-mode **Next.js** frontend crafted with glassmorphism aesthetics, fluid micro-animations, and dynamic canvas bounding boxes.
- **🐳 Docker Orchestration:** Effortless deployment using a multi-container Docker Compose setup. Zero manual dependency headaches!

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router) & React
- **Styling:** Custom Vanilla CSS (Glassmorphism, Animations)
- **Features:** Native HTML5 Canvas API, MediaDevices API (Webcam)

### Backend
- **Framework:** FastAPI & Uvicorn
- **AI / ML:** DeepFace, TensorFlow, OpenCV, NumPy
- **Image Processing:** In-memory byte array processing for maximum speed.

---

## 🚀 Getting Started

Running the entire stack is incredibly simple thanks to Docker. 

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone git@github.com:ashishnayal/Age-And-Gender-Detection-.git
   cd Age-And-Gender-Detection-
   ```

2. **Spin up the cluster:**
   ```bash
   docker-compose up --build
   ```
   > **Note:** The very first time you run this, Docker will download the heavy TensorFlow dependencies, and DeepFace will download the state-of-the-art model weights (~few hundred MBs) from the internet when you take your first photo. Subsequent runs will be extremely fast!

3. **Access the Application:**
   Open your browser and navigate to:
   - **Frontend UI:** [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💡 How It Works

1. **Upload or Capture:** The user interacts with the Next.js frontend to either upload a local image or capture a live frame using their webcam.
2. **API Request:** The frontend packages the image as `FormData` and sends a secure POST request to the `/predict` FastAPI endpoint.
3. **AI Analysis:** The backend intercepts the image array in-memory and passes it to the `DeepFace` engine. The engine detects all facial areas and runs classification models to determine Gender and Age.
4. **Visualization:** The JSON payload is returned to the frontend, which uses the Canvas API to instantly draw bounding boxes and overlay the demographic statistics right over the image!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
