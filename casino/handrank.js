<!--
var hand_rank = function(hand) {
    //Return a value indicating the ranking of a hand.
    var ranks = card_ranks(hand); 
    if (straight(ranks) && flush(hand)) {
        return 8;
    } else if (kind(4, ranks)) {
        return 7;
    } else if (kind(3, ranks) && kind(2, ranks)) {
        return 6;
    } else if (flush(hand)) {
        return 5;
    } else if (straight(ranks)) {
        return 4;
    } else if (kind(3, ranks)) {
        return 3;
    } else if (two_pair(ranks)) {
        return 2;
    } else if (kind(2, ranks) && kind(2,ranks) >= 11) {
        return 1;
    } else {
        return 0;
    }
};

var card_ranks = function(hand) {
    //Return a list of the ranks, sorted with higher first.
    var ranks = [];	    
    for (var i = 0; i < hand.getHand().length; i++) {
	    ranks.push(hand.getHand()[i].pokerValue());
    }	    
    ranks.sort(integerSort)
    if (ranks[0]===2 && ranks[1]===3 && ranks[2]===4 && ranks[3]===5 && ranks[4]===14) {
	    return [1,2,3,4,5];
    } else {
	    return ranks;
    }
};

var integerSort = function(a,b) {
	return a - b;
}

var flush = function(hand) {
    //Return True if all the cards have the same suit.
    var suits = [];	    
    for (var i = 0; i < hand.getHand().length; i++) {
	    suits.push(hand.getHand()[i].getSuit());
    }
    var result = count_cards(suits);
    var count = 0;
    for (var e in result) {
	    count += 1;
    }
    if (count === 1) {
	    return true;
    }
    return false;
};

var straight = function(ranks) {
    //Return True if the ordered ranks form a 5-card straight.
    var result = count_cards(ranks);
    var count = 0;
    for (var e in result) {
	    count += 1;
    }
    if (count === 5 && (Math.max.apply(Math,ranks) - Math.min.apply(Math,ranks)) === 4) {
	    return true;
    }
    return false;
};

var kind = function(n, ranks) {
    //Return the first rank that this hand has exactly n-of-a-kind of or none.
	var result = count_cards(ranks);
	for (var r in result) {
        if (result[r] === n) {
    		return r;
		}
	}
    return null;
};

var two_pair = function(ranks) {
    //If there are two pair here, return the two ranks of the two pairs, else None.
    var pair = kind(2, ranks);
    var lowpair = kind(2, ranks.reverse());
    if (pair && lowpair != pair) {
        return true;
    } else {
        return false;
    }
};

var count_cards = function(ranks) {
	//create hashtable to count # of each suit or rank
	var result = {};
	for(var i = 0; i < ranks.length; ++i) {
        if(!result[ranks[i]]) {
            result[ranks[i]] = 0;
		}
    	++result[ranks[i]];
	}
	return result;
};
//-->
