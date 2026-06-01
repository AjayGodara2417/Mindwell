from collections import deque
from deepface import DeepFace
import cv2

# -----------------------------------------------
# GLOBAL BUFFER — maxlen=7 for smooth but responsive detection
# -----------------------------------------------
emotion_buffer = deque(maxlen=4)


def clear_buffer():
    """Call this after warm-up so dummy frames don't poison real detections"""
    emotion_buffer.clear()


def analyze_emotion(frame, is_warmup=False):
    try:
        # ------------------------
        # VALIDATE FRAME
        # ------------------------
        if frame is None or frame.size == 0:
            raise ValueError("Empty or null frame received")

        # ------------------------
        # PREPROCESS FRAME
        # ------------------------
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_rgb = cv2.resize(frame_rgb, (640, 480))

        # ------------------------
        # DEEPFACE PREDICTION
        # ------------------------
        result = DeepFace.analyze(
            frame_rgb,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='ssd'
        )

        if not result or not isinstance(result, list):
            raise ValueError("DeepFace returned empty result")

        emotions = result[0].get('emotion', None)
        if not emotions:
            raise ValueError("No emotion data in DeepFace result")

        # -----------------------------------------------
        # Skip buffer storage for warm-up frames
        # so dummy black frame doesn't poison real detections
        # -----------------------------------------------
        if is_warmup:
            return _default_response()

        # ------------------------
        # STORE IN BUFFER
        # ------------------------
        emotion_buffer.append(emotions)

        if len(emotion_buffer) == 0:
            return _default_response()

        # ------------------------
        # WEIGHTED AVERAGE — recent frames weighted higher
        # ------------------------
        weights      = list(range(1, len(emotion_buffer) + 1))
        total_weight = sum(weights)

        avg_emotions = {
            e: sum(w * f[e] for w, f in zip(weights, emotion_buffer)) / total_weight
            for e in emotions.keys()
        }

        total_score = sum(avg_emotions.values())

        # ------------------------
        # DOMINANT EMOTION
        # ------------------------
        dominant_emotion = max(avg_emotions, key=avg_emotions.get)
        max_value        = avg_emotions[dominant_emotion]

        # ------------------------------------------------
        # BIAS FIXES — in correct order:
        #
        # FIX 1: Very low confidence → force neutral
        # FIX 2: Neutral suppression → promote real emotions
        #
        # NOTE: Angry suppression (FIX 3) has been REMOVED.
        # It was comparing angry against itself via max(), which
        # caused it to demote angry even at 81.6% confidence.
        # ------------------------------------------------

        # FIX 1: Only force neutral if truly no signal
        if max_value < 20:
            dominant_emotion = "neutral"

        # FIX 2: If stuck on neutral but another emotion is close, promote it
        if dominant_emotion == "neutral":
            non_neutral = {e: v for e, v in avg_emotions.items() if e != "neutral"}
            if non_neutral:
                best_alt  = max(non_neutral, key=non_neutral.get)
                if non_neutral[best_alt] > avg_emotions["neutral"] * 0.55:
                    dominant_emotion = best_alt

        # ------------------------
        # STRESS SCORE
        # ------------------------
        if total_score == 0:
            stress_score = 0.0
        else:
            stress_score = (
                avg_emotions.get("angry",   0) * 1.2 +
                avg_emotions.get("fear",    0) * 1.0 +
                avg_emotions.get("sad",     0) * 0.9 +
                avg_emotions.get("disgust", 0) * 0.7 -
                avg_emotions.get("happy",   0) * 0.8
            ) / total_score

        # Clamp BEFORE condition classification
        stress_score = max(0.0, min(1.0, stress_score))

        # ------------------------
        # CONFIDENCE SCORE
        # ------------------------
        confidence = (max_value / total_score) if total_score != 0 else 0.5
        confidence = max(0.0, min(1.0, confidence))

        # ------------------------
        # CONDITION CLASSIFICATION
        # ------------------------
        if stress_score > 0.6:
            condition = "High Stress"
        elif stress_score > 0.3:
            condition = "Moderate Stress"
        else:
            condition = "Low Stress"

        return {
            "emotion":      dominant_emotion,
            "confidence":   float(confidence),
            "stress_score": float(stress_score),
            "condition":    condition,
            "emotions":     {k: float(v) for k, v in avg_emotions.items()}
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[analyze_emotion ERROR]: {e}")
        return _default_response()


def _default_response():
    return {
        "emotion":      "neutral",
        "confidence":   0.5,
        "stress_score": 0.3,
        "condition":    "Low Stress",
        "emotions":     {}
    }