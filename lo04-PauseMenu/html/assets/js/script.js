$('body').hide();

window.addEventListener('message', (event) => {
    if (event.data.type === "ui") {
        if (event.data.status) {
            $('body').fadeIn();
        } else {
            $('body').fadeOut();
        }
    }
});

document.onkeydown = e => {
    if (e.keyCode === 27)
        $.post('http://lo04-PauseMenu/close', JSON.stringify({}));
}

document.onclick = e => {
    switch (e.target.id) {
        case "riprendi": 
            $.post('http://lo04-PauseMenu/close', JSON.stringify({}));
            break;
        case "mappa":
            $.post('http://lo04-PauseMenu/map', JSON.stringify({}));
            break;
        case "impostazioni":
            $.post('http://lo04-PauseMenu/settings', JSON.stringify({}));
            break;
        case "discord":
            window.invokeNative('openUrl', 'https://discord.gg/kKxYVzCs8p')
            $.post('http://lo04-PauseMenu/close', JSON.stringify({}));
            break;
        case "quit":
            $.post('http://lo04-PauseMenu/quit', JSON.stringify({}));
            break;
    }
}