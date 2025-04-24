

# # similarity-engine/main.py

# from fastapi import FastAPI, File, UploadFile
# import faiss
# import numpy as np
# from PIL import Image
# from tensorflow.keras.applications.resnet50 import preprocess_input
# from tensorflow.keras.preprocessing import image
# import uvicorn
# import pickle
# import io

# app = FastAPI()

# # Load FAISS index and paths
# index = faiss.read_index("faiss_index/jewellery.index")
# with open("faiss_index/paths.pkl", "rb") as f:
#     paths = pickle.load(f)

# # Load ResNet50 model
# from tensorflow.keras.applications import ResNet50
# model = ResNet50(weights="imagenet", include_top=False, pooling='avg')

# # Extract combined vector (ResNet + color histogram)
# def extract_combined_vector(file_bytes):
#     try:
#         img = Image.open(io.BytesIO(file_bytes)).resize((224, 224)).convert("RGB")
        
#         # ResNet vector
#         x = image.img_to_array(img)
#         x = np.expand_dims(x, axis=0)
#         x = preprocess_input(x)
#         resnet_vector = model.predict(x)[0]

#         # HSV color histogram
#         hsv_img = img.convert("HSV")
#         hsv_np = np.array(hsv_img)
#         hist = []
#         for i in range(3):  # H, S, V
#             h, _ = np.histogram(hsv_np[:, :, i], bins=32, range=(0, 256), density=True)
#             hist.extend(h)

#         color_hist_vector = np.array(hist, dtype='float32')

#         # Combine both
#         combined_vector = np.concatenate([resnet_vector, color_hist_vector]).astype("float32")

#         # Normalize like index vectors
#         faiss.normalize_L2(combined_vector.reshape(1, -1))

#         return combined_vector
#     except Exception as e:
#         print(f"❌ Error processing uploaded image: {e}")
#         return None


# @app.post("/match")
# async def match(file: UploadFile = File(...)):
#     content = await file.read()
#     vector = extract_combined_vector(content)

#     if vector is None:
#         return {"error": "Failed to process image"}

#     # Get top 10 similar matches (we'll filter duplicates/distances)
#     D, I = index.search(np.array([vector]), k=10)

#     seen_paths = set()
#     results = []

#     for idx, dist in zip(I[0], D[0]):
#         if idx == -1 or dist > 0.5:  # distance threshold (tweak as needed)
#             continue

#         match_path = paths[idx].replace("\\", "/")  # Normalize path slashes

#         if match_path in seen_paths:
#             continue  # skip duplicates

#         seen_paths.add(match_path)
#         results.append({
#             "match_path": match_path,
#             "distance": round(float(dist), 4)
#         })

#         if len(results) == 3:
#             break  # limit to top 3 unique accurate matches

#     return {"matches": results}


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=5001)

from fastapi import FastAPI, File, UploadFile
import faiss
import numpy as np
from PIL import Image
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications import ResNet50
import uvicorn
import pickle
import io
import os

app = FastAPI()

# Load FAISS index and path list
index = faiss.read_index("faiss_index/jewellery.index")
with open("faiss_index/paths.pkl", "rb") as f:
    paths = pickle.load(f)

# Load pre-trained ResNet50 model
model = ResNet50(weights="imagenet", include_top=False, pooling='avg')

# Function to extract combined feature vector (ResNet + HSV histogram)
def extract_combined_vector(file_bytes):
    try:
        img = Image.open(io.BytesIO(file_bytes)).resize((224, 224)).convert("RGB")
        
        # ResNet features
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        resnet_vector = model.predict(x)[0]  # shape: (2048,)

        # HSV histogram (32 bins per channel = 96 total)
        hsv_img = img.convert("HSV")
        hsv_np = np.array(hsv_img)
        hist = []
        for i in range(3):  # H, S, V channels
            h, _ = np.histogram(hsv_np[:, :, i], bins=32, range=(0, 256), density=True)
            hist.extend(h)
        color_hist_vector = np.array(hist, dtype='float32')  # shape: (96,)

        # Final vector (ResNet + color histogram) → shape: (2144,)
        combined_vector = np.concatenate([resnet_vector, color_hist_vector]).astype("float32")

        # Normalize for FAISS
        faiss.normalize_L2(combined_vector.reshape(1, -1))

        return combined_vector
    except Exception as e:
        print(f"❌ Error processing uploaded image: {e}")
        return None

@app.get("/")
def root():
    return {"message": "Similarity Engine is running 🚀"}

@app.post("/match")
async def match(file: UploadFile = File(...)):
    content = await file.read()
    vector = extract_combined_vector(content)

    if vector is None:
        return {"error": "Failed to process image."}

    # Check if vector shape matches FAISS index
    if vector.shape[0] != index.d:
        return {
            "error": f"Vector dimension mismatch: got {vector.shape[0]}, expected {index.d}. "
                     f"Ensure your FAISS index is built using the same feature extraction logic."
        }

    # Search top 10 similar items
    D, I = index.search(np.array([vector]), k=10)

    seen_paths = set()
    results = []

    for idx, dist in zip(I[0], D[0]):
        if idx == -1 or dist > 0.5:  # filter by distance
            continue

        match_path = paths[idx].replace("\\", "/")

        if match_path in seen_paths:
            continue  # skip duplicates

        seen_paths.add(match_path)
        results.append({
            "match_path": match_path,
            "distance": round(float(dist), 4)
        })

        if len(results) == 3:
            break  # top 3 unique matches

    return {"matches": results}

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=5001)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render sets PORT env variable automatically
    uvicorn.run(app, host="0.0.0.0", port=port)