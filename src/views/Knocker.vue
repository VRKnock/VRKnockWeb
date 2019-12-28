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
</style>

<script>
    import {v4 as uuid} from "node-uuid";

    export default {
        name: "Knocker",
        data: () => ({
            host: '',
            code: '',
            clientId: '',
            port: 16945,
            statusText: "",
            gameActivity: "",
            canKnock: false,
            message: "Someone Wants Your Attention!",
            currentRequestResolve: null,
            socket: null
        }),
        methods: {
            img(img) {
                return require("../assets/" + img);
            },
            reconnect() {
                this.canKnock = false;
                this.statusText = "Searching Host...";

                if (!this.host || !this.code) {
                    this.$router.push("/settings");
                    return;
                }

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

                this.statusText = reason;
                this.updateActivity(null);
            },
            updateActivity(activity) {
                if (!activity || activity.length === 0 || "null" === activity) {
                    this.gameActivity = "";
                } else if ("idle" === activity||"Idle"===activity) {
                    this.gameActivity = "Currently Idle";
                } else {
                    this.gameActivity = "Currently Playing " + activity;
                }
            },
            testConnection() {
                this.$emit("snackbar", "Connecting...");

                // socket = io("ws://" + this.host + ":" + this.port,{
                //     path:"/",
                //     transports: ['websocket']
                // });
                this.socket = new WebSocket("ws://" + this.host + ":" + this.port);

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

                    let body = {
                        action: "status",
                        code: this.code,
                        version: "web"
                    };
                    this.sendRequest(body).then(json => {
                        if (json) {
                            let msg = json["msg"];
                            let game = json["game"];

                            this.$emit("snackbar", msg);
                            this.updateActivity(game);

                            if (json["status"] !== 0) {
                                this.onConnectionLost();
                            } else {
                                this.onConnectionEstablished();
                            }
                        } else {
                            this.onConnectionLost();
                        }
                    })
                };

                this.socket.onclose = (err)=>{
                    window.console.warn(err);
                    this.onConnectionLost("Server Closed Connection")
                }

                this.socket.onerror = (err) => {
                    window.console.warn(err);
                    this.onConnectionLost("Socket Connection Error");
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
                    version: "web"
                };
                this.sendRequest(body).then(json => {
                    window.console.log(json);
                    if (json) {

                        let msg = json["msg"];
                        let game = json["game"];

                        this.$emit("snackbar", msg);
                        this.updateActivity(game);

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

                    this.socket.send(JSON.stringify(body));
                });
            }
        },
        mounted() {
            if (localStorage.host) {
                this.host = localStorage.host;
            }
            if (localStorage.code) {
                this.code = localStorage.code;
            }
            if (localStorage.clientId) {
                this.clientId = localStorage.clientId;
            }

            if (!this.clientId) {
                this.clientId = uuid() + "";
                localStorage.clientId = this.clientId;
            }
            window.console.log("ClientId: "+this.clientId)

            this.reconnect();
        }
    }
</script>
