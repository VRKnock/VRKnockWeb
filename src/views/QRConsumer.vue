<template>
    <p>{{ $route.params.host }}/{{ $route.params.code }}</p>
</template>

<script>
    export default{
        methods:{
            updateConnectionInfo(){
                if (this.$route.params.host && this.$route.params.code) {
                    localStorage.host = this.$route.host;
                    localStorage.code =this.$route.code;

                    this.$emit("snackbar","Connection Info Updated!");
                    this.$nextTick(function () {
                        this.$router.push("/");
                    });
                }
            }
        },
        mounted() {
            this.updateConnectionInfo();
        }
    }
</script>
