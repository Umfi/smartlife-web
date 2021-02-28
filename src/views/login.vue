<template>
    <div id="login" class="card">
        <div class="card-content">
            <h1 class="center">Login</h1>
        
            <div class="row">
                <div class="input-field col s12">
                    <input id="username" type="text" v-model="input.username" class="validate">
                    <label for="username">Username</label>
                </div>
            </div>

            <div class="row">
                <div class="input-field col s12">
                    <input id="password" type="password" v-model="input.password" class="validate">
                    <label for="password">Password</label>
                </div>
            </div>
            
            <div class="row">
                <div class="input-field col s12">
                    <select v-model="input.region">
                    <option value="" disabled selected>Choose your option</option>
                    <option value="44">EU</option>
                    <option value="1">US</option>
                    <option value="86">CN</option>
                    </select>
                    <label>Region</label>
                </div>
            </div>
            
            <button class="btn waves-effect waves-light light-blue accent-4" type="button" v-on:click="login()">Login
                <i class="material-icons right">send</i>
            </button>
        </div>
    </div>
</template>

<script>

import { login } from "../service/AuthService.js";
import M from 'materialize-css'

    export default {
        name: 'Login',
        data() {
            return {
                input: {
                    username: "",
                    password: "",
                    region: ""
                }
            }
        },
        mounted() {
            var elems = document.querySelectorAll('select');
            M.FormSelect.init(elems);
        },
        methods: {
            async login() {
                if(this.input.username != "" && this.input.password != "" && this.input.region != "") {
                    const loginWasSuccessful = await login({
                        "userName": this.input.username,
                        "password": this.input.password,
                        "countryCode": this.input.region, 
                        "bizType": "smart_life",
                        "from": "tuya",
                    })

                    if (loginWasSuccessful) {
                        this.$parent.authenticated = true;
                        this.$router.push({ path: "/dashboard" });
                    } else {
                        M.toast({html: 'The username and / or password is incorrect!'});
                        localStorage.setItem("authenticated", false);
                    }
                } else {
                    M.toast({html: 'A username and password must be present!'});
                    localStorage.setItem("authenticated", false);
                }
            }
        }
    }
</script>

<style scoped>

</style>