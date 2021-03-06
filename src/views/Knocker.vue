<template>
    <div class="knocker">
        <br/>
        <span class="connection-info">{{ statusText }}</span>
        <br/>
        <span class="game-activity">{{ gameActivity }}</span>
        <br/>

        <md-button class="md-raised knock-button" :disabled="!canKnock" @click="triggerKnock()">
            <img :src="canKnock ? img('knocking_hand.svg') : img('knocking_hand_gray.svg')" class="knock-button-image">
        </md-button>

        <br/>
        <br/>

        <div id="gplay-button">
            <a href='https://play.google.com/store/apps/details?id=org.inventivetalent.vrknock&utm_source=VRKnockWeb&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>
            <br/>
            <span id="gplay-attribution">Google Play and the Google Play logo are trademarks of Google LLC.</span>
        </div>

        <br/>
        <br/>

        <md-field class="knock-message">
            <label for="message">Message</label>
            <md-input name="message" id="message" v-model="message"></md-input>
        </md-field>
    </div>
</template>

<style scoped>
    .knocker {
        width: 100%;
        height: 100%;
    }

    .knock-button {
        width: 150px;
        height: 150px;
        background-color: #D6D7D7;
    }

    .knock-button-image {
        width: 128px;
        height: 128px;
    }

    .knock-message {
        float: bottom;
    }

    #gplay-button img {
        padding-left: 2em;
        padding-right: 2em;
    }
</style>

<script>
    import { v4 as uuid } from "node-uuid";

    const CLOSED = 0;
    const OPENING = 1;
    const OPEN = 2;
    const REGISTERING = 3;
    const REGISTERED = 4;

    const OUTDATED_CLIENT = -1;
    const SAME = 0;
    const OUTDATED_SERVER = 1;

    export default {
        name: "Knocker",
        data: () => ({
            host: '',
            code: '',
            clientId: '',
            port: 16945,
            connectionMethod: "DIRECT",
            statusText: "",
            gameActivity: "",
            canKnock: false,
            message: "Someone Wants Your Attention!",
            currentRequestResolve: null,
            socket: null,
            socketState: CLOSED
        }),
        methods: {
            img(img) {
                return require("../assets/" + img);
            },
            reconnect() {
                this.canKnock = false;
                this.statusText = "Searching Host...";

                if (!this.host || !this.code || "undefined" === this.host || "undefined" === this.code) {
                    this.$router.push("/settings");
                    return;
                }

                this.socketState = CLOSED;
                this.testConnection();
            },
            onConnectionEstablished() {
                this.canKnock = true;

                this.statusText = "Connected!";
            },
            onConnectionLost(reason) {
                if (!reason) {
                    reason = "Failed to connect";
                }

                this.canKnock = false;
                this.socketState = CLOSED;

                this.statusText = reason;
                this.updateActivity(null);
            },
            updateActivity(activity) {
                if (!activity || activity.length === 0 || "null" === activity) {
                    this.gameActivity = "";
                } else if ("idle" === activity || "Idle" === activity) {
                    this.gameActivity = "Currently Idle";
                } else {
                    this.gameActivity = "Currently Playing " + activity;
                }
            },
            checkStatus() {
                let body = {
                    action: "status",
                    code: this.code,
                    version: "web",
                    platform: "web"
                };
                this.sendRequest(body).then(json => {
                    if (json) {
                        let msg = json["msg"];
                        let game = json["game"];

                        this.$emit("snackbar", msg);
                        this.updateActivity(game);

                        this.checkVersion(json["version"]);

                        if (json["status"] !== 0) {
                            this.onConnectionLost();
                        } else {
                            this.onConnectionEstablished();
                        }
                    } else {
                        this.onConnectionLost();
                    }
                })
            },
            testConnection() {
                this.$emit("snackbar", "Connecting...");

                // socket = io("ws://" + this.host + ":" + this.port,{
                //     path:"/",
                //     transports: ['websocket']
                // });
                this.socketState = OPENING;
                if (this.connectionMethod === "DIRECT") {
                    //TODO: prevent direct connection when running on web
                    this.socket = new WebSocket("ws://" + this.host + ":" + this.port);
                } else if (this.connectionMethod === "BRIDGE") {
                    this.socket = new WebSocket("wss://bridge.vrknock.app");
                }

                // // https://stackoverflow.com/questions/10405070/socket-io-client-respond-to-all-events-with-one-handler/33960032#33960032
                // var onevent = socket.onevent;
                // socket.onevent = function (packet) {
                //     var args = packet.data || [];
                //     onevent.call (this, packet);    // original call
                //     packet.data = ["*"].concat(args);
                //     onevent.call(this, packet);      // additional call to catch-all
                // };
                // ///

                this.socket.onopen = () => {
                    window.console.log("Socket connected");
                    this.socketState = OPEN;

                    if (this.connectionMethod === "BRIDGE") {
                        this.socketState = REGISTERING;
                        this.socket.send(JSON.stringify({_type: "register", payload: {type: "client", clientId: this.clientId}}));
                    } else {
                        this.checkStatus();
                    }
                };

                this.socket.onclose = (err) => {
                    window.console.warn(err);
                    this.onConnectionLost("Server Closed Connection");
                    this.socketState = CLOSED;
                }

                this.socket.onerror = (err) => {
                    window.console.warn(err);
                    this.onConnectionLost("Socket Connection Error");
                    this.socketState = CLOSED;
                };
                // socket.on("connect_timeout",()=>{
                //     this.onConnectionLost("Socket Connection Timeout");
                // });
                // socket.on('disconnect', (reason) => {
                //     if (reason === 'io server disconnect') {
                //        this.onConnectionLost("Connection closed by server");
                //     }
                //     // else the socket will automatically try to reconnect
                // });

                this.socket.onmessage = (event) => {
                    window.console.log(event.data);
                    let parsed = JSON.parse(event.data);
                    window.console.log(parsed);

                    if (parsed.hasOwnProperty("_state")) {
                        let state = parsed["_state"];
                        window.console.log("State: " + state);
                        if (this.connectionMethod === "BRIDGE") {
                            if ("REGISTERED" === state) {
                                this.socketState = REGISTERED;
                                this.checkStatus();
                            }
                            if ("DISCONNECT" === state) {
                                this.onConnectionLost("Server Closed Connection");
                            }
                        }
                    }


                    if (parsed && parsed.hasOwnProperty("evt") && parsed.evt === "status" && this.currentRequestResolve) {
                        this.currentRequestResolve(parsed);
                        this.currentRequestResolve = null;
                    }
                }

            },
            triggerKnock() {
                if (!this.canKnock) {
                    return;
                }

                this.canKnock = false;

                let body = {
                    action: "triggerKnock",
                    code: this.code,
                    message: this.message,
                    version: "web",
                    platform: "web"
                };
                this.sendRequest(body).then(json => {
                    window.console.log(json);
                    if (json) {

                        let msg = json["msg"];
                        let game = json["game"];

                        this.$emit("snackbar", msg);
                        this.updateActivity(game);

                        this.checkVersion(json["version"]);

                        if (json["status"] !== 0) {
                            this.onConnectionLost();
                        } else {
                            setTimeout(() => {
                                this.canKnock = true;
                            }, 2000);
                        }
                    } else {
                        this.onConnectionLost();
                    }
                })
            },
            sendRequest(body) {
                return new Promise(resolve => {
                    if (!this.socket) {
                        resolve(null);
                        return;
                    }
                    this.currentRequestResolve = resolve;

                    if (this.connectionMethod === "BRIDGE") {
                        let payload = body;
                        body = {
                            _type: "forward",
                            source: this.clientId,
                            target: this.host,
                            payload: payload
                        };
                    }

                    this.socket.send(JSON.stringify(body));
                });
            }
        },
        parseVersionString(str) {
            let split = str.split("\\.");
            let ints = [];
            for (let i = 0; i < split.length; i++) {
                ints[i] = parseInt(split[i]);
            }
            return ints;
        },
        compareVersions(client, server) {
            window.console.log("Client Version: " + client + ", Server Version: " + server);
            if (!client || !server || client.length === 0 || server.length === 0) return;
            let c = this.parseVersionString(client);
            let s = this.parseVersionString(server);
            // Major
            if (c[0] < s[0]) {
                return OUTDATED_CLIENT;
            } else if (s[0] < c[0]) {
                return OUTDATED_SERVER;
            } else {
                // Minor
                if (c[1] < s[1]) {
                    return OUTDATED_CLIENT;
                } else if (s[1] < c[1]) {
                    return OUTDATED_SERVER;
                }
            }
            return SAME;
        },
        checkVersion(serverVersion){
            let v = this.compareVersions(process.env.PACKAGE_VERSION, serverVersion);
            if (v === OUTDATED_SERVER) {
                this.$emit("alert", "The Server Version is Outdated! Please Install the Latest Version.");
            }else if (v === OUTDATED_CLIENT) {
                this.$emit("alert", "The App Version is Outdated! Please Install an Older Server Version.")
            }
        },
        mounted() {
            window.console.log(process.env.PACKAGE_VERSION || "0.0.0");

            if (localStorage.host) {
                this.host = localStorage.host;
            }
            if (localStorage.code) {
                this.code = localStorage.code;
            }
            if (localStorage.clientId) {
                this.clientId = localStorage.clientId;
            }
            if (localStorage.connectionMethod) {
                this.connectionMethod = localStorage.connectionMethod;
            }


            if (!this.clientId) {
                this.clientId = uuid() + "";
                localStorage.clientId = this.clientId;
            }
            window.console.log("ClientId: " + this.clientId)

            if (this.connectionMethod === "DIRECT") {
                window.console.warn("DIRECT connection not supported in web app!");
                this.$emit("alert", "DIRECT connection cannot be used in the web app!<br/>Please change to BRIDGE connection in the server application.");
            } else {
                this.reconnect();
            }
        }
    }
</script>
