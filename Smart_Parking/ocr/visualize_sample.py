# visualize_sample.py

from dataset import PlateDataset
from charset import INDEX_TO_CHAR
import matplotlib.pyplot as plt
import torch

# Load dataset
ds = PlateDataset('moroccan_plates/images', 'moroccan_plates/labels')

for i in range(5):
    image, label = ds[i]
    plt.imshow(image.squeeze(0), cmap='gray')
    plt.title('Label: ' + ''.join([INDEX_TO_CHAR[i] for i in label]))
    plt.axis('off')
    plt.show()

