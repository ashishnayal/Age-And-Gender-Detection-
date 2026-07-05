from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2 as cv
import numpy as np
from deepface import DeepFace

app = FastAPI(title="Age and Gender Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv.imdecode(nparr, cv.IMREAD_COLOR)

    if frame is None:
        return {"error": "Invalid image format"}

    try:
        # DeepFace analyze returns a list of dictionaries, one for each face
        # Setting enforce_detection to False allows it to return no faces without crashing
        analysis = DeepFace.analyze(
            img_path=frame,
            actions=['age', 'gender'],
            enforce_detection=False,
            detector_backend='opencv' # use opencv for fast face detection
        )
    except ValueError as e:
        # DeepFace might throw if face detection fails completely
        return {"results": []}

    results = []
    
    # DeepFace returns a single dict if there's only 1 face, but in newer versions it returns a list
    if not isinstance(analysis, list):
        analysis = [analysis]
        
    for face in analysis:
        # Check if a face was actually found by seeing if facial_area exists and has width
        area = face.get("region", face.get("facial_area", {}))
        if not area or area.get('w', 0) == 0:
            continue
            
        # Extract bounding box
        x = area['x']
        y = area['y']
        w = area['w']
        h = area['h']
        
        # DeepFace returns gender as a dict in newer versions: {'Woman': 99.9, 'Man': 0.1}
        # or as a string in older versions. 
        # dominant_gender holds the string.
        gender_str = face.get('dominant_gender', 'Unknown')
        # Standardize our output to Male/Female
        if gender_str.lower() == 'man':
            gender_str = 'Male'
        elif gender_str.lower() == 'woman':
            gender_str = 'Female'
            
        # Confidence logic for gender
        gender_conf = 1.0
        gender_dict = face.get('gender')
        if isinstance(gender_dict, dict):
            # extract the max confidence divided by 100
            max_val = max(gender_dict.values())
            gender_conf = float(max_val) / 100.0
            
        # Age
        age = face.get('age', 0)
        
        results.append({
            "box": {"x1": x, "y1": y, "x2": x + w, "y2": y + h},
            "gender": gender_str,
            "gender_confidence": gender_conf,
            "age": str(age),
            "age_confidence": 0.99 # DeepFace doesn't provide age confidence naturally
        })

    return {"results": results}
