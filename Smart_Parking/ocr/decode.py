# decode.py
from .charset import CHARSET, INDEX_TO_CHAR

def ctc_decode(logits, blank=len(INDEX_TO_CHAR)):
    pred = logits.argmax(dim=2)  # [B, W, C] → [B, W]
    pred = pred.detach().cpu().numpy()

    results = []
    for seq in pred:
        text = ""
        last = -1
        for char in seq:
            if char != last and char != blank:
                text += INDEX_TO_CHAR.get(char, '')
            last = char
        results.append(text)
    return results
