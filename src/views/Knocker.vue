<template>
    <div class="knocker">
        <span class="connection-info" :v-model="connectionInfo"></span>

        <md-button class="md-raised knock-button" :disabled="!canKnock">
            <img :src="canKnock ? img('knocking_hand.svg') : img('knocking_hand_gray.svg')" class="knock-button-image">
        </md-button>
    </div>
</template>

<style scoped>
    .knock-button{
        width: 150px;
        height: 150px;
        background-color: #D6D7D7;
    }

    .knock-button-image{
        width: 128px;
        height: 128px;
    }
</style>

<script>

    export  default {
        name:"Knocker",
        data:()=>({
            connectionInfo:"",
            canKnock: false
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
