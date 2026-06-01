import joblib
import numpy as np

# Load models
model = joblib.load("C:\\Users\\luxma\\OneDrive\\Desktop\\new\\Mindwell\\ml-service\\models\\eeg_model.pkl")
scaler = joblib.load("C:\\Users\\luxma\\OneDrive\\Desktop\\new\\Mindwell\\ml-service\\models\\scaler.pkl")
selector = joblib.load("C:\\Users\\luxma\\OneDrive\\Desktop\\new\\Mindwell\\ml-service\\models\\selector.pkl")
imputer = joblib.load("C:\\Users\\luxma\\OneDrive\\Desktop\\new\\Mindwell\\ml-service\\models\\imputer.pkl")

def predict_eeg(input_data):
    input_data = np.array(input_data).reshape(1, -1)

    input_data = imputer.transform(input_data)
    input_data = scaler.transform(input_data)
    input_data = selector.transform(input_data)

    prediction = model.predict(input_data)

    return int(prediction[0])