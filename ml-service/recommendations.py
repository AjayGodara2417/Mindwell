import random

def generate_recommendations(final_score, emotion_score, dominant_emotion):
    # -----------------------------
    # ACTIVITY RECOMMENDATIONS
    # -----------------------------
    if final_score < 0.3:
        base = [
            "Do meditation for 10 minutes daily (e.g., guided breathing)",
            "Go for a walk (e.g., morning or evening)",
            "Maintain a healthy routine (fixed sleep cycle)",
            "Stay socially active (talk to friends/family)"
        ]

        diet = [
            "Eat fresh fruits (e.g., apple, banana, papaya)",
            "Drink enough water (2–3 liters daily)",
            "Include light home-cooked meals",
            "Avoid excessive junk food"
        ]

    elif final_score < 0.6:
        base = [
            "Practice meditation and yoga (e.g., pranayama, surya namaskar)",
            "Try chanting (e.g., Om chanting, mindfulness breathing)",
            "Take short work breaks",
            "Do light exercise (walking/stretching)"
        ]

        diet = [
            "Include green vegetables (e.g., spinach, broccoli)",
            "Eat nuts (e.g., almonds, walnuts)",
            "Drink herbal teas (e.g., chamomile, green tea)",
            "Reduce caffeine and sugar intake"
        ]

    else:
        base = [
            "Take immediate rest",
            "Reduce workload",
            "Avoid stressful environments",
            # "Seek support from close ones"
        ]

        diet = [
            "Eat calming foods (e.g., warm milk, bananas)",
            "Include magnesium-rich foods (e.g., dark chocolate, nuts)",
            "Avoid caffeine completely",
            "Eat simple and easy-to-digest food"
        ]

    # -----------------------------
    # EMOTION BASED
    # -----------------------------
    emotion_map = {
        "sad": [
            # "Talk to someone you trust",
            "Try journaling your thoughts",
            "Spend time in nature"
        ],
        "angry": [
            "Do physical exercise (running/gym)",
            "Practice deep breathing",
            "Take a pause before reacting"
        ],
        "fear": [
            "Practice grounding techniques",
            "Focus on slow breathing",
            "Avoid overthinking triggers"
        ],
        "happy": [
            "Continue your routine",
            "Spread positivity"
        ]
    }

    emotion_recs = emotion_map.get(dominant_emotion, [])

    # -----------------------------
    # COMBINE + RANDOMIZE
    # -----------------------------
    combined = base + emotion_recs
    random.shuffle(combined)
    random.shuffle(diet)

    # -----------------------------
    # DOCTOR CONDITION
    # -----------------------------
    consult_doctor = final_score > 0.7

    if consult_doctor:
        recommendations = [
            # "⚠️ Your stress level is high. Please consult a doctor."
            
        ] + combined[:3]
    else:
        recommendations = combined[:4]

    diet_recommendations = diet[:4]

    return recommendations, diet_recommendations, consult_doctor