<template>
 <div id="app">
     <nav class="light-blue accent-4" role="navigation">
        <div class="nav-wrapper container"><a id="logo-container" href="#" class="brand-logo">Smartlife-Web</a>
        <ul class="right hide-on-med-and-down">
            <li> <router-link v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link></li>
            <li> <router-link v-if="!authenticated" to="/login" replace>Login</router-link></li>
        </ul>

        <ul id="nav-mobile" class="sidenav">
            <li> <router-link v-if="authenticated" to="/login" v-on:click.native="logout()" replace>Logout</router-link></li>
            <li> <router-link v-if="!authenticated" to="/login" replace>Login</router-link></li>
        </ul>
        <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        </div>
    </nav>
    <div class="container">
        <router-view/>
    </div>
  </div>
</template>

<script>

import { isLoggedIn, logout } from "./service/AuthService.js";
import M from 'materialize-css'

export default {
  name: 'Smartlife-Web',
  data() {
      return {
          authenticated: false,
          mockAccount: {
              username: "umfi",
              password: "umfi"
          }
      }
  },
  mounted() {
      M.AutoInit();

      const loggedIn = isLoggedIn();
      if (loggedIn) {
         this.authenticated = true;
       } else {
         this.authenticated = false;
         this.$router.replace({ name: "login" });
       } 
  },
  methods: {
      logout() {
          logout();
          this.authenticated = false;
          this.$router.push({ path: "/login" });
      }
  }
}
</script>

<style>

</style>
