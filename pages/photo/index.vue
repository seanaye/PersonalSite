<template>
  <v-container>
    <v-row>
      <v-col
        v-for="album in albums"
        :key="album.title"
        cols="12"
        sm="6"
        lg="4"
        @click="$router.push(`/photo/${album.link}`)"
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
        { title: 'Iceland', src: 'iceland/Iceland-15.jpg', link: 'iceland' },
        { title: 'Portugal', src: 'portugal/Portugal-6.jpg', link: 'portugal' },
        { title: 'Zion', src: 'zion/Zion-13.jpg', link: 'zion' },
        { title: 'Winter 2019', src: 'winter2019/Winter2019-3.jpg', link: 'winter2019' },
        { title: 'Roadtrip 2019', src: 'roadtrip/Roadtrip2019-19.jpg', link: 'roadtrip' },
        { title: 'Jasper', src: 'jasper/Jasper-6.jpg', link: 'jasper' }
      ]
    }
  },
  mounted () {
    console.log(this.$root)
  }
}
</script>
