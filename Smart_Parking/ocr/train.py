# train.py
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from dataset import PlateDataset
from .model import CRNN
from .charset import CHARSET, INDEX_TO_CHAR
from .decode import ctc_decode
import matplotlib.pyplot as plt

def collate_fn(batch):
    images, labels = zip(*batch)
    images = torch.stack(images)
    label_lengths = torch.tensor([len(l) for l in labels])
    labels_concat = torch.cat([torch.tensor(l) for l in labels])
    return images, labels_concat, label_lengths

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Dataset
dataset = PlateDataset('moroccan_plates/images', 'moroccan_plates/labels')

# 🔍 Preview a sample (index 0) before training
image, label = dataset[0]
plt.imshow(image.squeeze(0), cmap='gray')
plt.title('Label: ' + ''.join([INDEX_TO_CHAR[i] for i in label]))
plt.axis('off')
plt.show()

# Dataloader
dataloader = DataLoader(dataset, batch_size=8, shuffle=True, collate_fn=collate_fn)

# Model
model = CRNN(num_classes=len(CHARSET)).to(device)

# CTC Loss
criterion = nn.CTCLoss(blank=len(CHARSET), zero_infinity=True)

# Optimizer
optimizer = torch.optim.Adam(model.parameters(), lr=5e-4)

print(f"🔠 CHARSET size: {len(CHARSET)}")

# Training
for epoch in range(1, 101):  # 100 epochs
    model.train()
    total_loss = 0

    for batch_idx, (images, targets, target_lengths) in enumerate(dataloader):
        images = images.to(device)
        targets = targets.to(device)

        logits = model(images)  # [B, W, C]
        logits = logits.log_softmax(2)

        input_lengths = torch.full(size=(logits.size(0),), fill_value=logits.size(1), dtype=torch.long)

        loss = criterion(logits.permute(1, 0, 2), targets, input_lengths, target_lengths)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"📦 Epoch {epoch}: Loss = {total_loss:.4f}")

    # 🧪 Check model output every 5 epochs
    if epoch % 5 == 0:
        model.eval()
        with torch.no_grad():
            sample_logits = model(images[:1]).log_softmax(2).cpu()
            raw_preds = sample_logits.argmax(2).squeeze(0).numpy()
            print("🔢 Raw indices:", raw_preds)
            decoded = ctc_decode(sample_logits, INDEX_TO_CHAR)
            print("🔍 Predicted sample:", decoded)
        model.train()

# Save model
torch.save(model.state_dict(), "crnn_plate_model.pth")
print("✅ Model saved to crnn_plate_model.pth")
