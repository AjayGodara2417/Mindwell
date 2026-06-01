from deepface import DeepFace
import numpy as np

EMOTIONS = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

def predict_emotion(frame):
    try:
        result = DeepFace.analyze(
            frame,
            actions=["emotion"],
            enforce_detection=False,
            detector_backend="opencv"
        )

        # ✅ Fix np.float32 → regular float
        emotions = {k: float(v) for k, v in result[0]["emotion"].items()}
        dominant = result[0]["dominant_emotion"]

        print("✅ DeepFace result:", dominant)

        return dominant, emotions

    except Exception as e:
        print("❌ DeepFace ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return "neutral", {k: 0.0 for k in EMOTIONS}