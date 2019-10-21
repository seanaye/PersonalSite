<template>
  <v-container>
    <v-row>
      <v-col
        v-for="album in albums"
        :key="album.title"
        cols="12"
        sm="6"
        lg="4"
        @click="$router.push(`/photo/${album.title}`)"
      >
        <client-only>
          <v-hover v-slot:default="{ hover }">
            <v-img
              :src="require(`~/assets/img/${album.src}`)"
              :lazy-src="require(`~/assets/img/${album.src}`)"
              :float-name="album.title"
              style="margin-top: 10px; margin-bottom: 10px;"
            >
              <v-expand-transition>
                <v-overlay v-if="!hover" absolute style="opacity: 0.4;">
                  <h1>{{ album.title }}</h1>
                </v-overlay>
              </v-expand-transition>
            </v-img>
          </v-hover>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      albums: [
        { title: 'Iceland', src: 'Iceland/Iceland-15.jpg' },
        { title: 'Portugal', src: 'Portugal/Portugal-6.jpg' },
        { title: 'Zion', src: 'Zion/Zion-13.jpg' },
        { title: 'Winter2019', src: 'Winter2019/Winter2019-3.jpg' },
        { title: 'Roadtrip2019', src: 'Roadtrip2019/Roadtrip2019-19.jpg' },
        { title: 'Jasper', src: 'Jasper/Jasper-6.jpg' }
      ]
    }
  },
  mounted () {
    console.log(this.$root)
  }
}
</script>
