<template>
    <div class="page-container" id="app">
        <md-app>
            <md-app-toolbar class="md-primary">
                <span class="md-title">VRKnock</span>
            </md-app-toolbar>
            <md-app-content>
                <router-view @snackbar="showSnackbar"/>

                <md-snackbar md-position="center" :md-duration="2000" :md-active.sync="snackbarVisible" md-persistent>
                    <span>{{ snackbarMessage }}</span>
                </md-snackbar>
            </md-app-content>
        </md-app>
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
    @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
    @import '~vue-material/dist/vue-material.min.css';
    @import "~vue-material/dist/theme/default.css";

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
            snackbarMessage: ''
        }),
        methods:{
            showSnackbar(msg){
                this.snackbarMessage = msg;
                this.snackbarVisible = true;
            }
        }
    }
</script>

