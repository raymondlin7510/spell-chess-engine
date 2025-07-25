from flask import Flask, jsonify

#import chess (need to download this first) maybe we'll use it

app = Flask(__name__)

class SearchNode: # runs the search algorithm on a tree node
    def eval_guess(board):
        # guess the eval based on the board
        return 0
    
    #jc = [wjc, bjc]
    #instead of referring to wjc, jc[0], instead of bjc, jc[1]. jc[turn], turn is 0 for white, 1 for black
    #jc[turn] to get my own cooldown, jc[1 - turn] to get opponent's cooldown

    def __init__(self, board, jc, nj, fc, nf, turn, depth, best_eval):
        self.board = board # (2-d array)
        self.jc = jc # white/black jump cooldown
        self.nj = nj # white/black num jumps
        self.fc = fc # white/black freeze cooldown
        self.nf = nf # white/black num freezes
        self.turn = turn
        self.depth = depth
        self.normal_children = []
        self.jump_children = [] # empty if jump spell is on cooldown or no spells left
        self.freeze_children = [] # empty if freeze spell is on cooldown or no spells left
        self.evaluation = self.eval_guess(board)
        self.best_eval = best_eval

    def generate_normal_and_jump_children(self): #chess moves w/o freezes
        for:
            #woah this piece is a rook:
                #there's a black pawn two squares in from of the white rook
                #add "move rook one square forward" to normal children
                #add "capture black pawn, moving rook two squares forward" to normal children
                if can_use_jump_spell(): 
                    #add "use jump spell on pawn, moving rook three squares forward" to normal children
                    #add "use jump spell on pawn, moving rook four squares forward" to normal children
                    #etc
                else:
                    #do nothing

    def generate_children(self): #chess moves (including spells)
        self.generate_normal_and_jump_children()
        self.eval_normal()
        if self.depth >= 3:
            for every normal move:
                for every freeze square:
                    # freeze_eval_upper_bound is for sure greater than true_eval
                    # freeze_eval_upper_bound is approx true_eval + 7
                    if freeze_eval_upper_bound >= best_normal_eval + 6
                        #self.freeze_children.append(new SearchNode(board, ))
        
            
            # generate freeze children

@app.route('/get_eval_and_move', methods=['GET'])
def get_eval_and_move():
    # board 2d array, 
    # which spell is active = 0, 1, 2 (0 means no spell, 1 means jump spell, 2 means freeze), 
    # jump/freeze: center of where is the spell active, 
    # freeze spell: which squares are frozen (empty array if not active)
    # white jump cooldown
    # white number of jumps
    # white freeze cooldown
    # white number of freezes
    # black jump cooldown
    # black number of jumps
    # black freeze cooldown
    # black number of freezes
    # who's turn is it
    
    # make sure that when we do deploy the app, make sure that we update the app route to be website/get_eval_and_move
    # make sure that when we do deploy the app, make sure that we also update package.json proxy as well
    min_eval = -10000
    depth = 7
    search_root = SearchNode([wjc, bjc], [wnj, bnj], [wfc, bfc], [wnf, bnf], turn, depth, min_eval)
    return jsonify("Hello from Flask")


if __name__ == '__main__':
    app.run(debug=True)