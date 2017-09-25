import torch
import torch.nn as nn
import time
import os
import numpy as np
import random
from args import get_args

from torchtext import data
from model import sentiment
from dataset import SST1


args = get_args()
torch.manual_seed(args.seed)
np.random.seed(args.seed)
random.seed(args.seed)
if not args.cuda:
    args.gpu = -1
if torch.cuda.is_available() and args.cuda:
    print("Note: You are using GPU for training")
    torch.cuda.set_device(args.gpu)
    torch.cuda.manual_seed(args.seed)
if torch.cuda.is_available() and not args.cuda:
    print("Warning : You have Cuda but not use it, you are using CPU for training")


if args.data == 'SST1':
    SENTENCE = data.Field()
    LABEL = data.Field(sequential=False)
    train, dev, test = SST1.split(SENTENCE, LABEL)
    SENTENCE.build_vocab(train, dev, test)
    LABEL.build_vocab(train, dev, test)

# No pretrained embedding is needed here. The paper uses randomly initialized word embedding
# One improvement add another channel to do the multichannle model
# Even use the syntactic information use improve this
# Can we use other way to represent the sentence embedding?
# Like shift-reduce mechanism to construct a tree-LSTM

train_iter = data.Iterator(train, batch_size=args.batch_size, device=args.gpu, train=True, repeat=False,
                           sort=False, shuffle=True)
dev_iter = data.Iterator(dev, batch_size=args.batch_size, device=args.gpu, train=False, repeat=False,
                         sort=False, shuffle=False)
test_iter = data.Iterator(test, batch_size=args.batch_size, device=args.gpu, train=False, repeat=False,
                          sort=False, shuffle=False)

config = args
config.target_class = len(LABEL.vocab)
config.word_num = len(SENTENCE.vocab)

print("Labels:", LABEL.vocab.itos)
print("Vocabulary Size: {}".format(config.words_num))



if args.resume_snapshot:
    if args.cuda:
        model = torch.load(args.resume_snapshot, map_location=lambda storage, location: storage.cuda(args.gpu))
    else:
        model = torch.load(args.resume_snapshot, map_location=lambda storage, location: storage)
else:
    if args.data == 'SST1':
        model = sentiment(config)
    if args.cuda:
        model.cuda()
        print("Shift model to GPU")

parameter = filter(lambda p: p.requires_grad, model.parameters())

optimizer = torch.optim.Adadelta(parameter, lr=args.lr, weight_decay=args.weight_decay)
criterion = nn.MarginRankingLoss()

early_stop = False
best_dev_acc = 0
iteration = 0
iters_not_improved = 0
epoch = 0


