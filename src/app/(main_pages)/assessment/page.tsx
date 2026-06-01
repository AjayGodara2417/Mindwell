"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { id: 1, question: "I feel sad or empty most of the day." },
  { id: 2, question: "I have lost interest in activities I used to enjoy." },
  { id: 3, question: "I have trouble falling asleep or staying asleep." },
  { id: 4, question: "I feel tired or have little energy." },
  { id: 5, question: "I have changes in my appetite or weight." },
  { id: 6, question: "I feel worthless or guilty." },
  { id: 7, question: "I have trouble concentrating or making decisions." },
  { id: 8, question: "I feel restless or slowed down." },
  { id: 9, question: "I have thoughts of death or suicide." },
  { id: 10, question: "I feel anxious or worried." },
  { id: 11, question: "I get irritated easily." },
  { id: 12, question: "I feel hopeless about the future." },
  { id: 13, question: "I isolate myself from friends and family." },
  { id: 14, question: "I feel overwhelmed by daily tasks." },
  { id: 15, question: "I have physical aches or pains without clear cause." },
  { id: 16, question: "I feel like crying for no reason." },
  { id: 17, question: "I have trouble getting out of bed." },
  { id: 18, question: "I feel like a failure." },
  { id: 19, question: "I criticize myself constantly." },
  { id: 20, question: "I feel lonely even when with others." },
  { id: 21, question: "I have no motivation to do anything." },
  { id: 22, question: "I feel like a burden to others." },
  { id: 23, question: "I have trouble enjoying food." },
  { id: 24, question: "I feel numb or empty." },
  { id: 25, question: "I feel like life is not worth living." },
];

const options = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Always", value: 3 },
];

export default function AssessmentPage() {
  const router = useRouter();

  /* ---------------- STATES ---------------- */
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [emotions, setEmotions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);   // 🔥 FIX
  const [allowed, setAllowed] = useState(false);  // 🔥 FIX


  // ✅ AFTER
  const [latestEmotionData, setLatestEmotionData] = useState<{
    emotion: string;
    confidence: number;
    condition: string;
    stress_score: number;
    emotions: Record<string, number>;
  } | null>(null);

  // const [emotionReady, setEmotionReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [started, setStarted] = useState(false);

  /* ---------------- REFS ---------------- */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* ---------------- DAILY CHECK (SAFE) ---------------- */
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/assessment?email=${email}`);
        const data = await res.json();

        let blockedToday = false;

        if (data.history) {
          const today = new Date().toDateString();

          blockedToday = data.history.some((item: any) =>
            new Date(item.created_at).toDateString() === today
          );
        }

        if (blockedToday) {
          alert("⚠️ You already completed today's assessment.");
          router.push("/dashboard");
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error(err);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, 640, 480);

    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
  };


  const summarizeEmotions = () => {
    const combined: Record<string, number> = {};

    emotions.forEach((frame: any) => {
      if (!frame) return;

      Object.entries(frame).forEach(([key, value]: any) => {
        combined[key] = (combined[key] || 0) + value;
      });
    });

    return combined;
  };

  const getDominantEmotion = () => {
    const summary = summarizeEmotions();
    let max = 0;
    let dominant = "neutral";

    for (let key in summary) {
      if (summary[key] > max) {
        max = summary[key];
        dominant = key;
      }
    }

    return dominant;
  };



  useEffect(() => {
    if (started) startCamera();
    return () => stopCamera();
  }, [started]);


  useEffect(() => {
    if (!started) return;

    const interval = setInterval(async () => {
      const frame = captureFrame();
      if (!frame) return;

      try {
        const res = await fetch("http://localhost:5000/emotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: frame }),
        });

        const data = await res.json();

        if (data && data.emotions) {
          setEmotions((prev: any) => [...prev, data.emotions]);
          setLatestEmotionData(data);
          // setEmotionReady(true);
        }
      } catch (err) {
        console.error("❌ Emotion fetch error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [started]);


  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) return;  // questions show automatically

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  /* ---------------- ANSWER ---------------- */
  const handleAnswer = async (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);

    setTimeout(async () => {
      if (current < questions.length - 1) {
        setCurrent((prev) => prev + 1);
        return;
      }

      const totalScore = updated.reduce((sum, v) => (sum ?? 0) + (v || 0), 0);
      const percentage = Math.round(((totalScore ?? 0) / 75) * 100);
      const email = localStorage.getItem("userEmail");

      stopCamera();

      const emotionSummary = summarizeEmotions();

      const finalEmotionSummary = Object.keys(emotionSummary).length === 0
        ? { neutral: 1 }
        : emotionSummary;
      const dominantEmotion = getDominantEmotion();

      // console.log("Emotion Summary:", emotionSummary);
      // console.log("Total Score:", totalScore);
      // console.log("ML Emotion:", latestEmotionData?.emotion);

      let finalData: any = null;

      try {
        console.log("STEP 1: Sending to ML API");
        const res = await fetch("http://127.0.0.1:5000/final-predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: totalScore,
            emotions: finalEmotionSummary,  // ✅ CHANGED
            ml_emotion: latestEmotionData?.emotion,
          }),
        });


        const response = await res.json();

        console.log("STEP 3: ML RESPONSE:", response);

        console.log("Total Score:", totalScore);
        console.log("Emotion Summary:", emotionSummary);
        console.log("ML Response:", response);
        console.log("Final Score from ML:", response?.final_score);
        console.log("Questionnaire Score from ML:", response?.questionnaire_score);

        if (!response) {
          console.error("EMPTY ML RESPONSE");
          return;
        }

        localStorage.setItem(
          "mlResult",
          JSON.stringify(response)   // 🔥 DIRECTLY STORE RESPONSE
        );

        finalData = response;

      } catch (err) {
        console.error(err);
      }

      try {
        const res = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            score: totalScore,
            percentage,
            emotion: finalData?.emotion,  //dominantEmotion,
            severity: finalData?.severity,
            final_score: finalData?.final_score,
            emotion_score: finalData?.confidence || finalData?.emotion_score,

            recommendations: finalData?.recommendations,
            diet: finalData?.diet,
            consult_doctor: finalData?.consult_doctor,
          }),
        });

        console.log("RAW RESPONSE:", res);
        console.log("STATUS:", res.status);

        const data = await res.json(); // ✅ read once

        console.log("API RESPONSE:", data);

        if (!res.ok) {
          alert(data.message);
          return;
        }
      } catch (error) {
        console.error(error);
      }

      localStorage.setItem("lastAssessmentDate", new Date().toDateString());

      router.push("/result-dashboard");
    }, 250);
  };

  const progress = Math.round(((current + 1) / questions.length) * 100);

  /* ---------------- LOADING UI ---------------- */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Checking access...
      </div>
    );
  }

  if (!allowed) return null;

  if (!started) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-6">
        <h1 className="text-2xl font-bold text-slate-800">Mental Health Assessment</h1>
        <p className="text-slate-500 text-sm text-center max-w-md">
          This assessment uses your camera to detect emotions while you answer questions.
          Please ensure you are in a well-lit area.
        </p>
        <button
          onClick={() => {
            setStarted(true);
            setCountdown(5);  // 🔥 start 5 second countdown
          }}
          className="px-8 py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
        >
          Start Assessment
        </button>
      </div>
    );
  }


  if (countdown !== null && countdown > 0) {
    return (
      <>
        <video ref={videoRef} autoPlay muted className="hidden" />
        <div className="h-screen flex items-center justify-center flex-col gap-4">
          <div className="text-5xl font-bold text-teal-500">{countdown}</div>
          <p className="text-slate-500 text-sm">Preparing emotion detection...</p>
        </div>
      </>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <video ref={videoRef} autoPlay muted className="hidden" />

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>Question {current + 1} / {questions.length}</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full mb-6">
            <div
              className="h-2 bg-teal-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center text-slate-800 mb-6">
              {/* {questions[current].question} */}
              {questions[current]?.question || "Loading question..."}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(opt.value)}
                  className="p-4 rounded-xl border text-sm font-medium bg-white hover:border-teal-400"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}