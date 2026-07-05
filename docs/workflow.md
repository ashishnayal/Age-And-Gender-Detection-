# Project Execution Workflow

Follow these steps to run the complete Age and Gender Detection application. This involves starting a Python FastAPI backend and a Next.js React frontend.

## Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher (with npm)

## 1. Setup the Backend (FastAPI)

1. **Navigate to the root directory**:
   ```bash
   cd "C:\Users\91827\Desktop\Age and Gender Detection\gender_and_age-prediction-main"
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *(If you are using a virtual environment, ensure it is activated first).*

3. **Start the API server**:
   ```bash
   uvicorn api:app --reload
   ```
   The backend will start on `http://127.0.0.1:8000`. You can visit `http://127.0.0.1:8000/docs` to see the interactive API documentation (Swagger UI).

---

## 2. Setup the Frontend (Next.js)

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd "C:\Users\91827\Desktop\Age and Gender Detection\gender_and_age-prediction-main\frontend"
   ```

2. **Start the development server**:
   *(npm install has already been run for you during initialization)*
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`.

---

## 3. Usage

1. Open your web browser and go to `http://localhost:3000`.
2. You will see the **Advanced Demographics AI** premium interface.
3. Click "Select File" or drag & drop an image containing a face into the upload area.
4. The frontend will communicate with the Python backend, process the image, and gracefully animate the results onto the screen, showing the detected face, age, and gender bounding boxes!

## Troubleshooting
- **CORS Errors**: If the frontend cannot communicate with the backend, ensure the backend was started correctly and is running on port 8000.
- **Missing Models**: Ensure the `.caffemodel` and `.prototxt` files are present in the root directory where you started `uvicorn`.
