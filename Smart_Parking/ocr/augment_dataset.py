import os
import cv2
import albumentations as A
import shutil

# Paths
IMAGE_DIR = "moroccan_plates/images"
LABEL_DIR = "moroccan_plates/labels"

# Augmentation pipeline
transform = A.Compose([
    A.RandomBrightnessContrast(p=0.5),
    A.Rotate(limit=10, p=0.5),
    A.MotionBlur(p=0.2),
    A.OpticalDistortion(p=0.2),
    A.RandomShadow(p=0.2),
    A.RandomRain(p=0.2),
])

# Create backups (optional)
os.makedirs("moroccan_plates/images_original", exist_ok=True)
os.makedirs("moroccan_plates/labels_original", exist_ok=True)

# Loop over all images
for img_file in os.listdir(IMAGE_DIR):
    if not img_file.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    image_path = os.path.join(IMAGE_DIR, img_file)
    label_path = os.path.join(LABEL_DIR, img_file.replace(".jpg", ".txt"))

    # Read image and label
    image = cv2.imread(image_path)
    if image is None:
        print(f"Could not read {img_file}")
        continue

    # Backup originals
    shutil.copy(image_path, "moroccan_plates/images_original")
    shutil.copy(label_path, "moroccan_plates/labels_original")

    # Create 5 augmentations
    for i in range(1, 6):
        augmented = transform(image=image)["image"]
        new_img_name = img_file.replace(".jpg", f"_aug{i}.jpg")
        new_lbl_name = img_file.replace(".jpg", f"_aug{i}.txt")

        # Save augmented image and duplicate original label
        cv2.imwrite(os.path.join(IMAGE_DIR, new_img_name), augmented)
        shutil.copy(label_path, os.path.join(LABEL_DIR, new_lbl_name))

print("✅ Dataset augmentation complete.")
