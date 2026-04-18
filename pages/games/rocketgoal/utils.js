var gameInstance;

function initializeUtils(unityInstance) {
    console.log("Initializing js utils");

    gameInstance = unityInstance;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function RegisterGameFocusCallbackInternal(callback){
    /*let iframe = document.getElementById('game');

    while (!iframe) {
        await delay(500);
        iframe = document.getElementById('game');
    }
    
    console.log("Found game focus element");

    while (!gameInstance) {
        await delay(500);
    }

    iframe.addEventListener("focus", () => {
        callback(true);
    });

    iframe.addEventListener("blur", () => {
        callback(false);
    });

    console.log("Finished game focus callbacks register");

    gameInstance.SendMessage(
        'WebMobileCanvas',
        "OnRegisteredFocusCallback"
    );*/
}

function IsGameFocusedInternal() {
    return true;
    /*const iframe = document.getElementById('game');
    
    if (!iframe) {
        return true;
    }
    
    return document.activeElement === iframe;*/
}
