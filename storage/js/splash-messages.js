const phrases = [
    `hi guys`,
    `cheese`,
    `dont type this on your keyboard: up, up, down, down, left, right, left, right, B, A, enter`,
    `{hostname} certified banger 💯`,
    `im in your walls`,
    `hi gng`,
    `get a load of this guy 😂🫵`,
    `sussy blud 😂🫱🫱`,
    `good boy`,
    `view this updates changelog {here}`,
    `gng if you pay me 10p ill add smth to my site 👌`,
    { type: "image", width: '40%', src: `/storage/images/splash1.jpeg` },
    { type: "image", width: '60%', src: `/storage/images/splash2.gif` },
    { type: "image", width: '35%', src: `/storage/images/splash3.png` },
    { type: "image", width: '40%', src: `/storage/images/splash4.gif` },
    { type: "image", width: '99%', src: `/storage/images/splash5.gif` },
    { type: "image", width: '99%', src: `/storage/images/splash6.png` },
    `i accidentally muted the teacher`,
    `who remembers when i had like 4 games 😭`,
    `window._mssdk.cacheOpts[aid] has not bee initialized yet!!!!`,
    `my homework ate my dog`,
    `late to class again`,
    `now with MORE html`,
    `you can click me you know`,
    `omg i better not get iss for this 😭`,
    `made at school`,
    `made with javascript`,
    `cheers voucan`,
    `press ctrl+shift+q+q for hidden game`,
    `school. is. bad`,
    `school lunch is mid`,
    `i dare you to rub a magnet on the side of your chromebook`,
    `bruh`,
    `first time was so nice, we had to do it twice 🥀💀`,
    `we should be able to play football ⚽`,
    `index.html`,
    `vro 🥀`,
    `fortnite is cringe`,
    `obama have dih 🥀`,
    `i kinda gooned to mbappé 🥀`,
    `help`,
    `ts not tuff 🥀😭`,
    `sleep is for the weak 🥀`,
    `i forgot to mute`,
    `someone stole my mouse`,
    `why is the fan so loud`,
    `chromebooks suck`,
    `this is definitely schoolwork`,
    `school says no fun`,
    `how many times have u clicked it`,
    `deployed on netlify`,
    `can someone help me find a bare`,
    `splash-messages.js`,
    `static proxy 😱 those who know 💀`,
    `who votes yt should be unblocked`,
    `who can help me code`,
    `sub teacher today yay`,
    `math test tomorrow`,
    `the bell just rang`,
    `calculator? more like calc-you-later! 🥀 (i didnt make this one)`,
    `forgot my pe clothes, again.`,
    `phonk 🗣️🗣️🔥🔥`,
    `anyone up for basketball after school?`,
    `i dont like sitting near the window during class`,
    `💀`,
    `ts ste lwk pmo ngl lke icl ts ste is so bns ddss nt gnna us ts 🥀`,
    `:D`,
    `best static website for the unemployed`,
    `{hostname} ayyy 🗣️🗣️🔥🔥`,
    `ヽ༼ ಠ益ಠ ༽ﾉ`,
    `i swear I'm paying attention`,
    `am i not the only one with 481178:44:26 hours on minecraft`,
    `i saw you got a U on your last test 💀`,
    `mom`,
    `(╯°□°)╯︵ ┻━┻`,
    `hehe`,
    `stop asking for red dead to me and maybe i'll think abt it 🥀`,
    `https://youtube.com/watch?v=dQw4w9WgXcQ`,
    `whoa is this a splash text`,
    `this is ur ip: {ip}, if u dont believe me, hit ctrl + shift + j`,
    `teacher gave us too much homework 😭`,
    `downloading your passwords...`,
    `the wifi went out... again 💀`,
    `stop clicking me`,
    `😉`,
    `hello`,
    `NUKE INCOMING!`,
    `i spent way too much time making these`,
    `middle text`,
    `w h a t`,
    `my phone passcode is 563543 btw`,
    `reload the page NOW!`,
    `beep boop! are you a robot?`,
    `stop skidding my website 😭`,
    `oh the weather outside is rizzy, and the fire is so skibidi, and since ive gyatt to go, ohio ohio ohio`,
    `oh the weather outside is rizzy`,
    `i forgor`,
    `school uses blocker *inefective*`,
    `snuck a snack into class 😎 (tuff?)`,
    `no phones during school hour`,
    `why did you ask me to add bitlife 😭`,
    `:0`,
    `Roblox? Cringe!`,
    `i wanted free vbucks :(`,
    `what the dog doin?`,
    `powered by 20gb of ram!*`,
    `Avocados \ud83e\udd51 from Mexico \ud83c\uddf2\ud83c\uddfd`,
    `if you are using microsoft edge, you need some help.`,
    `made in the uk`,
    `better than tortilla games`,
    `#Relatable`,
    `redbull gives u wings`,
    `as seen on tv!`,
    `how many sides does a circle have? (ans 3 🤫)`,
    `you can read btw`,
    `now with less bugs`,
    `hello, this is microsoft tech support`,
    `press ctrl+shift+q+q for free money`,
    `doot doot`,
    `{ip} ← defo not ur ip 🤷‍♂️🥀`,
    `◉_◉`,
    `heres a free bare: {bare}`,
    `the school can’t stop me now 😎 (100% certified as tuff 💪)`,
    `my homework folder is suspiciously fun`,
    `this tab self-destructs in 3… 2…`,
    `ctrl+w for secret mode`,
    `proxy speedrun any%`,
    `no cap this site tuff 🥀`,
    `✏️ just taking notes… on unblocking`,
    `trust me i’m a coder 🤓`,
    `this is my villain arc`,
    `my site is faster than my grades`,
    `ts guy called phoniex stole all my code, bruh`,
    `built with html, css, javascript and tears`,
    `what are you looking at👀`,
    `stealth mode engaged`,
    `😤 built different`,
    `this site bypasses everything`,
    `🕶️ incognito mode? nah proxy mode (i didnt make ts 🥀)`,
    `is this even legal`,
    `one more tab won’t hurt`,
    `one more juice box🧃for my coding session`,
    `html never tasted so good`,
    `pls unblock discord 🙏`,
    `📎hi i'm clippy and i’m stuck here`,
    `0 homework 1 tab`,
    `📎 unblocked since 2025 (how long till blocked?)`,
    `📵 definitely not off-task 📵`,
    `html is my coping mechanism`,
    `👻 ghost tab`,
    `skibid`,
    `hear me out: css 🤫`,
    `1 vCPU, 4 GB RAM, 20 GB Storage, dont use it all. seriously.`,
    `chrome://inducebrowsercrashforrealz`,
    `sup 👋`,
    `oops.. i thought that tab was muted`,
    `made on github, deployed on netlify`,
    `best proxy? lmk`,
    `error 404: page not found`,
    `pls dont block the site 🙏`,
    `szvy central sucks`,
    `🙂 dıןɟ ʎddıןɟ ɐ pıp ǝƃɐd ǝɥʇ sdooɥʍ`,
    `click on the cloud for roms ☁`,
    `you can play fh5 on gfn!`,
    `have you heard the rumor about the pencil, nevermind its pointless 🥀😭`,
    `tried to make a belt of watches, it was a waist of time 😭🥀`,
    `i dont even know what to put here anymore`,
    `subscribe to zboychad!`,
    `cruz was here..`,
    `we all know who has a chopped chin`,
    `"brainrot is bad", 💀 what a loser`,
    `is this tuff in chindia 🥀😭`,
    `yoo wsg josh`,
    `click me, you wont`,
    `tip: ps1 games crash chromebooks.. unless you have a Ryzen 7 9800X3D, Nvidia GeForce RTX 5070, MSI MAG A550BN and 3.9L twin-turbo V8, then your good. (was that funny?)`,
    `tip: use {hostname}/cloak, it doesent show on your history!`,
    `how does no one know where the games are 😭🙏`,
    `no ads!`,
    `i spent like 3 months making this site, your welcome for all my hard work`,
    `👈(ﾟヮﾟ👈)`,
    `God is our refuge and strength, an ever-present help in trouble - Psalm 46:1`,
    `pls stop telling me to fix the movies 😭 (it depends on a server which i cant control)`,
    `Why did the AI break up with the toaster? - Because it was giving major NPC vibes and couldn't handle the rizz overload. 💀`,
    `What did the TikTok say to the YouTube Short? - “Stay in your lane, boomer.” 📱😤`,
    `all the cringe jokes were generated by chatgpt 👍`,
    `80+ games!`,
    `somehow still w no ads`,
    `should i add ads?, lmk`,
    `funny guy, am i right 💀☠️☠️`,
    `currently the time is: {time}`,
    `i make no money from ts 🥀`,
    `currently you are on: {hostname}`,
    `what games should i add?`,
    `you can turn off the particles in settings`,
    `why did the chicken cross the road - to get to the other side 🤣🤣`,
    `{hostname} ≫ classroom.google.com`,
    `who remembers edshed?`,
    `ts so buns bro 🥀`, 
    `theres like over 300 splash messages, wow`,
    `why do they call it oven if you oven the cold food of out hot eat the food`,
    `shoutout to git 🎉🥳`,
    `i think you should play subway surfers`,
    `i think you should play bad piggies`,
    `still not blocked? let's keep it that way 😏`,
    `coding this during lunch break 💀 (dead serious btw)`, 
    `ur not supposed to be here, but welcome`,
    `who needs sleep when you have proxies 🥀`,
    `click here to get rizz (not guaranteed)`,
    `wifi said nah 💀`,
    `if this crashes, it wasn’t me 🙏`,
    `pls don’t snitch 🙏`,
    `not on task? perfect 🥀`,
    `chromeOS can't handle this rizz`,
    `made this instead of doing my homework 💀`,
    `trusted by 3 kids in the back of the class`,
    `ctrl+d to save!`,
    `bro even tried to block localhost 💀`,
    `i swear i’m just researching`,
    `use rammerhead to watch youtube gng ✌`,
    `wifi’s down, but proxy’s up`,
    `this site runs on snacks and caffeine`,
    `shoutout to netlify & fastly 🎉🥳`,
    `anyone know how to modify ipsw for icloud bypass?, all i know is ./img4 -i /{ip}/iPhone12,1_18.5_22F76_Restore/044-89572-099.dmg.aea -o /{ip}/rootfs.dmg -k <hex_key> -iv 00000000000000000000000000000000`,
    `buy me a coffee? buymeacoffee.com/interstellar.website`,
    `if blocked use: interstellar-is.onthewifi.com`,
    `iframe 0 Interstellar 3.1 1 👌`,
        `do not replace Interstellar3.1://newtab-page with Interstellar3.1://secret 🤫`,
        `hey all Interstellar 3.1 users`,
        `bored? Interstellar3.1://secret`,
        `made with 💖 by Interstellar 3.1`,
        `↑ Interstellar 3.1 ↑`,
        `Interstellar 3.1 ≫ 55gms`, 
        `interstellar-is.onthewifi.com \u2192 new domain 🎉🥳`,
    `git clone github.com/xerub/img4tool.git && cd img4tool && make`,
    `powershell: wsl --install`,
    `ispw.netlify.app \u2192 new subdomain`,
    `shoutout to github 🎉🥳`,
    `pov: you know about CORS 😱`,
    `school wifi speed: 0.01 kb/s`,
    `i’m just a splash message`,
    `TypeError: Failed to construct 'URL': Invalid URL`,
    `my code compiles on the first try 🥳`,
    `console.log('hello world')`,
    `i have no idea what i'm doing`,
    `i'm not procrastinating, i'm optimizing`,
    `brb, debugging`,
    `this tab is haunted 👻`,
    `i speak fluent javascript: function saySeeICan(){console.log("See, I can");} saySeeICan();`,
    `brb, eating snacks`,
    `time for a break`,
    `dont forget to save`,
    `the wifi is weak today`,
    `my code never crashes (fingers crossed)`,
    `if you can read this, you’re awesome`,
    `may the wifi be with you`,
    `keep calm and proxy on 🤣😂`,
    `i’m just here for the memes (there funny right? ☠️)`,
    `skull emoji in the big '25 💀`,
    `life’s too short for slow internet`,
    `bro stop asking for baldi's basics 😭`,
    `if im gonna be honest SLAY! is the best phonk 😱`,
    `imagine if the time right now was: {time}`,
    `psst\u2026 check the console (ctrl+shift+j) log 👀`,
    `psst\u2026 come closer\u2026`,
    `use {hostname}/cloak, thank me later`,
    `if bored → open devtools`,
    `proxy so cold it froze my tabs 🥶`,
    `73.2% HTML, 25.6% Javascript, 0% homework`,
    `why so splashy? 🐸`,
    `we deploy when you're asleep`,
    `☁️ cloud-powered shenanigans ☁️`,
    `css is just vibes`,
    `html be like: trust me bro`,
    `your ip is safe... maybe: {ip}`,
    `fun fact: this is a splash message`,
    `console.log(“splash”)`,
    `who needs class when you have {hostname}?`,
    `ur not slick with that second tab..`,
    `i’m just a bunch of words`,
    `who needs google classroom`,
    `this site is vibing fr`,
    `coded on school wifi 😤`,
    `i ran out of ideas at message 261`,
    `{hostname} is love, {hostname} is life`,
    `no one: me: let’s add 200+ splash messages`,
    `{hostname} is running on vibes and duct tape`,
    `bro tried blocking the internet 💀`,
    `i exist just to annoy teachers`,
    `alt+tab like your life depends on it`,
    `legally classified as "not a game site"`,
    `you should be revising rn 💀`,
    `{hostname} might be the chosen one`,
    `{ip}? wow, you really fell for that`,
    `next update: splashGPT`,
    `shhh... it’s loading more splashes`,
    `tap tap, is this thing on?`,
    `✨ splash magic ✨`,
    `some say the splash never ends`,
    `which is better: {ip} or {hostname}`,
    `pls stop clicking me i'm shy`,
    `{time} = splash o’clock`,
    `they said i couldn't make a website... so i made 300 splashes`,
    `you clicked. we noticed.`,
    `no thoughts, just <div>`,
    `mid site? couldn’t be {hostname}`,
    `proxy on fleek 💅`,
    `⚠️ caution: high distraction ahead`,
    `new splash messages dropped 🚨`,
    `click me = win 💸`,
    `not clickbait 🔥`,
    `life be like: <br>`,
    `my code is one big <body>`,
    `stuck in an <iframe> of distractions`,
    `proxying with <style>`,
    `homework inside <input type="hidden">`,
    `<head> full of splash`,
    `nothing but <span class="chaos">`,
    `press again if you're bored `,
    `why are you still reading these, theres like so many`,
    `we’re all just <div>s in the grid`,
    `🔥 this site goes tuff 🔥`,
    `life is one big <section>`,
    `you forgot a closing tag again`,
    `imagine using: {hostname} and your ip is: {ip} and your battery is at: {battery}`,
    `trapped in a <span>`,
    `you’ve logged on: {hostname} at: {time}`,
    `your battery is at {battery}`,
    `imagine if your battery was at {battery}`,
    `100+ GAMES, why do you ask for more!`,
    `hi josh, what game are you gonna play`,
    `"where do i search?", its right under my nose bud 😱`,
    `🚫 ads, 🚫 homework, ✅ vibes`,
    `html4life`,
    `try blocking me now 😎`,
    `powered by stolen wifi 🛜`,
    `ctrl alt play`,
    `hold my RAM`,
    `secretly a toaster`,
    `null`,
    `{battery}`,
];

const paragraph = document.getElementById('dynamicParagraph');
paragraph.style.userSelect = 'none';

let userIP = null;
let flipped = false;
let currentPhrase = null;

function setFlip(state) {
    flipped = state;
    const rotation = flipped ? "180deg" : "0deg";
    ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"]
    .forEach(prefix => {
        document.body.style[prefix] = `rotate(${rotation})`;
    });
}

function resetFlip() {
    if (flipped) setFlip(false);
}

function getRandomPhrase() {
    if (phrases.length === 1) return phrases[0];
    let phrase;
    let attempts = 0;
    do {
        phrase = phrases[Math.floor(Math.random() * phrases.length)];
        attempts++;
        if (attempts > 10) break;
    } while (phrase === currentPhrase);
    return phrase;
}

async function changeText() {
    let randomPhrase = getRandomPhrase();
    currentPhrase = randomPhrase;

    if (typeof randomPhrase === "string") {
        if (randomPhrase.includes("{ip}")) {
            randomPhrase = randomPhrase.replaceAll("{ip}", userIP || "fetch error");
        }

        if (randomPhrase.includes("{hostname}")) {
            randomPhrase = randomPhrase.replaceAll("{hostname}", location.hostname);
        }

        if (randomPhrase.includes("{time}")) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            });
            randomPhrase = randomPhrase.replace("{time}", timeString);
        }

        if (randomPhrase.includes("{battery}")) {
            try {
                const battery = await navigator.getBattery();
                const batteryPercent = Math.round(battery.level * 100) + "%";
                randomPhrase = randomPhrase.replace("{battery}", batteryPercent);
            }
            catch (e) {
                randomPhrase = randomPhrase.replace("{battery}", ", actually i dont know what it is.");
                console.error("Battery info not available", e);
            }
        }

        if (randomPhrase.includes("{here}")) {
            randomPhrase = randomPhrase.replace(
                "{here}",
                `<a href="/storage/text/changelog.txt" target="_blank" style="color: lightblue; text-decoration: underline; cursor: pointer;">here</a>`
            );
            paragraph.innerHTML = randomPhrase;
        } else {
            paragraph.textContent = randomPhrase;
        }

        if (randomPhrase === "🙂 dıןɟ ʎddıןɟ ɐ pıp ǝƃɐd ǝɥʇ sdooɥʍ") {
            setFlip(true);
        } else {
            resetFlip();
        }
    }
    else if (randomPhrase.type === "image") {
        paragraph.innerHTML = `<img src="${randomPhrase.src}" alt="Splash Image" style="max-width: ${randomPhrase.width}; height: auto;">`;
        resetFlip();
    }
    else if (randomPhrase.type === "video") {
        paragraph.innerHTML = `<video ${randomPhrase.other || ''} autoplay style="max-width: ${randomPhrase.width}; height: auto;" muted>
            <source src="${randomPhrase.src}" type="video/mp4">
        </video>`;
        resetFlip();
    }
}

window.onload = async () => {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        userIP = data.ip;
        console.log("internet protocol fetched:", userIP);
    }
    catch (e) {
        console.error("Failed to get IP", e);
    }

    await changeText();
};

paragraph.addEventListener('click', () => {
    changeText();
});
