import { createRouter, createWebHistory } from "vue-router";
import Workouts from "@/pages/Workouts/Workouts.vue";
import Main from "@/Main.vue";
import Create from "@/pages/Workouts/Create.vue";
import Show from "@/pages/Workouts/Show.vue";


function auth(to, from, next) {
    if (JSON.parse(localStorage.getItem('loggedIn'))) {
        next()
    } else {
        next({name: 'main'})
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
                path: 'workouts',
                component: Workouts,
                name: 'workouts',
                beforeEnter: auth,
                children: [
                    {
                        path: ':id',
                        name: 'workouts.show',
                        component: Show
                    },
                    {
                        path: 'create',
                        name: 'workouts.create',
                        component: Create
                    }
                ],
            },
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
