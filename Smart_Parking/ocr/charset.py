# charset.py
arabic_chars = list("أبجدهوزحطيكلمنسعفصقرشتثخذضظغ")
digits = list("0123456789")
CHARSET = digits + arabic_chars
CHAR_TO_INDEX = {char: idx for idx, char in enumerate(CHARSET)}
INDEX_TO_CHAR = {idx: char for char, idx in CHAR_TO_INDEX.items()}
