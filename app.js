window.application.blocks.form.addEventListener('submit', function(event){
    event.preventDefault();
    let userLogin = window.application.blocks.loginInput.value;

    let url = `https://skypro-rock-scissors-paper.herokuapp.com/login?login=${userLogin}`;

    $.ajax({
        method: 'GET',
        url,
        type: 'json',
        success: function (data){
            if(data.status === 'ok'){
                window.application.token = data.token;

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

                if (window.application.blocks.error){
                    window.application.blocks.error.remove();
                }
            } else if(data.status === 'error'){
                window.application.blocks.error.textContent = 'Введите никнейм в поле ввода!';
                window.application.blocks.loginInput.style.border = '2px solid #CD5C5C';
            }
            
        }
    });
});

function clickLobbiButton(lobbiButton){

    lobbiButton.addEventListener('click', function(){
        const url = `https://skypro-rock-scissors-paper.herokuapp.com/start?token=${window.application.token}`;

        $.ajax({
            method: 'GET',
            url,
            type: 'json',
            success: function(data){
            if(data.status === 'error'){
                console.log(data);
                window.application.renderScreen('game');

                nameBlock();

                window.application.renderBlock('gameText', `<div class="gameText">Такой логин уже есть!</div>`);
                window.application.renderBlock('gameButton', `<div class="gameButton"></div>`);
            }
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
function nameBlock(){
    window.application.blocks.gameButton = document.querySelector('.game_button');
    window.application.blocks.gameText = document.querySelector('.gameText');
    window.application.blocks.gameEnemy = document.querySelector('.game_enemy');
    window.application.blocks.moveGame = document.querySelectorAll('.moveGame');
    window.application.blocks.inLobbiButton = document.querySelector('.lobbi');
    window.application.blocks.newGame = document.querySelector('.game');
}
