<template>
    <div class="knocker">
        <br/>
        <span class="connection-info" :v-model="statusText"></span>
        <br/>
        <span class="game-activity" :v-model="gameActivity"></span>
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
    import axios from "axios";

    export default {
        name: "Knocker",
        data: () => ({
            host: '',
            code: '',
            port: 16945,
            statusText: "",
            gameActivity: "",
            canKnock: false,
            message: "Someone Wants Your Attention!"
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

            },
            onConnectionLost(reason) {
                if (!reason) {
                    reason = "Failed to connect";
                }

                this.canKnock = false;

                this.statusText = reason;
            },
            updateActivity(activity) {
                if (!activity || activity.length === 0 || "null" === activity) {
                    this.gameActivity = "";
                } else if ("idle" === activity) {
                    this.gameActivity = "Currently Idle";
                } else {
                    this.gameActivity = "Currently Playing " + activity;
                }
            },
            testConnection() {
                this.$emit("snackbar", "Connecting...");

                let body = {
                    code: this.code,
                    version: "web"
                };
                this.postJson(this.host, this.port, "status", body).then(json => {
                    if (json) {
                        let status = json["Status"];

                        let msg = status["msg"];
                        let game = status["game"];

                        this.$emit("snackbar", msg);
                        this.updateActivity(game);

                        if (status["status"] !== 0) {
                            this.onConnectionLost();
                        } else {
                            this.onConnectionEstablished();
                        }
                    }else {
                        this.onConnectionLost();
                    }
                })
            },
            triggerKnock() {
                if (!this.canKnock) {
                    return;
                }

                this.canKnock = false;

                let body = {
                    code: this.code,
                    message:this.message,
                    version:"web"
                };
                this.postJson(this.host, this.port, "status", body).then(json => {
                    if (json) {
                        let status = json["Status"];

                        let msg = status["msg"];
                        let game = status["game"];

                        this.$emit("snackbar", msg);
                        this.updateActivity(game);

                        if (status["status"] !== 0) {
                            this.onConnectionLost();
                        } else {
                            setTimeout(() => {
                                this.canKnock = true;
                            }, 2000);
                        }
                    }else {
                        this.onConnectionLost();
                    }
                })
            },
            postJson(host, port, path, body) {
                return axios({
                    method: "post",
                    baseURL: "http://" + host + ":" + port + "/",
                    url: path,
                    data: body,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'VRKnockWeb'
                    }
                })
            }
        },
        mounted() {
            if (localStorage.host) {
                this.host = localStorage.host;
            }
            if (localStorage.code) {
                this.code = localStorage.code;
            }

            this.reconnect();
        }
    }
</script>
