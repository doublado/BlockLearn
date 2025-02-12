<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { NCard, NTabs, NTabPane, NForm, NFormItemRow, NInput, NButton } from 'naive-ui'
  import { useUserStore } from '~/stores/user'

  const router = useRouter()
  const route = useRoute()
  const activeTab = ref(route.query.tab || 'signin')

  const userStore = useUserStore()

  const signInData = reactive({
    identifier: '',
    password: ''
  })

  const signUpData = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const updateTabInRoute = (tabName: string) => {
    router.replace({ query: { ...route.query, tab: tabName } })
  }

  const handleSignIn = async () => {
    try {
      const response = await $fetch('/api/auth/signin', {
        method: 'POST',
        body: {
          identifier: signInData.identifier,
          password: signInData.password
        }
      })
      if (response.success) {
        userStore.setUser(response.user)
        userStore.setLevels(response.levels)
        userStore.setLevelProgress(response.levelProgress)
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error(error)
      alert(error.data?.statusMessage || 'Log ind mislykkedes.')
    }
  }

  const handleSignUp = async () => {
    try {
      const signupResponse = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: {
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
          confirmPassword: signUpData.confirmPassword
        }
      })
      if (signupResponse.success) {
        // Set levels from the signup response
        userStore.setLevels(signupResponse.levels)
        // Automatically sign in after successful signup
        const signinResponse = await $fetch('/api/auth/signin', {
          method: 'POST',
          body: {
            identifier: signUpData.username,
            password: signUpData.password
          }
        })
        if (signinResponse.success) {
          userStore.setUser(signinResponse.user)
          userStore.setLevels(signinResponse.levels)
          userStore.setLevelProgress(signinResponse.levelProgress)
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      console.error(error)
      alert(error.data?.statusMessage || 'Oprettelse af konto mislykkedes.')
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-58.57px)]">
    <n-card bordered class="max-w-md text-center shadow-lg p-6">
      <n-tabs
        class="card-tabs"
        v-model:value="activeTab"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        @update:value="updateTabInRoute"
      >
        <n-tab-pane name="signin" tab="Log ind">
          <n-form>
            <n-form-item-row label="Brugernavn eller e-mail">
              <n-input
                type="text"
                placeholder="Indtast dit brugernavn eller e-mail"
                v-model:value="signInData.identifier"
              />
            </n-form-item-row>
            <n-form-item-row label="Adgangskode">
              <n-input
                type="password"
                placeholder="Indtast din adgangskode"
                v-model:value="signInData.password"
              />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong class="mt-4" @click="handleSignIn">
            Log ind
          </n-button>
        </n-tab-pane>

        <n-tab-pane name="signup" tab="Opret konto">
          <n-form>
            <n-form-item-row label="Brugernavn">
              <n-input placeholder="Indtast dit brugernavn" v-model:value="signUpData.username" />
            </n-form-item-row>
            <n-form-item-row label="E-mail">
              <n-input
                type="email"
                placeholder="Indtast din e-mail"
                v-model:value="signUpData.email"
              />
            </n-form-item-row>
            <n-form-item-row label="Adgangskode">
              <n-input
                type="password"
                placeholder="Opret en adgangskode"
                v-model:value="signUpData.password"
              />
            </n-form-item-row>
            <n-form-item-row label="Gentag adgangskode">
              <n-input
                type="password"
                placeholder="Bekræft din adgangskode"
                v-model:value="signUpData.confirmPassword"
              />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong class="mt-4" @click="handleSignUp">
            Opret konto
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
