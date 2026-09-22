<template>
  <div class="container-login h-screen w-screen bg-[#081228] flex items-center justify-center">
    <div
      class="h-[100vh] w-[85vw] relative flex transition-all duration-700 ease-in-out"
      :class="direction ? 'justify-end' : 'justify-start'"
    >
      <div
        class="absolute inset-0 bg-no-repeat bg-fixed bg-[position:50%_30%] bg-[size:1440px_850px] transition-[transform] duration-600 ease-in-out"
        :style="{
          backgroundImage: 'url(src/assets/Images/Image2.png)',
          transform: direction ? '' : 'rotateY(180deg)',
        }"
      ></div>

      <div class="absolute inset-0 bg-black opacity-40"></div>
      <div
        class="h-[85%] w-[40%] m-[60px] rounded-[20px] flex items-center justify-center relative z-10 overflow-hidden animate__animated bg-white/[.30] backdrop-blur-[6px] [-webkit-backdrop-filter:blur(8px)] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_6px_3px_rgba(255,255,255,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-[linear-gradient(180deg,rgba(255,255,255,0.8),transparent,rgba(255,255,255,0.3))]"
        :class="{
          animate__backOutUp: isExiting,
          animate__backInDown: isEntering,
        }"
      >
        <div class="h-[90%] w-[85%] flex flex-col justify-between">
          <!-- Logo -->
          <div class="h-[12%] w-full flex items-center justify-center">
            <img src="/src/assets/Images/logo.png" alt="Move+" class="w-60 h-60 object-contain" />
          </div>

          <form @submit.prevent class="h-[85%] w-full flex flex-col justify-between">
            <div class="h-[65%] w-full flex flex-col gap-8">
              <div
                v-if="direction"
                class="h-[15%] w-full flex items-center justify-center gap-6 px-2"
              >
                <div class="flex-1 h-12 flex items-center bg-gray-100 rounded px-4">
                  <input
                    type="text"
                    placeholder="Noms"
                    v-model="lastName"
                    class="w-full bg-transparent focus:outline-none py-2"
                  />
                </div>
                <div class="flex-1 h-12 flex items-center bg-gray-100 rounded px-4">
                  <input
                    type="text"
                    placeholder="Prénoms"
                    v-model="firstName"
                    class="w-full bg-transparent focus:outline-none py-2"
                  />
                </div>
              </div>

              <div class="flex-1 w-full flex flex-col justify-between">
                <!-- Email -->
                <div class="h-[25%] w-full px-2 flex items-center">
                  <div class="h-12 w-full flex justify-center items-center bg-gray-100 rounded">
                    <span class="material-symbols-outlined ml-2 text-gray-400">person</span>
                    <input
                      type="email"
                      placeholder="Adresse e-mail"
                      v-model="email"
                      class="w-full bg-transparent focus:outline-none px-2"
                    />
                  </div>
                </div>

                <div class="h-[25%] w-full px-2 flex items-center">
                  <div class="h-12 w-full flex justify-center items-center bg-gray-100 rounded">
                    <span class="material-symbols-outlined ml-2 text-gray-400">lock</span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Mot de passe"
                      v-model="password"
                      class="w-full bg-transparent focus:outline-none px-2"
                    />
                    <button
                      type="button"
                      class="mr-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                      :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                      @click="showPassword = !showPassword"
                    >
                      <span class="material-symbols-outlined">
                        {{ showPassword ? 'visibility_off' : 'visibility' }}
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  v-if="!direction"
                  class="h-[15%] w-full px-2 flex items-center justify-between"
                >
                  <label class="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input type="checkbox" v-model="rememberMe" class="accent-blue-500" />
                    Se souvenir de moi
                  </label>
                  <a href="#" class="text-sm text-white hover:underline">Mot de passe oublié ?</a>
                </div>

                <div class="h-[25%] w-full px-2 flex items-center justify-center">
                  <button
                    v-if="!direction"
                    type="button"
                    @click="login"
                    class="w-full bg-[#1A67C1] hover:bg-blue-700 text-white font-bold cursor-pointer py-2 rounded transition-colors duration-200"
                  >
                    Se connecter
                  </button>
                  <button
                    v-else
                    type="button"
                    @click="register"
                    class="w-full bg-[#1A67C1] hover:bg-blue-700 text-white font-bold cursor-pointer py-2 rounded transition-colors duration-200"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>

            <div class="h-[30%] w-full flex flex-col justify-between">
              <div class="h-[20%] w-full flex items-center justify-center">
                <div class="flex items-center w-[93%]">
                  <div class="flex-grow h-px bg-gray-300"></div>
                  <span class="mx-2 text-gray-400">Ou</span>
                  <div class="flex-grow h-px bg-gray-300"></div>
                </div>
              </div>

              <div class="h-[50%] w-full flex gap-10 px-4 items-center justify-between">
                <button
                  type="button"
                  class="h-[80%] flex-1 flex items-center justify-center gap-2 bg-white cursor-pointer hover:bg-gray-300 rounded-lg py-2 shadow font-bold border border-gray-200"
                >
                  <img src="/src/assets/Images/google.svg" alt="Google" class="w-6 h-6" />
                </button>
                <button
                  type="button"
                  class="h-[80%] flex-1 flex items-center justify-center gap-2 bg-white cursor-pointer hover:bg-gray-300 rounded-lg py-2 shadow font-bold border border-gray-200"
                >
                  <img src="/src/assets/Images/facebook.svg" alt="Facebook" class="w-7 h-7" />
                </button>
              </div>

              <div class="h-[20%] w-full flex items-center justify-center">
                <span v-if="!direction" class="text-sm text-gray-800 font-bold">
                  Pas encore inscrit ?
                  <a
                    href="#"
                    @click.prevent="toggleDirection"
                    class="text-blue-900 hover:underline ml-1"
                    >Créer un compte
                  </a>
                </span>
                <span v-else class="text-sm text-gray-800 font-bold">
                  Déjà inscrit ?

                  <a
                    href="#"
                    @click.prevent="toggleDirection"
                    class="text-blue-900 hover:underline ml-1"
                    >Se connecter
                  </a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'animate.css'

export default {
  name: 'LogIn',
  data() {
    return {
      direction: true,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      showPassword: false,
      rememberMe: false,
      isExiting: false, // 👈 Animation de sortie
      isEntering: false, // 👈 Animation d'entrée
    }
  },
  methods: {
    toggleDirection() {
      // 1️⃣ Lance l'animation de SORTIE
      this.isExiting = true
      this.isEntering = false

      setTimeout(() => {
        // 2️⃣ Après 600ms (durée backOutUp) → change le formulaire
        this.isExiting = false
        this.direction = !this.direction

        // 3️⃣ Lance l'animation d'ENTRÉE
        this.isEntering = true

        setTimeout(() => {
          // 4️⃣ Nettoie après la fin de backInDown
          this.isEntering = false
        }, 800)
      }, 600)
    },
    getAuthErrorMessage(error, defaultMessage) {
      if (error.response) {
        const { status, data } = error.response
        const serverMessage = data?.message

        switch (status) {
          case 400:
            return serverMessage === 'Access denied.'
              ? 'Email ou mot de passe incorrect.'
              : serverMessage || defaultMessage
          case 401:
            return 'Session expirée. Veuillez vous reconnecter.'
          case 403:
            return "Accès refusé. Vous n'avez pas les droits nécessaires."
          case 404:
            return 'Compte inexistant. Vérifiez vos identifiants.'
          case 500:
            return 'Erreur interne du serveur. Veuillez réessayer plus tard.'
          default:
            return serverMessage || 'Une erreur inattendue est survenue.'
        }
      }

      if (error.request) {
        return 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
      }

      return defaultMessage
    },
    async login() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/auth/signin`,
          {
            email: this.email,
            password: this.password,
          },
        )
        // console.log('Login successful:', response.data)
        // Sauvegarder les tokens dans le localStorage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)

        // this.$refs.signupComponent.spotReverse();
        // Redirection après connexion
        this.$notify.success('Connexion réussie', 'Bienvenue sur Move+')
        this.$router.push({ name: 'Layout' })
        
      } catch (error) {
        this.$notify.error(
          'Erreur de connexion',
          this.getAuthErrorMessage(
            error,
            'Vérifiez votre adresse e-mail et votre mot de passe.',
          ),
          { duration: 3000 },
        )
      }
    },
    async register() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/admin`, {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          roles: ['admin'],
        })
        this.$notify.success('Inscription réussie', 'Votre compte a été créé.')
      } catch (error) {
        this.$notify.error(
          "Erreur d'inscription",
          this.getAuthErrorMessage(error, 'Impossible de créer votre compte pour le moment.'),
          { duration: 3000 },
        )
      }
    },
  },
}
</script>
