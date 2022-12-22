var MENU_ID = 'menu';
var DIFFICULTYBAR_ID = 'difficultyBar';
var HEROCHOICE_ID = 'heroChoice';
var SCORES_ID = 'scoresMenu';
var TABLE_ID = 'scoreTable'

var LOGIN_BTN = 'loginButton';
var LOGOUT_BTN = 'logoutButton';
var REGISTER_BTN = 'registerButton';
var SCORE_BTN = 'scoreButton';


/**************************************************************************************
    MENU-RELATED UTILITY FUNCTIONS
**************************************************************************************/
function createMenu(wrapper) {
    var menu = document.getElementById(MENU_ID);
    if (menu !== null)
        return;
    menu = newChild(wrapper, MENU_ID);
    menu.setAttribute('class', 'unselectable');

    if (GAME === null)
        mainMenuLayout(menu);
    else if (GAME.gameStateFlag.gameOverFlag)
        gameOverMenuLayout(menu);
    else
        pauseMenuLayout(menu);
}

function removeMenu() {
    var menu = document.getElementById(MENU_ID);
    if (menu !== null)
        menu.remove();
}

function createMenuButton(menu, buttonName, buttonText, buttonFunction) {
    var button = newChild(menu, buttonName, 'menuButton menuObject');
    button.onclick = function() {buttonFunction()};
    // create button's text
    newTextChild(button, buttonText);

    return button;
}

function createDifficultyButton(difficultyBar, buttonName, buttonText, parameter) {
    var button = newChild(difficultyBar, buttonName, 'difficultyButton');
    button.onclick = function() {
        // change difficulty
        difficulty = parameter;
        // highlight chosen difficulty
        for (var i = 0; i < difficultyBar.childElementCount; i++) {
            difficultyBar.childNodes[i].style.backgroundColor = '';
            difficultyBar.childNodes[i].style.color = 'silver';
        }
        button.style.backgroundColor = 'rgba(82, 78, 78, 1)';
        button.style.color = 'white';
    };
    // create button's text
    newTextChild(button, buttonText);

    return button;
}

function createHeroButton(heroChoice, buttonName, parameter) {
    var button = newChild(heroChoice, buttonName, 'heroButton sprite');
    button.style.backgroundImage = "url('./css/img/" + parameter + "/idle_anim_f3.png')";
    button.onclick = function() {
        // change hero
        hero = parameter;
        // highlight chosen difficulty
        for (var i = 0; i < heroChoice.childElementCount; i++) {
            heroChoice.childNodes[i].style.backgroundColor = '';
            heroChoice.childNodes[i].style.backgroundSize = '50%';
            heroChoice.childNodes[i].style.filter = 'grayscale(0.5)';
        }
        button.style.backgroundColor = 'rgba(82, 78, 78, 1)';
        button.style.backgroundSize = '70%';
        button.style.filter = 'grayscale(0)';
    };

    return button;
}


function createTopTenButton(scoreMenu) {
    var topTenButton = newChild(scoreMenu, 'topTenButton', 'authenticationButton', 'input');
    setAttributes(topTenButton, {'type': 'button', 'value': 'Top 10'});
    ajax_viewScoresButton('topTenButton');
}

function createMyScoresButton(scoreMenu) {
    var myScoresButton = newChild(scoreMenu, 'myScoresButton', 'authenticationButton', 'input');
    setAttributes(myScoresButton, {'type': 'button', 'value': 'My Scores'});
    ajax_viewScoresButton('myScoresButton');
}
/**************************************************************************************
    AUTHENTICATION SUB-MENU UTILITY FUNCTIONS
**************************************************************************************/
function createAuthenticationMenu(menu) {
    var authentication = newChild(menu, 'authentication');
    
    var authenticationForm = newChild(authentication, 'authenticationForm', null, 'form');
    setAttributes(authenticationForm, { 'action': '#', 'method': 'post' });

    ajax_checkLogin();

    var scoreBtn = newChild(authentication, SCORE_BTN, 'authenticationButton', 'input');
    setAttributes(scoreBtn, {'type': 'button', 'value': 'Score'});
    ajax_scoreButton(menu);
}

function createAuthenticationForm(authenticationForm) {
    var usernameBar = newChild(authenticationForm, 'usernameBar', null, 'input');
    setAttributes(usernameBar, { 'type': 'text', 'placeholder': 'Username'});
    usernameBar.required = true;

    var passwordBar = newChild(authenticationForm, 'passwordBar', null, 'input');
    setAttributes(passwordBar, { 'type': 'password', 'placeholder': 'Password'});
    passwordBar.required = true;
    
    var loginButton = newChild(authenticationForm, LOGIN_BTN, 'authenticationButton', 'input');
    setAttributes(loginButton, {'type': 'button', 'value': 'Login'});
    ajax_authenticateButton(LOGIN_BTN);

    var registerButton = newChild(authenticationForm, REGISTER_BTN, 'authenticationButton', 'input');
    setAttributes(registerButton, {'type': 'button', 'value': 'Register'});
    ajax_authenticateButton(REGISTER_BTN);

}

function createLogoutMenu(authenticationForm, username) {
    var welcomeMsg = newChild(authenticationForm, 'welcomeMsg_top', 'welcomeMsg', 'p');
    newTextChild(welcomeMsg, 'Welcome');
    welcomeMsg = newChild(authenticationForm, 'welcomeMsg_bottom', 'welcomeMsg', 'p');
    username = (username.length < 25) ? username : username.slice(0, 23)+'...';
    newTextChild(welcomeMsg, username);

    var logoutButton = newChild(authenticationForm, LOGOUT_BTN, 'authenticationButton', 'input');
    setAttributes(logoutButton, {'type': 'button', 'value': 'Logout'});
    ajax_logoutButton();

}

function authenticateMenuUpdate(data) {
    var authForm = document.getElementById('authenticationForm');
    if (data) {
        while(authForm.lastChild)
            authForm.removeChild(authForm.lastChild);
        createLogoutMenu(authForm, data);
    } else {
        var registerBtn = document.getElementById(REGISTER_BTN);
        if (registerBtn === null) {
            while(authForm.lastChild)
                authForm.removeChild(authForm.lastChild);
            
            createAuthenticationForm(authForm);
        } else {
            // if something gone wrong, form fields background turns red
            var usernameBar = document.getElementById('usernameBar');
            var passwordBar = document.getElementById('passwordBar');
            usernameBar.style.backgroundColor = 'lightcoral';
            passwordBar.style.backgroundColor = 'lightcoral';
        }
    }

}


/**************************************************************************************
    MENU LAYOUTS
**************************************************************************************/
function mainMenuLayout(menu) {
    menu.style.height = '90%';
    menu.style.width = '80%';
    newTextChild(menu, 'Legend Of Pirøk');
    menu.style.fontSize = 'calc( 0.09 * var(--playground-height) )';
    menu.style.color = 'white';
    // create buttons
    createMenuButton(menu, 'newGameButton', 'NEW GAME', newGame);

    var difficultyBar = newChild(menu, DIFFICULTYBAR_ID, 'menuObject subMenu');
    // three difficulty levels
    createDifficultyButton(difficultyBar, 'easyDifficultyButton', 'EASY', 0);
    var normal = createDifficultyButton(difficultyBar, 'normalDifficultyButton', 'NORMAL', 1);
    createDifficultyButton(difficultyBar, 'hardDifficultyButton', 'HARD', 2);
    // normal difficulty is the default one, so it's highlighted from the beginning
    normal.style.backgroundColor = 'rgba(82, 78, 78, 1)';
    normal.style.color = 'white';

    var heroChoice = newChild(menu, HEROCHOICE_ID, 'menuObject subMenu');
    var knight_m = createHeroButton(heroChoice, 'heroButton_1', 'knight_m');
    var knight_f = createHeroButton(heroChoice, 'heroButton_2', 'knight_f');

    knight_m.style.backgroundColor = 'rgba(82, 78, 78, 1)';
    knight_m.style.backgroundSize = '70%';
    knight_m.style.filter = 'grayscale(0)';
    knight_f.style.transform = 'scaleX(-1)';

    createAuthenticationMenu(menu);

    newChild(menu, 'linkDivider', null, 'hr');
    var guideLink = newChild(menu, 'guideLink', null, 'a');
    newTextChild(guideLink, 'Guide');
    guideLink.setAttribute('href', './guide.html');
}


function pauseMenuLayout(menu) {
    setTimeout( function(menu){ // pause menu animation
        menu.style.height = '30%';
        menu.style.width = '80%';

        setTimeout( function(menu){
            newTextChild(menu, '- PAUSE -');
            // create buttons
            var button = createMenuButton(menu, 'restartButton', 'RESTART', restart);
            button.style.height = '20%'
            button = createMenuButton(menu, 'mainMenuButton', 'MAIN MENU', toMainManu);
            button.style.height = '20%'
        }, 200, menu);

    }, 50, menu);

}


function gameOverMenuLayout(menu) {
    setTimeout( function(menu){ // gameOver menu animation
        menu.style.height = '35%';
        menu.style.width = '80%';

        setTimeout( function(menu){
            newTextChild(menu, '- YOU DIED -');
            menu.style.color = 'darkred';
            // create flavour-text
            var text = document.createElement('p');
            text.setAttribute('class','flavourText');
            var quotes = ['..maybe next time!', 'You were the Chosen One!', 'Requiescat In Pace', 'OUCH! That hurts!'];
            var i = Math.floor(Math.random() * quotes.length);
            var flavourText = quotes[i];
            newTextChild(text, flavourText);
            menu.appendChild(text);
            // create buttons
            var button = createMenuButton(menu, 'restartButton', 'RESTART', restart);
            button.style.height = '20%'
            button = createMenuButton(menu, 'mainMenuButton', 'MAIN MENU', toMainManu);
            button.style.height = '20%'
        }, 200, menu);

    }, 50, menu);

}


/**************************************************************************************
    BUTTON FUNCTIONS
**************************************************************************************/
function newGame() {
    removeMenu();
    newChild(wrapper, STATUSBAR_ID);
    newChild(wrapper, PLAYGROUND_ID);
    GAME = new Game(wrapper);
    GAME.start();

}


function restart() {
    removeMenu();
    GAME.sketcher.removeShop();
    GAME.sketcher.removeAll(GAME);
    controller.pause = false;
    controller.skill = false;
    GAME.start();

}


function toMainManu() {
    removeMenu();
    GAME.sketcher.removeShop();
    GAME.gameStateFlag.pauseAll();        
    window.removeEventListener('keydown', GAME.keyEventListener, false);
    window.removeEventListener('keyup', GAME.keyEventListener, false);
    playground.removeEventListener('mousemove', GAME.mouseMoveListener.bind(GAME));
    playground.removeEventListener('mousedown', GAME.mouseClickListener.bind(GAME));
    delete GAME.keyEventListener;
    
    GAME.sketcher.removeAll(GAME);
    delete GAME.sketcher;
    delete GAME.playground;
    delete GAME.gameStateFlag;
    GAME = null;
    controller.pause = false;
    controller.skill = false;
    // default values
    hero = 'knight_m';
    difficulty = 1;
    score = 0;

    document.getElementById(STATUSBAR_ID).remove();
    document.getElementById(PLAYGROUND_ID).remove();
    createMenu(wrapper);

}