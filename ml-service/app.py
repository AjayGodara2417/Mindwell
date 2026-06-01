from recommendations import generate_recommendations

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
import traceback

from face_diary.emotion import analyze_emotion, clear_buffer

app = Flask(__name__)
CORS(app)


# =========================
# HEALTH CHECK
# =========================
@app.route("/")
def home():
    return jsonify({"status": "Emotion API Running"})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


# =========================
# EMOTION ENDPOINT
# =========================
@app.route("/emotion", methods=["POST"])
def emotion():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        img_data = base64.b64decode(data["image"])
        np_arr   = np.frombuffer(img_data, np.uint8)
        frame    = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid image"}), 400

        result = analyze_emotion(frame)

        return jsonify({
            "emotion":      result["emotion"],
            "confidence":   float(result["confidence"]),
            "condition":    result["condition"],
            "stress_score": float(result["stress_score"]),
            "emotions":     result["emotions"]
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================
# FINAL PREDICT ENDPOINT
# =========================
@app.route("/final-predict", methods=["POST"])
def final_predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400

        score      = data.get("score", 0)
        emotions   = data.get("emotions", {})
        ml_emotion = data.get("ml_emotion", None)

        total = sum(emotions.values()) if emotions else 0

        if total == 0:
            emotions = {"neutral": 1}
            total    = 1

        emotions = {k: v / total for k, v in emotions.items()}

        # -----------------------------------------------
        # DOMINANT EMOTION
        # ml_emotion trusted only if it is NOT neutral
        # -----------------------------------------------
        if ml_emotion and ml_emotion != "neutral":
            dominant_emotion = ml_emotion
        else:
            sorted_emotions       = sorted(emotions.items(), key=lambda x: x[1], reverse=True)
            dominant_emotion, top1 = sorted_emotions[0]
            top2 = sorted_emotions[1][1] if len(sorted_emotions) > 1 else 0
            gap  = top1 - top2

            # Only force neutral if signal is truly ambiguous
            if top1 < 0.25 or gap < 0.06:
                dominant_emotion = "neutral"

        print("Dominant Emotion : ", dominant_emotion)

        # -----------------------------------------------
        # EMOTION SCORE
        # neutral has weight 0.2 so score is never 0
        # -----------------------------------------------
        emotion_score = (
            emotions.get("angry",    0) * 0.8 +
            emotions.get("fear",     0) * 0.8 +
            emotions.get("sad",      0) * 0.7 +
            emotions.get("disgust",  0) * 0.6 +
            emotions.get("neutral",  0) * 0.2 -
            emotions.get("happy",    0) * 0.9 -
            emotions.get("surprise", 0) * 0.1
        )

        emotion_score = max(0, min(1, emotion_score))

        print("Emotion Score : ", emotion_score)

        # -----------------------------------------------
        # QUESTIONNAIRE SCORE
        # -----------------------------------------------
        stress_score = max(0, min(1, score / 75))

        print("Stress Score : ", stress_score)

        # -----------------------------------------------
        # FINAL SCORE
        # -----------------------------------------------
        final_score = (0.75 * stress_score) + (0.25 * emotion_score)

        print("Final Score : ", final_score)

        # -----------------------------------------------
        # LEVEL CLASSIFICATION
        # -----------------------------------------------
        if final_score >= 0.7:
            level = "High Stress"
        elif final_score >= 0.4:
            level = "Moderate Stress"
        else:
            level = "Low Stress"

        # -----------------------------------------------
        # RECOMMENDATIONS
        # -----------------------------------------------
        recommendations, diet_recommendations, consult_doctor = generate_recommendations(
            final_score,
            emotion_score,
            dominant_emotion
        )

        return jsonify({
            "severity":            level,
            "final_score":         round(final_score, 3),
            "emotion_score":       round(emotion_score, 3),
            "questionnaire_score": round(stress_score, 3),
            "emotion":             dominant_emotion,
            "recommendations":     recommendations,
            "diet":                diet_recommendations,
            "consult_doctor":      consult_doctor
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================
# WARM UP MODEL + START
# =========================
def warm_up():
    """
    Pre-loads DeepFace model weights into memory.
    Uses is_warmup=True so the dummy black frame is NOT stored
    in the emotion buffer — prevents buffer poisoning.
    """
    try:
        dummy = np.zeros((480, 640, 3), dtype=np.uint8)
        analyze_emotion(dummy, is_warmup=True)
        clear_buffer()  # safety clear — ensures buffer is clean for real frames
        print("✅ Model warmed up and ready")
    except Exception as e:
        print(f"⚠️ Warm-up failed (non-critical): {e}")


if __name__ == "__main__":
    warm_up()
    print("🚀 Server running on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)