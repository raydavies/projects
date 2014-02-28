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
	$('.hold').click(function(event) {
		$num = $(this).attr('id')[6];
		toggleCard($num);
	});
	$('#drawbutton').click(function(event) {
		tradeCards();
	});
	$('#continue').click(function(event) {
		deck.shuffleDeck();
		clearTable();
	});
});

var toggleCard = function(n) {
	$card = $('#card' + n);
	if ($card.css('opacity') == 0.3) {
		$card.css('opacity',1.0);
		$card.css('box-shadow', 'none');
	} else {
		$card.css('opacity',0.3);
		$card.css('box-shadow', '0px 0px 5px 5px red');
	}
};

var gameOver = function() {
    //triggered when chips = 0	
    $('#betbox').addClass('hidden');
    $play.removeClass('hidden');
    $('#intro p').css("visibility","visible");
    $current.empty();
    $end.append($('<span></span>').html("Out of cash.<br>Game Over!"));
    $end.fadeIn(2000);
};

var initializeGame = function() {
    //set globals and prep game areas
    $play = $('#playbutton');
    $playerResult = $('div#player');
    $paytable = $('div#paytable');    
    $text = $('div#result');
    $end = $('div#gameover');
    $end.fadeOut(10);
    $end.empty();
    $current = $('<span id="currentbet"></span>');
    $play.addClass('hidden');
    $paytable.removeClass('hidden');
    $('#intro p').css("visibility","hidden");

    clearTable();

    //initialize classes and display pocket
    deck = new Deck();
    deck.shuffleDeck();
    player = new Player();
    $('div#pocket').html("$" + player.chips + " left in pocket");
    $('div#pocket').removeClass('hidden');
};

var clearTable = function() {
    //clear previous game & text
    $playerResult.html('').show();
    $text.html('').hide();
    $current.empty();
    $('#continuebox').addClass('hidden');
    $('#betbox').removeClass('hidden');
    $end.hide(10);
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
    $current.html("Current bet: $" + bet);
    $('#pocket').before($current);
    $('div#pocket').html("$" + player.chips + " left in pocket");
	
    playerHand = new Hand();
    
    //inital hand is displayed
    player.showHand();
    $('#holdbox').removeClass('hidden');
    $('div#playarea').removeClass('hidden'); 
};

var cashOut = function() {
    //grants winnings, prints hand and prompts to continue
    $('div#playarea').addClass('hidden');
    $('#holdbox').addClass('hidden');
    
    var result = printResult();
    $text.html(result).fadeIn(1000);
    
    $('div#pocket').html("$" + player.chips + " left in pocket");
    if (player.chips < 1) {   
    	gameOver();
    } else {
        $('div#continuebox').removeClass('hidden');
    }
};	
    
var tradeCards = function() {
	for (var i=0; i < playerHand.getHand().length; i++) {
		if ($('#card' + i).css('opacity') == 1.0) {
			playerHand.swapCard(i);
		}
	}
	player.showHand();
	cashOut();
};

var printResult = function() {
	var rank = hand_rank(playerHand);
	var winnings = 0;
	if (rank === 9 && bet === 5) {
		name = "SUPER MEGA ROYAL FLUSH!!";
		winnings = 4000;
	} else {
        switch (rank) {
            case 1:
		        name = "One Pair!";
    		    winnings = bet;
	    	    break;
		    case 2:
    		    name = "Two Pair!";
	    	    winnings = (2 * bet);
	            break;
    		case 3:
	    	    name = "Three of a Kind!";
		        winnings = (3 * bet);
		        break;
    		case 4:
	    	    name = "Straight!";
		        winnings = (4 * bet);
		        break;
    		case 5:
	    	    name = "Flush!";
		        winnings = (6 * bet);
		        break;
            case 6:
		        name = "Full House!";
    		    winnings = (9 * bet);
	    	    break;
		    case 7:
		        name = "Four of a Kind!";
    		    winnings = (25 * bet);
	    	    break;
		    case 8:
		        name = "Straight Flush!!";
    		    winnings = (50 * bet);
	    	    break;
		    case 9:
    		    name = "Royal Flush!!!";
	    	    winnings = (250 * bet);
		        break;
    		default:
	    	    name = "Nothing.";
		        break;    
	    }
	}
	player.chips += winnings;
	$current.html("Winnings: $" + winnings);
	return name;
};


function Player() {
    this.chips = 50;

    this.showHand = function() {
    	printCards();
    };
}

//uses card info to assign img
var printCards = function() {
    $playerResult.html('');   
    for (var i=0;i<playerHand.getHand().length;i++) {
        var name = playerHand.getHand()[i].getNumber();
        var suit = playerHand.getHand()[i].getSuit();
        switch (suit) {
            case 1:
                suit = "clubs";
                break;
            case 2:
                suit = "diamonds";
                break;
            case 3:
                suit = "hearts";
                break;
            case 4:
                suit = "spades";
                break;
        }
        switch (name){
            case 11:
                name = "jack";
                break;
            case 12:
                name = "queen";
                break;
            case 13:
                name = "king";
                break;
            case 1:
                name = "ace";
                break;   
        }
        $playerResult.append("<img class='pokerpics' id='card" + i + "' src='images/cards/" + name + suit + ".png'>");
    }
};

function Hand() {
    var hand = [];
    if (deck.getLength() < 11) {
		deck.shuffleDeck();
    }
    //deals 5 cards to player
    for (var i=0;i<5;i++) {
	    hand.push(deck.deal());
    }

    this.getHand = function() {
        return hand;
    };

    this.addCard = function() {
    	hand.push(deck.deal());
    };

    this.swapCard = function(pos) {
    	hand.splice(pos,1,deck.deal());
    };
}

//-->
