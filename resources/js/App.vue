<template>
    <div>
        <div v-if="isLoading"
             class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <i class="fa-solid fa-hand-fist fa-bounce fa-10x" style="color: #000000;"></i>
        </div>
        <header class="bg-black">
            <div class="flex">
                <router-link :to="{name: 'main'}" class="bg-yellow-400 py-2 px-4 rounded">Logo</router-link>
                <div class="flex-1">
                    <div class="flex justify-end">
                        <template v-if="isAuth">
                            <router-link :to="{name: 'workouts'}" class="bg-yellow-400 py-2 px-4 rounded">
                                Тренировки
                            </router-link>
                            <button class="bg-yellow-400 py-2 px-4 rounded">{{ user.login }}</button>
                            <button class="bg-yellow-400 py-2 px-4 rounded" @click="logout">Выйти</button>
                        </template>
                        <template v-else>
                            <button class="bg-yellow-400 py-2 px-4 rounded" @click="isShowLogin = true">Войти
                            </button>
                            <button class="bg-yellow-400 py-2 px-4 rounded" @click="isShowRegister = true">
                                Регистрация
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </header>
        <div>
            <router-view></router-view>
        </div>
        <div v-if="isShowLogin" class="fixed inset-0 flex items-center justify-center">
            <div class="modal-bg absolute inset-0 bg-black opacity-50"></div>
            <div class="modal-content w-[500px] bg-white p-4 rounded-lg relative">
                <button @click="closeLogin"
                        class="absolute top-0 right-0 p-2 cursor-pointer text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"/>
                    </svg>
                </button>
                <h1 class="text-2xl font-semibold">Вход</h1>
                <form @submit.prevent="loginHandler" class="mt-4">
                    <div class="mb-4">
                        <label for="login" class="block font-medium text-gray-700">Логин</label>
                        <input v-model="loginForm.login" type="text" id="login" name="login"
                               class="w-full p-2 border rounded-lg">
                        <div class="text-red-600 mt-1">
                            <div v-for="message in validationErrors?.login">
                                {{ message }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block font-medium text-gray-700">Пароль</label>
                        <input v-model="loginForm.password" type="password" id="password" name="password"
                               class="w-full p-2 border rounded-lg">
                        <div class="text-red-600 mt-1">
                            <div v-for="message in validationErrors?.password">
                                {{ message }}
                            </div>
                        </div>
                    </div>
                    <button class="bg-yellow-400 py-2 px-4 rounded">Ок</button>
                </form>
            </div>
        </div>

        <div v-if="isShowRegister" class="fixed inset-0 flex items-center justify-center">
            <div class="modal-bg absolute inset-0 bg-black opacity-50"></div>
            <div class="modal-content w-[500px] bg-white p-4 rounded-lg relative">
                <button @click="closeRegister"
                        class="absolute top-0 right-0 p-2 cursor-pointer text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"/>
                    </svg>
                </button>
                <h1 class="text-2xl font-semibold">Регистрация</h1>
                <form @submit.prevent="registerHandler" class="mt-4">
                    <div class="mb-4">
                        <label for="login" class="block font-medium text-gray-700">Логин</label>
                        <input v-model="registerForm.login" type="text" id="login" name="login"
                               class="w-full p-2 border rounded-lg">
                        <div class="text-red-600 mt-1">
                            <div v-for="message in validationErrors?.login">
                                {{ message }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block font-medium text-gray-700">Пароль</label>
                        <input v-model="registerForm.password" type="password" id="password" name="password"
                               class="w-full p-2 border rounded-lg">
                        <div class="text-red-600 mt-1">
                            <div v-for="message in validationErrors?.password">
                                {{ message }}
                            </div>
                        </div>
                    </div>
                    <button class="bg-yellow-400 py-2 px-4 rounded">Ок</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import useAuth from '@/composables/auth';

import {ref, onBeforeMount} from "vue";
import useWorkout from "@/composables/workout.js";

const {
    workouts,
    getVoices,
    getWorkouts
} = useWorkout();

const {
    user,
    isAuth,
    isShowRegister,
    isShowLogin,
    loginForm,
    registerForm,
    validationErrors,
    getUser,
    registration,
    submitLogin,
    logout,
    closeLogin,
    closeRegister
} = useAuth(getWorkouts);

const isLoading = ref(true);

const loginHandler = async () => {
    isLoading.value = true;
    await submitLogin();
    isLoading.value = false;
}

const registerHandler = async () => {
    isLoading.value = true;
    await registration();
    isLoading.value = false;
}

onBeforeMount(async () => {
    await getUser();
    await getVoices();
    await new Promise(resolve => setTimeout(resolve, 1000));
    isLoading.value = false;
});

</script>
