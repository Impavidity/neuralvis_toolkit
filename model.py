import torch
import torch.nn as nn
from torch.autograd import Variable
import torch.nn.functional as F

class Encoder(nn.Module):
    def __init__(self, config):
        super(Encoder, self).__init__()
        self.config = config
        self.lstm = nn.LSTM(input_size=config.lstm_input,
                           hidden_size=config.lstm_hidden,
                           num_layers=config.lstm_layer,
                           dropout=config.lstm_dropout,
                           bidirectional=config.lstm_bi,
                           batch_first=True)

    def forward(self, x):
        # x = (sequence length, batch_size, dimension of embedding)
        batch_size = x.size()[1]
        # h0 / c0 = (layer*direction, batch_size, hidden_dim)
        h0 = Variable(torch.zeros(self.config.lstm_layer * (2 if self.config.lstm_bi else 1), batch_size,
                                  self.config.lstm_hidden))
        c0 = Variable(torch.zeros(self.config.lstm_layer * (2 if self.config.lstm_bi else 1), batch_size,
                                  self.config.lstm_hidden))
        # output = (sentence length, batch_size, hidden_size * num_direction)
        # ht = (layer*direction, batch, hidden_dim)
        # ct = (layer*direction, batch, hidden_dim)
        outputs, (ht, ct) = self.lstm(x, (h0, c0))
        return ht[-2:].transpose(0, 1).contiguous().view(batch_size, -1)

class sentiment(nn.Module):
    def __init__(self, config):
        super(sentiment, self).__init__()
        self.config = config
        self.embed = nn.Embedding(config.word_num, config.word_dim)
        self.encoder = Encoder(config)
        self.dropout = nn.Dropout(p=config.dropout)
        self.relu = nn.ReLU()
        self.out = nn.Sequential(
            nn.Linear(config.lstm_hidden * (2 if self.config.lstm_bi else 1), config.linear_hidden),
            nn.BatchNorm1d(config.linear_hidden),
            self.relu,
            self.dropout,
            nn.Linear(config.linear_hidden, config.target_class)
        )

    def forward(self, x):
        # x = (sentence length, batch_size)
        x = self.embed(x)
        # x = (sentence_length, batch_size, dimension)
        x_encoded = self.encoder.forward(x)
        # x_encoded = (batch size, layer*direction)
        output = self.out(x_encoded)
        scores= F.log_softmax(output)
        return scores


