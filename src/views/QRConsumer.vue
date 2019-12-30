<template>
    <div>
        <p>{{ $route.params.host }}/{{ $route.params.code }}</p>
        <p>{{ $route.query.cm }}</p>
    </div>
</template>

<script>
    export default{
        methods:{
            updateConnectionInfo(){
                if (this.$route.params.host && this.$route.params.code) {
                    localStorage.host = this.$route.params.host;
                    localStorage.code =this.$route.params.code;
                    if (this.$route.query.cm) {
                        localStorage.connectionMethod = this.$route.query.cm.toUpperCase();
                    }

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
