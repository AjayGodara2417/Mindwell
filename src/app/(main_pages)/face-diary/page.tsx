"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import { Video, StopCircle, Loader2 } from "lucide-react"
import * as faceapi from "face-api.js"

export default function FaceDiary() {
  const webcamRef = useRef<Webcam | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const requestRef = useRef<number>(0)
  // Use a ref for capturing to prevent stale closures in the detection loop
  const isCapturingRef = useRef(false)

  const [capturing, setCapturing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [loadingModels, setLoadingModels] = useState(true)
  const [faceDetected, setFaceDetected] = useState(false)

  const chunksRef = useRef<Blob[]>([])

  /* ---------------- FACE DETECTION ---------------- */

  const startDetection = useCallback(() => {
    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        canvasRef.current
      ) {
        const video = webcamRef.current.video
        const { videoWidth, videoHeight } = video

        const displaySize = { width: videoWidth, height: videoHeight }
        faceapi.matchDimensions(canvasRef.current, displaySize)

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()

        const resized = faceapi.resizeResults(detections, displaySize)

        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, displaySize.width, displaySize.height)
          if (resized.length > 0) {
            setFaceDetected(true)
            faceapi.draw.drawDetections(canvasRef.current, resized)
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
          } else {
            setFaceDetected(false)
          }
        }
      }
      requestRef.current = requestAnimationFrame(detect)
    }
    detect()
  }, [])

  /* ---------------- LOAD AI MODELS ---------------- */

  useEffect(() => {
    let isMounted = true
    const loadModels = async () => {
      const MODEL_URL = "/models"
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ])
        if (isMounted) {
          setLoadingModels(false)
          startDetection()
        }
      } catch (err) {
        console.error("Model load error", err)
        if (isMounted) setLoadingModels(false)
      }
    }

    loadModels()
    return () => {
      isMounted = false
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [startDetection])

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (capturing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && capturing) {
      handleStopCapture()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [capturing, timeLeft])

  /* ---------------- ANALYSIS ---------------- */

  const handleAnalysis = useCallback(async () => {
    setAnalyzing(true)
    const blob = new Blob(chunksRef.current, {
      type: mediaRecorderRef.current?.mimeType || "video/webm",
    })

    if (blob.size < 1000) {
      setAnalyzing(false)
      return
    }

    const formData = new FormData()
    formData.append("file", blob, "face-diary.webm")

    try {
      const API_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error(error)
      setAnalysisResult({
        emotion: "Error",
        confidence: 0,
        summary: "Could not connect to ML server.",
        keyPoints: ["Server unavailable"],
      })
    } finally {
      setAnalyzing(false)
    }
  }, [])

  /* ---------------- START RECORD ---------------- */

  const handleStartCapture = useCallback(() => {
    if (!webcamRef.current?.stream) return

    setCapturing(true)
    isCapturingRef.current = true
    setTimeLeft(30)
    chunksRef.current = []

    // Fallback for different browsers
    const mimeType = MediaRecorder.isTypeSupported("video/webm") 
      ? "video/webm" 
      : "video/mp4"

    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, { mimeType })
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      handleAnalysis()
    }

    mediaRecorder.start()
  }, [handleAnalysis])

  /* ---------------- STOP RECORD ---------------- */

  const handleStopCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setCapturing(false)
    isCapturingRef.current = false
  }, [])

  /* ---------------- RESET ---------------- */

  const reset = () => {
    setAnalysisResult(null)
    setTimeLeft(30)
  }

  return (
  <div className="max-w-4xl mx-auto space-y-8">

    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Video className="text-blue-500"/>
        Face Diary
      </h1>
      <p className="text-gray-400 mt-1">
        Record a 30 second video to analyze your emotional state
      </p>
    </div>

    {/* Camera Card */}
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">

      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">

        {analyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <Loader2 className="animate-spin w-10 h-10 text-blue-500 mb-3"/>
            <p className="text-white">Analyzing emotions...</p>
          </div>
        )}

        <Webcam
          ref={webcamRef}
          audio
          mirrored
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {capturing && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
        )}
      </div>

      {/* Face Status */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-400">
          {loadingModels
            ? "Loading AI models..."
            : faceDetected
            ? "Face detected"
            : "No face detected"}
        </span>

        <span
          className={`px-2 py-1 rounded text-xs ${
            faceDetected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {faceDetected ? "Ready" : "Align face"}
        </span>
      </div>
    </div>

    {/* Record Button */}
    {!analysisResult && !analyzing && (
      <div className="flex justify-center">

        {capturing ? (
          <button
            onClick={handleStopCapture}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:scale-110 transition"
          >
            <StopCircle />
          </button>
        ) : (
          <button
            disabled={!faceDetected || loadingModels}
            onClick={handleStartCapture}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-110 transition disabled:opacity-40"
          >
            <div className="w-6 h-6 bg-red-500 rounded-full"/>
          </button>
        )}
      </div>
    )}

    {/* Analysis Result */}
    {analysisResult && (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">

        <h2 className="text-xl font-semibold text-white mb-3">
          Emotion Analysis
        </h2>

        <p className="text-gray-300 mb-4">
          {analysisResult.summary}
        </p>

        {analysisResult.emotion && (
          <p className="text-blue-400 mb-4">
            Dominant Emotion: {analysisResult.emotion}
          </p>
        )}

        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          Record Again
        </button>
      </div>
    )}
  </div>
)
}