<template>
    <div class="page-container" id="app">
        <md-app>
            <md-app-toolbar class="md-primary">
                <span class="md-title">VRKnock</span>
            </md-app-toolbar>
            <md-app-content>
                <router-view @snackbar="showSnackbar" @alert="showAlert"/>

                <md-snackbar md-position="center" :md-duration="2000" :md-active.sync="snackbarVisible" md-persistent>
                    <span>{{ snackbarMessage }}</span>
                </md-snackbar>
                <md-dialog-alert
                        :md-active.sync="alertVisible"
                        :md-title="alertTitle || 'Alert'"
                        :md-content="alertMessage"
                        :md-confirm-text="alertConfirmText || 'Okay!'" />
            </md-app-content>
        </md-app>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
    @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
    @import '~vue-material/dist/vue-material.min.css';
    @import "~vue-material/dist/theme/default.css";

    html,body,.md-app,.page-container{
        height:100%;
    }


    #app {
        /*font-family: 'Roboto', Helvetica, Arial, sans-serif;*/
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        /*color: #2c3e50;*/
    }

    /*#nav {*/
    /*    padding: 30px;*/
    /*}*/

    /*#nav a {*/
    /*    font-weight: bold;*/
    /*    color: #2c3e50;*/
    /*}*/

    /*#nav a.router-link-exact-active {*/
    /*    color: #42b983;*/
    /*}*/
</style>
<style lang="scss">
    @import "~vue-material/dist/theme/engine";

    @include md-register-theme(
                    "default",
                    (
                            primary: #790FBF,
                            accent: #637300,
                            theme: light
                    )
    );

    @import "~vue-material/dist/base/theme";
    @import "~vue-material/dist/theme/all";
</style>
<script>
    export default {
        data:()=>({
            snackbarVisible: false,
            snackbarMessage: '',
            alertVisible: false,
            alertTitle: '',
            alertMessage: '',
            alertConfirmText: 'Okay!'
        }),
        methods:{
            showSnackbar(msg){
                this.snackbarMessage = msg;
                this.snackbarVisible = true;
            },
            showAlert(msgOrOptions){
                window.console.log("showAlert");
                window.console.log(msgOrOptions)
                if (typeof msgOrOptions === "string") {
                    this.alertMessage=msgOrOptions;
                }else{
                    this.alertTitle=msgOrOptions.title||'Alert!';
                    this.alertMessage=msgOrOptions.msg||msgOrOptions.message||"";
                    this.alertConfirmText = msgOrOptions.confirm||"Okay!"
                }
                this.alertVisible = true;
            }
        }
    }
</script>

