import {reactive, ref} from "vue";
import {useRouter} from "vue-router";

const isAuth = ref(false);
const isShowRegister = ref(false);
const isShowLogin = ref(false);
const registerForm = reactive({
    login: '',
    password: ''
});
const loginForm = reactive({
    login: '',
    password: ''
});
const user = reactive({
    login: ''
})

export default function useAuth(getWorkouts) {
    const router = useRouter();
    const registration = async () => {
        isShowRegister.value = false;
        await axios.post('/register', registerForm)
            .then(response => {
                loginUser(response);
            })
            .catch(error => {
                isShowRegister.value = true;
                console.log(error);
            })
    }

    const submitLogin = async () => {
        isShowLogin.value = false;
        await axios.get('/sanctum/csrf-cookie').then(async response => {
            await axios.post('/login', loginForm)
                .then(async response => {
                    await loginUser(response)
                })
                .catch(error => {
                    isShowLogin.value = true;
                    console.log(error);
                })
        });
    }

    const loginUser = async (response) => {
        user.login = response.data.login
        isAuth.value = true
        await getWorkouts();
        localStorage.setItem('loggedIn', JSON.stringify(true))
    }

    const getUser = async () => {
        await axios.get('/api/user')
            .then(async response => {
                await loginUser(response)
            })
            .catch(error => {

            })
    }

    const logout = async () => {
        await axios.post('/logout')
            .then(async response => {
                await router.push({name: 'main'});
                isAuth.value = false;
            })
    }

    return {
        user,
        getUser,
        isAuth,
        isShowLogin,
        isShowRegister,
        loginForm,
        registerForm,
        registration,
        submitLogin,
        logout
    }
}