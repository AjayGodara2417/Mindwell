"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Video, StopCircle, Loader2, ScanFace, RefreshCcw } from "lucide-react";
import * as faceapi from "face-api.js";

export default function FaceDiary() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const requestRef = useRef<number>(0);
  const isCapturingRef = useRef(false);

  const [capturing, setCapturing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  type AnalysisResult = {
    emotion?: string;
    confidence?: number;
    summary?: string;
    keyPoints?: string[];
  };

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loadingModels, setLoadingModels] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const chunksRef = useRef<Blob[]>([]);

  const startDetection = useCallback(() => {
    const detect = async () => {
      if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4 && canvasRef.current) {
        const video = webcamRef.current.video;
        const { videoWidth, videoHeight } = video;
        const displaySize = { width: videoWidth, height: videoHeight };
        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current.getContext("2d");

        if (ctx) {
          ctx.clearRect(0, 0, displaySize.width, displaySize.height);
          if (resized.length > 0) {
            setFaceDetected(true);
            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
          } else {
            setFaceDetected(false);
          }
        }
      }
      requestRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        if (isMounted) {
          setLoadingModels(false);
          startDetection();
        }
      } catch (err) {
        console.error("Model load error", err);
        if (isMounted) setLoadingModels(false);
      }
    };
    loadModels();
    return () => {
      isMounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [startDetection]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (capturing && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && capturing) {
      handleStopCapture();
    }
    return () => { if (interval) clearInterval(interval); };
  }, [capturing, timeLeft]);

  const handleAnalysis = useCallback(async () => {
    setAnalyzing(true);
    const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current?.mimeType || "video/webm" });
    if (blob.size < 1000) { setAnalyzing(false); return; }

    const formData = new FormData();
    formData.append("file", blob, "face-diary.webm");

    try {
      const API_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/analyze`, { method: "POST", body: formData });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error(error);
      setAnalysisResult({ emotion: "Error", confidence: 0, summary: "Could not connect to ML server.", keyPoints: ["Server unavailable"] });
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const handleStartCapture = useCallback(() => {
    if (!webcamRef.current?.stream) return;
    setCapturing(true);
    isCapturingRef.current = true;
    setTimeLeft(30);
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "video/mp4";
    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, { mimeType });
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
    mediaRecorder.onstop = () => handleAnalysis();
    mediaRecorder.start();
  }, [handleAnalysis]);

  const handleStopCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
    setCapturing(false);
    isCapturingRef.current = false;
  }, []);

  const reset = () => {
    setAnalysisResult(null);
    setTimeLeft(30);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-xl text-teal-700">
              <Video size={24} />
            </div>
            Face Diary
          </h1>
          <p className="text-slate-500 text-sm mt-2 ml-14">
            Record a short video to analyze your emotional state using AI.
          </p>
        </div>
      </div>

      {/* Camera Container */}
      <div className="bg-white p-2 rounded-3xl shadow-lg border border-slate-100">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group">

          {/* Loading Overlay */}
          {loadingModels && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-30">
              <Loader2 className="animate-spin w-10 h-10 text-teal-500 mb-4" />
              <p className="text-slate-300 font-medium">Loading AI Models...</p>
            </div>
          )}

          {/* Analyzing Overlay */}
          {analyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-30">
              <Loader2 className="animate-spin w-10 h-10 text-white mb-4" />
              <p className="text-white font-medium">Analyzing expressions...</p>
            </div>
          )}

          <Webcam
            ref={webcamRef}
            audio
            mirrored
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Recording Timer */}
          {capturing && (
            <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${faceDetected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></div>
            <span className="text-sm font-medium text-slate-600">
              {loadingModels ? "Initializing..." : faceDetected ? "Face Detected" : "No Face Detected"}
            </span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${faceDetected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {faceDetected ? "Ready to Record" : "Align Face"}
          </span>
        </div>
      </div>

      {/* Controls */}
      {!analysisResult && !analyzing && (
        <div className="flex justify-center py-4">
          {capturing ? (
            <button
              onClick={handleStopCapture}
              className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
            >
              <span className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-75"></span>
              <StopCircle className="text-white w-8 h-8 relative z-10" />
            </button>
          ) : (
            <button
              disabled={!faceDetected || loadingModels}
              onClick={handleStartCapture}
              className="group flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/30"
            >
              <div className="w-8 h-8 bg-white rounded-full group-hover:scale-110 transition-transform"></div>
            </button>
          )}
        </div>
      )}

      {/* Results Card */}
      {analysisResult && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Emotion Analysis</h2>
              <p className="text-slate-500 text-sm mt-1">Based on your facial expressions during recording.</p>
            </div>
            <button onClick={reset} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-teal-600 transition-colors">
              <RefreshCcw size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dominant Emotion</p>
              <p className="text-2xl font-bold text-teal-700">{analysisResult.emotion}</p>
              {analysisResult.confidence !== undefined && (
                <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${analysisResult.confidence * 100}%` }}></div>
                </div>
              )}
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Summary</p>
              <p className="text-slate-700 text-sm leading-relaxed">{analysisResult.summary}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={reset} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20">
              Record New Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}