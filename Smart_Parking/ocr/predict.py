# predict.py
import os
import torch
from .model import CRNN
from .decode import ctc_decode
from .charset import INDEX_TO_CHAR, CHARSET
from PIL import Image
import torchvision.transforms as transforms

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
transform = transforms.Compose([
    transforms.Resize((48, 160)),
    transforms.ToTensor()
])

_model = None  # cache once loaded

def get_model():
    global _model
    if _model is None:
        model = CRNN(num_classes=len(CHARSET)).to(device)
        model_path = os.path.join(os.path.dirname(__file__), "crnn_plate_model.pth")
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()
        _model = model
    return _model

def predict_plate(image_path):
    model = get_model()
    image = Image.open(image_path).convert('L')
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(image).log_softmax(2)
        print("Raw logits shape:", logits.shape)
        raw = logits.argmax(dim=2)[0].cpu().numpy()
        print("🧪 Raw indices:", raw)
        text = ctc_decode(logits)[0]
        print("Predicted Plate:", text)
        return text
