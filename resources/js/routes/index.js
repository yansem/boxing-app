import { createRouter, createWebHistory } from "vue-router";
import Workouts from "@/Workouts.vue";
import Main from "@/Main.vue";


function auth(to, from, next) {
    if (JSON.parse(localStorage.getItem('loggedIn'))) {
        next()
    }
}

const routes = [
    {
        path: '/',
        children: [
            {
                path: '',
                name: 'main',
                component: Main
            },
            {
                path: '/workouts',
                beforeEnter: auth,
                name: 'workouts',
                component: Workouts
            },
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
