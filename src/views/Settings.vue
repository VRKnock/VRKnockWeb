<template>
    <div class="settings">
        <h1>Settings</h1>

        <md-field>
            <label for="host">Host</label>
            <md-input name="host" id="host" v-model="host"></md-input>
        </md-field>
        <md-field>
            <label for="code">Code</label>
            <md-input name="code" id="code" v-model="code"></md-input>
        </md-field>

        <md-button @click="save()" class="md-raised">Save</md-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                host: '',
                code: ''
            }
        },
        mounted() {
            if (localStorage.host) {
                this.host = localStorage.host;
            }
            if (localStorage.code) {
                this.code = localStorage.code;
            }
        },
        methods: {
            save() {
                localStorage.host = this.host;
                localStorage.code = this.code;

                this.$emit("snackbar","Connection Info Updated!")
                this.$nextTick(function () {
                    this.$router.push("/");
                });
            }
        }
    }
</script>
