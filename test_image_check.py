import cv2

img = cv2.imread("D:/ai-decor/input.jpg")
if img is None:
    print("❌ Image is broken or path is wrong")
else:
    print("✅ Image loaded successfully:", img.shape)
