document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================
       CONFETTI LOGIC
       ========================== */
    const sendLoveBtn = document.getElementById('send-love-btn');
    const confettiContainer = document.getElementById('confetti-container');

    const colors = ['#ff758c', '#ff7eb3', '#fbc2eb', '#a6c1ee', '#ffffff', '#ff9a9e'];

    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random properties
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            
            // Random shapes (circle or square)
            if (Math.random() > 0.5) confetti.style.borderRadius = '50%';
            
            // Random animation duration and delay
            const duration = Math.random() * 3 + 2; // 2-5 seconds
            confetti.style.animationDuration = duration + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Clean up
            setTimeout(() => {
                confetti.remove();
            }, (duration + 2) * 1000);
        }
    }

    sendLoveBtn.addEventListener('click', () => {
        createConfetti();
        sendLoveBtn.textContent = 'Love Sent! 💖';
        setTimeout(() => {
            sendLoveBtn.textContent = 'Send Love 💌';
        }, 3000);
    });

    /* ==========================
       MEMORY MATCH GAME
       ========================== */
    const memoryBoard = document.getElementById('memory-board');
    const movesCountSpan = document.getElementById('moves-count');
    const restartMemoryBtn = document.getElementById('restart-memory-btn');
    const memoryWinMessage = document.getElementById('memory-win-message');

    const emojis = ['🐶', '🐱', '🌸', '🍓', '💖', '🧸'];
    let cardsArray = [...emojis, ...emojis];
    
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;

    function shuffleCards() {
        cardsArray.sort(() => 0.5 - Math.random());
    }

    function createMemoryBoard() {
        memoryBoard.innerHTML = '';
        shuffleCards();
        matchedPairs = 0;
        moves = 0;
        movesCountSpan.textContent = `Moves: ${moves}`;
        memoryWinMessage.classList.add('hidden');
        
        cardsArray.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.emoji = emoji;

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.textContent = emoji;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', flipCard);
            memoryBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        moves++;
        movesCountSpan.textContent = `Moves: ${moves}`;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        
        if (matchedPairs === emojis.length) {
            setTimeout(() => {
                memoryWinMessage.classList.remove('hidden');
                createConfetti();
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    restartMemoryBtn.addEventListener('click', createMemoryBoard);
    
    // Initialize Memory Game
    createMemoryBoard();


    /* ==========================
       BUBBLE POP GAME
       ========================== */
    const bubbleBoard = document.getElementById('bubble-board');
    const bubblesPoppedSpan = document.getElementById('bubbles-popped');
    const restartBubbleBtn = document.getElementById('restart-bubble-btn');
    const bubbleMessageDisplay = document.getElementById('bubble-message-display');
    const bubbleWinMessage = document.getElementById('bubble-win-message');

    let bubblesPopped = 0;
    const totalBubbles = 10;
    let bubbleInterval;
    
    const sweetMessages = [
        "You're amazing!", "Feel better soon!", "I miss your smile", 
        "Sending big hugs", "You are so strong", "Rest up!", 
        "Love you bunches", "Thinking of you", "Get well quickly", "You're the best!"
    ];

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random position within the board
        const size = 50;
        const maxX = bubbleBoard.clientWidth - size;
        const maxY = bubbleBoard.clientHeight - size;
        
        bubble.style.left = Math.random() * maxX + 'px';
        bubble.style.top = Math.random() * maxY + 'px';
        
        // Random float animation
        bubble.animate([
            { transform: 'translateY(0px)' },
            { transform: `translateY(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 20 + 10}px)` },
            { transform: 'translateY(0px)' }
        ], {
            duration: Math.random() * 2000 + 2000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        bubble.addEventListener('click', () => {
            if (bubble.classList.contains('popped')) return;
            bubble.classList.add('popped');
            bubblesPopped++;
            bubblesPoppedSpan.textContent = `Popped: ${bubblesPopped}/${totalBubbles}`;
            
            // Show a random sweet message
            bubbleMessageDisplay.textContent = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
            
            setTimeout(() => {
                bubble.remove();
                if (bubblesPopped === totalBubbles) {
                    winBubbleGame();
                } else {
                    createBubble(); // Spawn a new one to replace it
                }
            }, 300);
        });

        bubbleBoard.appendChild(bubble);
    }

    function initBubbleGame() {
        bubbleBoard.innerHTML = '';
        bubblesPopped = 0;
        bubblesPoppedSpan.textContent = `Popped: ${bubblesPopped}/${totalBubbles}`;
        bubbleMessageDisplay.textContent = "Pop a bubble!";
        bubbleWinMessage.classList.add('hidden');
        
        // Initial spawn
        for (let i = 0; i < 5; i++) {
            createBubble();
        }
    }

    function winBubbleGame() {
        bubbleBoard.innerHTML = '';
        bubbleMessageDisplay.textContent = "";
        bubbleWinMessage.classList.remove('hidden');
        createConfetti();
    }

    restartBubbleBtn.addEventListener('click', initBubbleGame);
    
    // Initialize Bubble Game
    initBubbleGame();

});
