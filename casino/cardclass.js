<!--
function Deck() {
    var deck = [];
    
    //Fills show with specified # of decks, then shuffles
    this.shuffleDeck = function() {
    	for (var i=1; i<5; i++) {
    	    for (var j=1; j<14;j++) {
    	        deck.push(new Card(i,j));
            }
	    }
    	//Knuth's Algorithm P
	    for (var i=0;i<deck.length-1;i++) {
    		rand = Math.floor(Math.random()*(deck.length-i)+i);
	    	temp = deck[i];
		    deck[i] = deck[rand];
    		deck[rand] = temp;
	    }
    };

    this.deal = function() {
    	var dealt = deck.shift();
        return dealt;
    };

    this.getDeck = function() {
	    return deck;
    };

    this.getLength = function() {
        return deck.length;
    };
}

function Card (s, n) {
    var suit = s;
    var number = n;

    this.getSuit = function() {
        return suit;
    };

    this.getNumber = function() {
        return number;
    };

    this.getValue = function() {
        if (number > 10) {
            return 10;
        } else if (number === 1) {
            return 11;
        } else {
            return number;
        }
    };

    this.pokerValue = function() {
    	if (number === 1) {
	        return 14;
    	} else {
    	    return number;
	    }
    };   
}

//-->
