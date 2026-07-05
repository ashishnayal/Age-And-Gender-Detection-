'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './page.module.css';

interface Prediction {
  box: { x1: number; y1: number; x2: number; y2: number };
  gender: string;
  gender_confidence: number;
  age: string;
  age_confidence: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Webcam state
  const [hasCamera, setHasCamera] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Send image to API
  const processImageFile = async (file: File) => {
    setPredictions([]);
    setError(null);
    setIsLoading(true);

    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setPredictions(data.results || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "webcam_capture.jpg", { type: "image/jpeg" });
            processImageFile(file);
            setActiveTab('upload'); // Switch back to view results
          }
        }, 'image/jpeg', 0.95);
      }
    }
  }, []);

  // Camera stream setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        setHasCamera(false);
      }
    };

    if (activeTab === 'camera') {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  // Draw bounding boxes on results
  useEffect(() => {
    const drawBoxes = () => {
      if (!imageRef.current || !canvasRef.current || predictions.length === 0) return;

      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;

      const scaleX = img.clientWidth / img.naturalWidth;
      const scaleY = img.clientHeight / img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      predictions.forEach((pred, index) => {
        const { x1, y1, x2, y2 } = pred.box;
        
        const scaledX = x1 * scaleX;
        const scaledY = y1 * scaleY;
        const scaledWidth = (x2 - x1) * scaleX;
        const scaledHeight = (y2 - y1) * scaleY;

        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        const label = `Face ${index + 1}`;
        ctx.fillStyle = '#00d2ff';
        ctx.font = 'bold 16px Inter';
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(scaledX, scaledY - 25, textWidth + 10, 25);

        ctx.fillStyle = '#1e2130';
        ctx.fillText(label, scaledX + 5, scaledY - 7);
      });
    };

    drawBoxes();
    window.addEventListener('resize', drawBoxes);
    return () => window.removeEventListener('resize', drawBoxes);
  }, [predictions, imageSrc]);

  return (
    <main className={styles.container}>
      <section className={`${styles.hero} animate-fade-in`}>
        <h1 className={`${styles.title} text-gradient`}>Advanced Demographics AI</h1>
        <p className={styles.subtitle}>
          Instantly detect age and gender using our highly optimized deep learning models. Upload an image or use your webcam to see it in action.
        </p>

        <div className={styles.useCases}>
          <div className={`${styles.card} glass-panel`}>
            <h3>🎯 Audience Analysis</h3>
            <p>Understand your demographic in real-time for physical retail stores or interactive digital kiosks.</p>
          </div>
          <div className={`${styles.card} glass-panel`}>
            <h3>✨ Personalized UI</h3>
            <p>Adapt digital experiences and content dynamically based on the user's estimated age and gender.</p>
          </div>
          <div className={`${styles.card} glass-panel`}>
            <h3>🛡️ Security & Safety</h3>
            <p>Implement age-gating mechanisms for restricted content or products automatically.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.mainContent} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        <div>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.active : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Image
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'camera' ? styles.active : ''}`}
              onClick={() => setActiveTab('camera')}
            >
              Use Webcam
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className={`${styles.uploadSection} glass-panel`}>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleFileUpload}
              />
              <div className={styles.uploadIcon}>📸</div>
              <h3>Drag & Drop an image</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>or click to browse</p>
              <button className="btn-primary">
                Select File
              </button>
            </div>
          ) : (
            <div className={`${styles.webcamContainer} glass-panel`}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={styles.webcamVideo} 
              />
              {!hasCamera && (
                <p style={{ position: 'absolute', color: 'var(--text-muted)' }}>
                  Requesting camera access...
                </p>
              )}
              {hasCamera && (
                <button 
                  className={`btn-primary ${styles.captureBtn}`} 
                  onClick={capturePhoto}
                  style={{ position: 'absolute', bottom: '20px' }}
                >
                  Capture Photo
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`${styles.resultsSection} glass-panel`}>
          <h2 className={styles.resultsHeader}>Analysis Results</h2>
          
          {isLoading ? (
            <div className={styles.placeholder}>
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className={styles.placeholder} style={{ color: '#ef4444' }}>
              {error}
            </div>
          ) : imageSrc ? (
            <>
              <div className={styles.imageContainer}>
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Uploaded preview"
                  onLoad={() => {
                    setPredictions([...predictions]);
                  }}
                />
                <canvas ref={canvasRef} className={styles.canvas} />
              </div>

              {predictions.length > 0 ? (
                <div className={styles.statsList}>
                  {predictions.map((pred, i) => (
                    <div key={i} className={styles.statItem} style={{ animation: `fadeIn 0.5s ease forwards ${i * 0.1}s` }}>
                      <h4>Face {i + 1}</h4>
                      <p>
                        <strong>Gender:</strong> {pred.gender} ({(pred.gender_confidence * 100).toFixed(1)}%)
                      </p>
                      <p>
                        <strong>Age:</strong> {pred.age} ({(pred.age_confidence * 100).toFixed(1)}%)
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No faces detected.</p>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>
              Select an image or capture a photo to view results
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
