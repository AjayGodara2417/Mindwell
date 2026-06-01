# import requests

# url = "http://127.0.0.1:5000/final-predict"

# data = {
#     "score": 37,
#     "emotions": {
#         "sad": 3,
#         "happy": 1
#     }
# }

# res = requests.post(url, json=data)
# print(res.json())


import requests

url = "http://127.0.0.1:5000/final-predict"

data = {
    "score": 55,
    "emotions": {
        "sad": 4,
        "angry": 2,
        "happy": 1
    }
}

response = requests.post(url, json=data)

# print("\n🔥 FULL RESPONSE:")
# print(response.json())

print("\n🧠 Recommendations:")
for r in response.json().get("recommendations", []):
    print("-", r)

print("\n🥗 Diet:")
for d in response.json().get("diet", []):
    print("-", d)

# print("\n⚠️ Consult Doctor:", response.json().get("consult_doctor"))