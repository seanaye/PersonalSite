<template>
  <v-app style="background-color: #000000;" class="fonts">
    <v-app-bar
      fixed
      app
      hide-on-scroll
      elevation="24"
      color="black"
    >
      <v-toolbar-items>
        <v-btn text nuxt to="/">
          SeanAye
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text nuxt to="/photo">
          Photography
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content style="width: 100vw;">
      <nuxt />
    </v-content>
    <v-footer v-if="showFooter" app elevation="24" color="black">
      <div style="word-wrap: break-word; font-size: small;">
        If you enjoy my work and would like to support me,&nbsp;<a class="highlight" @click="$router.push('/payment')">consider donating</a> it only takes 10 seconds.
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  computed: {
    showFooter () {
      return this.$route.path !== '/payment'
    }
  }
}
</script>
