# # similarity-engine/build_index.py

# import os
# import numpy as np
# import faiss
# import pickle
# from PIL import Image
# from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
# from tensorflow.keras.preprocessing import image

# # Load pre-trained ResNet50 model
# model = ResNet50(weights="imagenet", include_top=False, pooling='avg')

# # Base directory for user design images
# base_dir = "../backend/uploads/user/design/"

# # Supported image extensions
# supported_extensions = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff")

# # Arrays to hold paths and vectors
# image_paths = []
# vectors = []

# # Function to extract feature vector from an image
# def get_image_vector(img_path):
#     try:
#         img = Image.open(img_path).resize((224, 224)).convert("RGB")
#         x = image.img_to_array(img)
#         x = np.expand_dims(x, axis=0)
#         x = preprocess_input(x)
#         return model.predict(x)[0]
#     except Exception as e:
#         print(f"❌ Error processing image {img_path}: {e}")
#         return None

# # Walk through all directories and files under base_dir
# for root, dirs, files in os.walk(base_dir):
#     for file in files:
#         if file.lower().endswith(supported_extensions):
#             full_path = os.path.join(root, file)
#             vector = get_image_vector(full_path)
#             if vector is not None:
#                 image_paths.append(full_path)
#                 vectors.append(vector)

# # Convert vectors to numpy array and build FAISS index
# if vectors:
#     vectors_np = np.array(vectors).astype('float32')
#     index = faiss.IndexFlatL2(vectors_np.shape[1])
#     index.add(vectors_np)

#     # Save index and image paths
#     os.makedirs("faiss_index", exist_ok=True)
#     faiss.write_index(index, "faiss_index/jewellery.index")
#     with open("faiss_index/paths.pkl", "wb") as f:
#         pickle.dump(image_paths, f)

#     print(f"✅ Indexed {len(image_paths)} images.")
# else:
#     print("⚠️ No valid images found to index.")


# similarity-engine/build_index.py

import os
import io
import numpy as np
import faiss
import pickle
from PIL import Image
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image

# Load pre-trained ResNet50 model
model = ResNet50(weights="imagenet", include_top=False, pooling='avg')

# Base directory for user design images
base_dir = "../backend/uploads/user/design/"

# Supported image extensions
supported_extensions = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff")

# Arrays to hold paths and vectors
image_paths = []
vectors = []

# Function to extract combined vector (ResNet + color histogram)
def get_image_vector(img_path):
    try:
        img = Image.open(img_path).resize((224, 224)).convert("RGB")
        
        # ResNet feature extraction
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        resnet_vector = model.predict(x)[0]

        # HSV color histogram
        hsv_img = img.convert("HSV")
        hsv_np = np.array(hsv_img)
        hist = []
        for i in range(3):  # H, S, V
            h, _ = np.histogram(hsv_np[:, :, i], bins=32, range=(0, 256), density=True)
            hist.extend(h)

        color_hist_vector = np.array(hist, dtype='float32')

        # Combine both vectors
        combined_vector = np.concatenate([resnet_vector, color_hist_vector]).astype("float32")

        return combined_vector

    except Exception as e:
        print(f"❌ Error processing image {img_path}: {e}")
        return None

# Walk through all directories and files under base_dir
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.lower().endswith(supported_extensions):
            full_path = os.path.join(root, file)
            vector = get_image_vector(full_path)
            if vector is not None:
                image_paths.append(full_path)
                vectors.append(vector)

# Convert vectors to numpy array and build FAISS index
if vectors:
    vectors_np = np.array(vectors).astype('float32')

    # Optionally normalize vectors (improves accuracy in L2 space)
    faiss.normalize_L2(vectors_np)

    index = faiss.IndexFlatL2(vectors_np.shape[1])
    index.add(vectors_np)

    # Save index and image paths
    os.makedirs("faiss_index", exist_ok=True)
    faiss.write_index(index, "faiss_index/jewellery.index")
    with open("faiss_index/paths.pkl", "wb") as f:
        pickle.dump(image_paths, f)

    print(f"✅ Indexed {len(image_paths)} images with enhanced features.")
else:
    print("⚠️ No valid images found to index.")
