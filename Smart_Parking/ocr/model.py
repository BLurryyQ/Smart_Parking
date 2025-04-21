import torch.nn as nn

class CRNN(nn.Module):
    def __init__(self, num_classes, img_height=48):
        super(CRNN, self).__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 64, 3, 1, 1), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, 3, 1, 1), nn.ReLU(), nn.Dropout(0.3), nn.MaxPool2d(2, 2)
        )
        cnn_output_height = img_height // 4
        lstm_input_size = 128 * cnn_output_height

        self.rnn1 = nn.LSTM(lstm_input_size, 256, bidirectional=True, batch_first=True)
        self.rnn2 = nn.LSTM(512, 256, bidirectional=True, batch_first=True)

        self.fc = nn.Linear(512, num_classes + 1)
        nn.init.constant_(self.fc.bias, -2.0)
    def forward(self, x):
        x = self.cnn(x)
        b, c, h, w = x.size()
        x = x.permute(0, 3, 1, 2)   # [B, W, C, H]
        x = x.contiguous().view(b, w, c * h)

        x, _ = self.rnn1(x)
        x, _ = self.rnn2(x)

        x = self.fc(x)
        return x