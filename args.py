import argparse

def get_args():
    parser = argparse.ArgumentParser(description="attentive cnn")
    parser.add_argument('--no_cuda', action='store_false', dest='cuda')
    parser.add_argument('--gpu', type=int, default=0)
    parser.add_argument('--seed', type=int, default=2324)
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--resume_snapshot', type=str, default=None)
    parser.add_argument('--lr', type=float, default=1.0)
    parser.add_argument('--weight_decay', type=float, default=0)
    parser.add_argument('--data', type=str, default='SST1')
    parser.add_argument('--word_dim', type=int, default=300)
    parser.add_argument('--dropout', type=float, default=0.5)
    parser.add_argument('--lstm_input', type=int, default=300)
    parser.add_argument('--lstm_bi', action='store_true')
    parser.add_argument('--lstm_hidden', type=int, default=500)
    parser.add_argument('--linear_hidden', type=int, default=300)




