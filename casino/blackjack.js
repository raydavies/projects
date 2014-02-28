<!--
$(document).ready(function() {
	$('input#playbutton').click(function(event) {
		initializeGame();
	});
	$('input#betbutton').click(function(event) {
		if (checkBet()) {
			playHand();
		}
	});
	$('input#continue').click(function(event) {
		clearTable();
	});
	$('input#insurebutton, input#evenbutton').click(function(event) {
		insureBet();
	});
	$('input#nobutton').click(function(event) {
		checkBlackjack();
	});
	$('input#hitbutton').click(function(event) {
		hitMe();
	});
	$('input#staybutton').click(function(event) {
		standMe();
	});
	$('input#ddbutton').click(function(event) {
		if ((player.split !== true && player.chips < bet) || (player.split === true && player.chips < Math.min(bet, splitbet))) {
			$text.html("Not enough cash!").show().fadeOut(2000);
		} else {
			doubleDown();
		}
	});
	$('input#splitbutton').click(function(event) {
		if (player.chips < bet) {
			$text.html("Not enough cash!").show().fadeOut(2000);
		} else if (player.split === true) {
			$text.html("Can't re-split!").show().fadeOut(2000);
		} else if (playerHand.getHand().length === 2 && playerHand.getHand()[0].getValue() !== playerHand.getHand()[1].getValue()) {
			$text.html("Can't split this hand!").show().fadeOut(2000);
		} else {
			splitHand();
		}
	});
	$('input#surrenderbutton').click(function(event) {
		surrenderHand();
	});
});

var gameOver = function() {
    //triggered when chips = 0	
    $('#betbox').addClass('hidden');
    $play.removeClass('hidden');
    $('#intro p').css("visibility","visible");
    $current.empty();
    $end.append($('<span></span>').html("Out of cash.<br>Game Over!"));
    $end.fadeIn(2000);
    //$dealerResult.slideUp(3000);
    //$playerResult.slideUp(3000);
};    

var initializeGame = function() {
    //set globals and prep game areas
    $play = $('#playbutton');
    $playerResult = $('div#player');
    $dealerResult = $('div#dealer');
    $text = $('div#result span');
    $pointer = $('img#pointer');
    $end = $('div#gameover');
    $end.fadeOut(10);
    $end.empty();
    $dealerBox = $("<div id='dealerbox'></div>");
    $current = $('<span id="currentbet"></span>');
    $play.addClass('hidden');
    $('#intro p').css("visibility","hidden");    
    
    //initialize classes and display pocket
    deck = new Deck();
    deck.shuffleDeck();
    dealer = new Dealer();
    player = new Player();
    $('div#pocket').html("$" + player.chips + " left in pocket");
    $('div#pocket').removeClass('hidden');

    clearTable();
};

var clearTable = function() {
    //clear previous game & text
    player.winnings = 0;
    $playerResult.html('').show();
    $dealerResult.html('').show();
    $text.html('').hide();
    $current.empty();
    $('div#intro').siblings('#dealerbox').html('');
    $('div#continuebox').addClass('hidden');
    $('input#ddbutton').attr("disabled", false);
    $('input#splitbutton').attr("disabled", false);
    $('input#surrenderbutton').attr("disabled", false);
    $('input#evenbutton').addClass('hidden');
    $('input#insurebutton').addClass('hidden');
    $('#betbox').removeClass('hidden');
    $end.hide(10);
    $pointer.css("top",470);
    splitbet = 0;
    bet = 0;
};


var checkBet = function() {
    //make sure there are enough chips to cover bet
    bet = parseInt($('input.bet:checked').attr('value'));
    if (player.chips < 1) {
	    gameOver();
	    return false;
    } else if (bet > player.chips) {
	    $text.html("Choose a smaller bet!").show().fadeOut(2000);
	    return false;
    } else {
	    return true;
    }
};
    	
var playHand = function() {
    //bet is placed
    $('#betbox').addClass('hidden');
    player.chips -= bet;
    player.insured = false;
    $current.html("Current bet: $" + bet);
    $('#pocket').before($current);
    $('div#pocket').html("$" + player.chips + " left in pocket");
    
    playerHand = new Hand();
    dealerHand = new Hand();
    player.currentHand = playerHand;
    handCount = 1;

    //initial hand shows dealer card, then checks for blackjack
    dealerHand.printCards($dealerResult, true);
    $dealerResult.prepend("Dealer Hand:<br>");
    dealer.showCard();
    $dealerResult.append($dealerBox);
    player.showHand();
    
    if (dealer.getRank() === 1 && playerHand.score() === 21) {
	    $('input#evenbutton').removeClass('hidden');
	    $('#insurancebox').removeClass('hidden');
    } else if (dealer.getRank() === 1) {
	    $('input#insurebutton').removeClass('hidden');
	    $('#insurancebox').removeClass('hidden');
    } else {
	    checkBlackjack();
    }
};

var checkBlackjack = function() {
    var blackjack = hasBlackjack(playerHand,dealerHand);

    //if blackjack, round ends otherwise player's turn to hit/stand
    if (!blackjack) {
    	$('#insurancebox').addClass('hidden');    
	    $('#hitarea').removeClass('hidden');
    } else {
    	$('#insurancebox').addClass('hidden');
	    player.showHand();
    	printResult(blackjack);
    }
};

var insureBet = function() {
	player.chips -= (bet / 2.0);
	bet *= 1.5;
	$('div#pocket').html("$" + player.chips + " left in pocket");
    $current.html("Current bet: $" + bet);
	player.insured = true;
	checkBlackjack();
};

var hitMe = function() {
    checkHand();
    $('input#ddbutton').attr("disabled",true);
    $('input#surrenderbutton').attr("disabled",true);
    $('input#splitbutton').attr("disabled", true);    
    player.currentHand.hitMe();
    $playerResult.html('');
    player.showHand();
    if (player.split === true) {
	    playerSplit.printSplit($playerResult);
    }
    if (player.currentHand.score() > 21) {
    	if (player.split !== true) {
    		var result = declareWinner(playerHand,dealerHand);
	    	printResult(result[0]);
    	} else {
	    	standMe();
    	}
    }
};

var standMe = function() {
    checkHand();
    if (player.split !== true) {
    	dealerHand = dealer.play();
    	dealerHand.printCards($dealerResult);
    	var result = declareWinner(playerHand,dealerHand);
    	printResult(result[0]);
    } else if (player.currentHand === playerHand) {
	    switchHands();
    } else {
	    endSplit();
    }
};

var doubleDown = function() {
    checkHand();
    if (player.currentHand !== playerHand) {
    	player.chips -= splitbet;
    	splitbet *= 2;
	    $current.html("Current bet: $" + bet + "/$" + splitbet);
    } else {    
    	player.chips -= bet;
    	bet *= 2;

    	if (player.split === true) {
            $current.html("Current bet: $" + bet + "/$" + splitbet);
        } else {
    		$current.html("Current bet: $" + bet);
	    }
    }
    $('div#pocket').html("$" + player.chips + " left in pocket");   
    hitMe();
    if (player.currentHand.score() < 21) {
        standMe();
    }
};

var splitHand = function() {
    player.split = true;
    $('input#surrenderbutton').attr("disabled",true);
    $('input#splitbutton').attr("disabled", true); 
    player.chips -= bet;
    splitbet = bet;
    $('div#pocket').html("$" + player.chips + " left in pocket");
    $current.html("Current bet: $" + bet + "/$" + splitbet);
    playerSplit = new Hand();
    var splitCard = playerHand.getHand().pop();
    playerSplit.getHand().unshift(splitCard);
    playerHand.hitMe();
    $playerResult.empty();
    player.showHand();
    playerSplit.printSplit($playerResult);
    $('html, body').animate({scrollTop:"670px"}, 2000);
    $pointer.fadeIn(1000);
};

var checkHand = function() {
    if (handCount === 2) {
    	player.currentHand = playerSplit;
    } else {
    	player.currentHand = playerHand;
    }
};

var switchHands = function() {
    $pointer.animate({top:"670px"}, 1000);    
    $('input#ddbutton').attr("disabled",false);
    playerSplit.hitMe();
    $playerResult.empty();
    player.showHand();
    playerSplit.printSplit($playerResult);
    handCount = 2;
};

var endSplit = function() {
    player.split = false;
    $('html, body').animate({scrollTop:0},1000);
    $pointer.fadeOut(100);
    dealerHand = dealer.play();
    dealerHand.printCards($dealerResult);
    var result1 = declareWinner(playerHand,dealerHand);
    var result2 = declareWinner(playerSplit,dealerHand);
    if (result1[1] > result2[1]) {
	    printResult(result1[0]);
    } else {
	    printResult(result2[0]);
    }
};


var surrenderHand = function() {
    player.chips += (bet / 2.0);
    $('div#pocket').html("$" + player.chips + " left in pocket");
    $current.html("Winnings: $" + player.winnings);
    $text.html("Hand surrendered").fadeIn(1000);
    $('#hitarea').addClass('hidden');
    $dealerBox.empty();
    $('div#continuebox').removeClass('hidden');
};

var printResult = function(result) {
    //reveals dealer card, prints score, result and prompt to continue game
    $('#hitarea').addClass('hidden');
    $dealerBox.empty();
    dealerHand.printCards($dealerResult);
    $dealerResult.prepend("Dealer Hand:<br>");
    $dealerResult.append("<br>Dealer Score: " + dealerHand.dealerScore() + "<br><br>");
    $text.html(result).fadeIn(1000);
    $('div#pocket').html("$" + player.chips + " left in pocket");
    $current.html("Winnings: $" + player.winnings);
    if (player.chips < 1) {
    	gameOver();
    } else {
        $('div#continuebox').removeClass('hidden');
    }
};


var hasBlackjack = function(playerHand,dealerHand) {
    var playerbj = playerHand.blackJack();
    var dealerbj = dealerHand.blackJack();

    if (player.insured === false) {
	    if (playerbj === true && dealerbj === true) {
	    	player.chips += bet;
	    	return "Push!";
    	} else if (playerbj === true) {
	    	player.winnings = ((bet * 3)/2.0);
    		player.chips += (bet + player.winnings);
	    	return "BLACKJACK!<br>You win!";
	    } else if (dealerbj === true) {
    		return "Dealer has blackjack.<br>You lose!";
	    } else {
    		return false;
	    }
    } else if (player.insured === true) {
        if (playerbj === true && dealerbj === true) {
	    	player.winnings = ((bet * 2) / 3.0);
    		player.chips += (bet + player.winnings);
	    	return "Push!<br>Even money!";
        } else if (playerbj === true) {
    		player.winnings = ((bet * 2) / 3.0);
	    	player.chips += (bet + player.winnings);
	        return "Blackjack!<br>Even money!";	
	    } else if (dealerbj === true) {
    		player.chips += bet + (bet * 2);
	    	return "Dealer has blackjack.<br>Bet insured!";
	    } else {
    		bet -= (bet / 3.0);
	    	$current.html("Current bet: $" + bet);
	        $text.html("No blackjack.<br>Bet taken!").show().fadeOut(5000);	
		    return false;
	    }
    }
};	


var declareWinner = function(pHand,dHand) {
    var playerScore = pHand.score();
    var dealerScore = dHand.dealerScore();
    var endbet;
    var result;
    var splitrank;

    if (pHand === playerHand) {
	    endbet = bet;
    } else {
	    endbet = splitbet;
    }

    if (playerScore > 21) {
	    splitrank = 0;
	    if (dealerScore > 21) {
		    result = "You both busted!";
	    } else {
		    result = "You busted!";
	    }
    } else if (dealerScore > 21) {
	    splitrank = 3;
	    player.winnings += endbet;
	    player.chips += (endbet * 2);
	    result = "Dealer busts.<br>You win!";
    } else {
	    if (playerScore > dealerScore) {
		    splitrank = 4;
		    player.winnings += endbet;
		    player.chips += (endbet * 2);
		    result = "You win!";
	    } else if (playerScore === dealerScore) {
            splitrank = 2;
		    player.chips += endbet;
		    result = "Push!";
	    } else {
		    splitrank = 1;
		    result = "You lose!";
	    }
    }
    return [result, splitrank];
};

var getName = function(rank,suit) {
	switch (rank) {
        case 11:
            rank = "Jack";
            break;
        case 12:
            rank = "Queen";
            break;
        case 13:
            rank = "King";
            break;
        case 1:
            rank = "Ace";
            break;
    }
	switch (suit) {
        case 1:
            suit = "Clubs";
            break;
        case 2:
            suit = "Diamonds";
            break;
        case 3:
            suit = "Hearts";
            break;
        case 4:
            suit = "Spades";
            break;
    }
	return [rank,suit];
};

function Player() {
    this.chips = 100;
    this.winnings = 0;
    this.insured = false;
    this.split = false;
    this.currentHand;

    this.showHand = function() {
    	playerHand.printCards($playerResult);
	    $playerResult.prepend("Your Hand:<br>");
        $playerResult.append("<br>Your score: " + playerHand.score());
    };
}

function Dealer() {
    this.getRank = function() {
    	var holeCard = dealerHand.getHand()[1];
        var rank = holeCard.getNumber();
	    return rank;
    };
    
    this.showCard = function() {
    	var holeCard = dealerHand.getHand()[1];
        var rank = holeCard.getNumber();
        var suit = holeCard.getSuit();
	    var namedCard = getName(rank,suit);
    	var newrank = namedCard[0];
	    var newsuit = namedCard[1];	

    	$dealerBox.html("Dealer is showing: " + newrank + " of " + newsuit + "<br><br>");
	    $dealerBox.insertAfter('div#intro');
    };
    
    this.play = function() {
        while (dealerHand.dealerScore() < 17) {
            dealerHand.hitMe();
        }
        return dealerHand;
    };
}

function Hand() {
    var hand = [];

    if (deck.getLength() < 6) {
	    deck.shuffleDeck();
    }

    if (player.split !== true) {
    	hand.push(deck.deal());
    	hand.push(deck.deal());
    }

    this.getHand = function() {
        return hand;
    };
    
    this.hitMe = function () {
    	if (deck.getLength() < 6) {
	        deck.shuffleDeck();
        }
        hand.push(deck.deal());
    };

    this.blackJack = function() {
	    if (this.score() === 21 && this.getHand().length === 2) {
		    return true;
    	}
	    return false;
    };

    this.score = function() {
        var sum = 0;
        var aces = 0;
        for (var i=0;i<hand.length;i++) {
            var value = hand[i].getValue();
            if (value === 11) {
                aces++;
            }
            sum += value;
        }
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    };
    
    this.dealerScore = function() {
        var sum = 0;
        var aces = 0;
        for (var i=0;i<hand.length;i++) {
            var value = hand[i].getValue();
            if (value === 11) {
                aces++;
            }
            sum += value;
        }
        while ((sum === 17 || sum > 21) && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    };

    this.printSplit = function(div) {
	    div.append("<br>");
	    this.printCards(div);
	    div.append("<br>Your score: " + playerSplit.score());
    };
    
    this.printCards = function(div, first) {
    	//uses card info to assign img
	    if (player.split !== true){
		    div.html('');
    	}	
    
        for (var i=0;i<hand.length;i++) {
            var rank = hand[i].getNumber();
            var suit = hand[i].getSuit();
            var newCard = getName(rank,suit);
	        var newrank = newCard[0];
    	    var newsuit = newCard[1].toLowerCase();
	    
            if (typeof newrank === "string") {
                newrank = newrank.toLowerCase();
    	    }
	        //dealer's hole card is hidden
	        if (i===0 && div===$dealerResult && first===true) {
    		    div.append("<img class='cardpics' src='images/cards/hidden.png'>");
    	    } else {
                div.append("<img class='cardpics' src='images/cards/" + newrank + newsuit + ".png'>");
	        }
        }
    };	 
}

//-->
