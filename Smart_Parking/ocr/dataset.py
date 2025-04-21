# dataset.py
import os
from PIL import Image
from torch.utils.data import Dataset
from .charset import CHAR_TO_INDEX
import torchvision.transforms as transforms

class PlateDataset(Dataset):
    def __init__(self, images_dir, labels_dir, img_width=160, img_height=48):
        self.images = []
        self.labels = []
        self.img_width = img_width
        self.img_height = img_height

        for img_name in os.listdir(images_dir):
            img_path = os.path.join(images_dir, img_name)
            label_path = os.path.join(labels_dir, os.path.splitext(img_name)[0] + ".txt")

            if os.path.exists(label_path):
                self.images.append(img_path)
                with open(label_path, 'r', encoding='utf-8') as f:
                    label = f.read().strip().replace(' ', '')  # remove spaces
                    self.labels.append([CHAR_TO_INDEX[c] for c in label if c in CHAR_TO_INDEX])

        self.transform = transforms.Compose([
            transforms.Resize((self.img_height, self.img_width)),
            transforms.ToTensor()
        ])

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img = Image.open(self.images[idx]).convert('L')
        img = self.transform(img)
        label = self.labels[idx]
        return img, label
