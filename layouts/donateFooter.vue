<template>
  <v-app style="background-color: #000000;" class="fonts">
    <v-app-bar
      fixed
      app
      scroll-off-screen
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
    <v-footer app fixed="">
      If you enjoy my work and would like to support me,
      <a class="highlight" @click="$router.push('/payment')">
        &nbsp; please consider donating
      </a>
      .
    </v-footer>
  </v-app>
</template>

<script>
export default {
}
</script>

<style scoped>

#__nuxt {
  transition: all 250ms;
  background-color: rgb(0,0,0,255,255,255);
  color: rgb(0,0,0,255,255,255);
}

.theme--dark {
  background-color: #000000 !important;
  color: #ddd !important;
}

.application {
  font-family: 'PT Sans', sans-seriff !important;
  font-size: 16px !important;
  letter-spacing: 0px !important;
  line-height: 2em !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

a {
  transition: 0.5s;
  text-decoration: none !important;
}

html {
  background: black !important;
}
</style>
