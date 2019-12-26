<template>
    <div class="knocker">
        <br/>
        <span class="connection-info" :v-model="connectionInfo"></span>
        <br/>

        <md-button class="md-raised knock-button" :disabled="!canKnock">
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
    .knocker{
        width:100%;
        height: 100%;
    }

    .knock-button{
        width: 150px;
        height: 150px;
        background-color: #D6D7D7;
    }

    .knock-button-image{
        width: 128px;
        height: 128px;
    }

    .knock-message{
        float:bottom;
    }
</style>

<script>

    export  default {
        name:"Knocker",
        data:()=>({
            loading: true,
            connectionInfo:"",
            canKnock: false,
            message: "Someone Wants Your Attention!"
        }),
        methods:{
            img(img){
                return require("../assets/" + img);
            },
            testConnection(){
                //TODO
            },
            triggerKnock(){
                //TODO
            }
        }
    }
</script>
