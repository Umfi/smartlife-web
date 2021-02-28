import Vue from 'vue'
import Router from 'vue-router'
import LoginComponent from "../views/login.vue"
import DashboardComponent from "../views/dashboard.vue"

import { isLoggedIn } from "../service/AuthService.js";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: "login"
            }
        },
        {
            path: "/login",
            name: "login",
            component: LoginComponent,
            beforeEnter: (to, from, next) => {
                const loggedIn = isLoggedIn();
                if (loggedIn) 
                    next({ name: 'dashboard' })
                else
                    next()
            }
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: DashboardComponent,
            beforeEnter: (to, from, next) => {
                const loggedIn = isLoggedIn();
                if (loggedIn) 
                    next()
                else
                    next({ name: 'login' })
            }
        }
    ]
})

export default router