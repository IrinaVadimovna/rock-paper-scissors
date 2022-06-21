function play () {
    nameBlock();

    for (let i = 0; i < window.application.blocks.moveGame.length; i++) {
       let moveButton = window.application.blocks.moveGame[i];

       moveButton.addEventListener('click', function(e){
    
            const url = `https://skypro-rock-scissors-paper.herokuapp.com/play?token=${window.application.token}&id=${window.application.id}&move=${this.getAttribute("data-move")}`;
            $.ajax({
                method: 'GET',
                url,
                type: 'json',
                success: function (data){
                    window.application.timers = setInterval(gameStat, 500);
                },
                
            });
       
            function gameStat (){
                        const url = `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${window.application.token}&id=${window.application.id}`;
                        $.ajax({
                            method: 'GET',
                            url,
                            type: 'json',
                            success: function(data){
                        console.log(data);
                        playStatus(data["game-status"].status);
                        }
                    }); 
                }
        });  
    }
}

function playStatus (userStatus){
    if(userStatus === 'waiting-for-enemy-move'){

        window.application.renderScreen('game');
        nameBlock();

        window.application.renderBlock('gameText', `<div class="gameText">Ожидаем ход соперника...</div>`);
        window.application.renderBlock('gameButton', `<div class="gameButton"></div>`);
    }
    if(userStatus === 'waiting-for-your-move'){
        window.application.renderScreen('game');
        nameBlock();
        window.application.renderBlock('gameEnemy', `<div class="gameEnemy title_status">Ничья! Второй раунд игры.</div>`);

        play ();
        clearInterval(window.application.timers);
    }
    if(userStatus === 'lose'){
        
        window.application.renderScreen('game');
        nameBlock();

        window.application.renderBlock('gameText', `<div class="gameText">Вы проиграли</div>`);
        window.application.renderBlock('gameButton', `<div class="gameButton"><button class="button lobbi">В лобби</button><button class="button game">Играть еще раз</button></div>`);
        clearInterval(window.application.timers);

        winLoseLobbi();
        winLoseNewGame();
    }
    if(userStatus === 'win'){
        
        window.application.renderScreen('game');
        
        nameBlock();

        window.application.renderBlock('gameText', `<div class="gameText">Вы выиграли</div>`);
        window.application.renderBlock('gameButton', `<div class="gameButton"><button class="button lobbi">В лобби</button><button class="button game">Играть еще раз</button></div>`);
       
        clearInterval(window.application.timers);

        winLoseLobbi();
        winLoseNewGame();

}
}

function winLoseLobbi() {
    nameBlock();
        window.application.blocks.inLobbiButton.addEventListener('click', function (){
            let url = `https://skypro-rock-scissors-paper.herokuapp.com/player-list`;
                $.ajax({
                    method: 'GET',
                    url,
                    type: 'json',
                    success: function (data){
                        let playerList = [];
                        playerList.push(data.list);

                        window.application.renderScreen('lobbi');
                        window.application.blocks.nick = document.querySelector('.nick');

                        let userBlocks = '';
                        for (let i = 0; i < playerList[0].length; i++) {
                            const user = playerList[0][i].login;
                            userBlocks += `<p class="title_status">${user}</p>`;
                        }
                        window.application.renderBlock('nick', userBlocks);

                        window.application.blocks.lobbiButton = document.querySelector('.lobbi_button');
                        clickLobbiButton(window.application.blocks.lobbiButton);
                    }
                    
                });
        });
    }

function winLoseNewGame() {
    window.application.blocks.newGame.addEventListener('click', function (){
        console.log('привет');
        const url = `https://skypro-rock-scissors-paper.herokuapp.com/start?token=${window.application.token}`;

    $.ajax({
        method: 'GET',
        url,
        type: 'json',
        success: function(data){
        if(data.status === 'ok'){
            window.application.id = data["player-status"].game.id;
            const url = `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${window.application.token}&id=${window.application.id}`;

            function gameStatus(){
                $.ajax({
                method: 'GET',
                url,
                type: 'json',
                success: function (data){

                    let userStatus = data["game-status"].status;
                    console.log(userStatus);

                    if(userStatus === 'waiting-for-start'){
                        window.application.renderScreen('game');
                        nameBlock();

                        window.application.renderBlock('gameText', `<div class="gameText">Ожидаем подключение соперника...</div>`);
                        window.application.renderBlock('gameButton', `<div class="gameButton"></div>`);
                    }

                    if(userStatus === 'waiting-for-your-move'){
                        clearInterval(timerId);
                        let enemy = data["game-status"].enemy.login;

                        window.application.renderScreen('game');
                        nameBlock();

                        window.application.renderBlock('gameEnemy', `<div class="gameEnemy title_status">Вы против ${enemy}</div>`);

                        play ();
                    }
                }
            });
        }
        let timerId = setInterval(gameStatus, 500);
        }
        }
    }); 
});  
}