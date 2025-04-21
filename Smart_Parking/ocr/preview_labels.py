# preview_labels.py
from dataset import PlateDataset
from .charset import INDEX_TO_CHAR
import matplotlib.pyplot as plt

ds = PlateDataset('moroccan_plates/images', 'moroccan_plates/labels')

for i in range(5):
    image, label = ds[i]
    text = ''.join([INDEX_TO_CHAR[i] for i in label])
    plt.imshow(image.squeeze(0), cmap='gray')
    plt.title(f"Sample {i} → {text}")
    plt.axis('off')
    plt.show()
