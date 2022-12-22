
function ajax_authenticateButton(btn){
    var button = '#' + btn;

    $(button).click(function(evt){
        evt = (!evt) ? window.event : evt;  // IE -> !evt
        evt.preventDefault();
        var username = $('#usernameBar').val();
        var password = $('#passwordBar').val();

        if (username == '' || password == '') {
            alert('Please fill both the username and password fields!');
            
        } else {
            var param = {username: username, password: password};
        
            // pass via post method username and password to php file
            if (button === '#' + REGISTER_BTN)
                $.post('./php/register.php', param, function(result){
                    console.log(result);
                    ajax_checkLogin(); //check if we are logged in and update authentication form accordingly
                });
            else if (button === '#' + LOGIN_BTN)
                $.post('./php/login.php', param, function(result){
                    console.log(result);
                    ajax_checkLogin(); //check if we are logged in and update authentication form accordingly
                });
        }

    });

}

function ajax_logoutButton(){
    var button = '#' + LOGOUT_BTN;

    $(button).click(function(evt){
        evt = (!evt) ? window.event : evt;  // IE -> !evt
        evt.preventDefault();
        $.getJSON('./php/logout.php', null, function(result){
            console.log(result);
        });
        ajax_checkLogin(); //check if we are logged out and update authentication form accordingly
    });

}

function ajax_checkLogin(){
        $.ajax({
            url: "./php/checkLogin.php",
            success: function(data) {
                authenticateMenuUpdate(data);
            }
        });
}


function ajax_sendScore(level) {
    var diff = 'Easy';
    switch (difficulty) {
        case 1:
            diff = 'Normal';
        break;
        case 2:
            diff = 'Hard';
        break;
    }
    
    var param = {difficulty: diff, level: level, score: score};
    $.getJSON('./php/newScore.php', param, function(result){
        console.log(result);
    });

}


function ajax_scoreButton(menu) {
    var button = '#' + SCORE_BTN;
    var scoreMenu = '#' + SCORES_ID;
    
    $(button).click(function(evt){
        evt = (!evt) ? window.event : evt;  // IE -> !evt
        evt.preventDefault();
        if (!$(scoreMenu).length) {
            var scoresMenu = newChild(menu, SCORES_ID, 'subMenu');
            //animation
            setTimeout(function(){
                scoresMenu.style.height = '66%';
            }, 10);

            createTopTenButton(scoresMenu);
            createMyScoresButton(scoresMenu);

            $.ajax({
                type: "get",
                url: "./php/viewTopTen.php",
                success: function(data) {
                    ajax_buildScoreTable(data);
                }
            });

        } else {
            $(scoreMenu).remove();
        }
    });

}

function ajax_viewScoresButton(btn) {
    var button = '#' + btn;
    var otherButton = (button === '#myScoresButton') ? '#topTenButton' : '#myScoresButton';
    var scoreTable = '#' + TABLE_ID;
        
    $(button).click(function(evt){
        evt = (!evt) ? window.event : evt;  // IE -> !evt
        evt.preventDefault();

        $(scoreTable).remove();

        $(button).css('background-color', 'rgb(75, 71, 71)');
        $(button).css('border-style', 'inset');
        $(otherButton).css('background-color', ' rgb(104, 99, 99)');
        $(otherButton).css('border-style', 'outset');

        if (button === '#topTenButton') {
            
            $.ajax({
                type: "get",
                url: "./php/viewTopTen.php",
                success: function(data) {
                    ajax_buildScoreTable(data);
                }
            });

        } else {
            
            $.ajax({
                type: "get",
                url: "./php/viewMyScores.php",
                success: function(data) {
                    ajax_buildScoreTable(data);
                }
            });
        
        }
    });

}


function ajax_buildScoreTable(data) {
    var array = JSON.parse('[' + data + ']')[0]; //converts PHP string into array of objects {username, difficulty, level, score}

    var scoresMenuNode = document.getElementById(SCORES_ID);
    var tableNode = newChild(scoresMenuNode, TABLE_ID, null, 'table');
    var attributeRow = newChild(tableNode, 'attributeRow', null, 'tr');

    var usernameColumn = newChild(attributeRow, 'usernameColumn', 'talbeAttribute', 'td');
    var difficultyColumn = newChild(attributeRow, 'difficultyColumn', 'talbeAttribute', 'td');
    var levelColumn = newChild(attributeRow, 'levelColumn', 'talbeAttribute', 'td');
    var scoreColumn = newChild(attributeRow, 'scoreColumn', 'talbeAttribute', 'td');
    newTextChild(usernameColumn, ' Username ');
    newTextChild(difficultyColumn, ' Difficulty ');
    newTextChild(levelColumn, ' Level ');
    newTextChild(scoreColumn, ' Score ');

    for (var i = 0; i < array.length; i++){
        // console.log(array[i]);
        var row = newChild(tableNode, 'row_' + i, null, 'tr');

        for (var j = 0; j < 4; j++) {
            var cell = newChild(row, 'cell_' + i + '_' + j, null, 'td');
            switch (j) {
                case 0:
                    newTextChild(cell, array[i].username);
                break;
                case 1:
                    newTextChild(cell, array[i].difficulty);
                break;
                case 2:
                    newTextChild(cell, array[i].level);
                break;
                case 3:
                    newTextChild(cell, array[i].score);
                break;
            }
        }

    }
}