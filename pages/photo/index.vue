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
        <v-hover v-slot:default="{ hover }">
          <v-card>
            <v-img
              :src="require(`~/assets/img/${album.src}`)"
              :float-name="album.title"
              :aspect-ratio="4/3"
            >
              <v-expand-transition>
                <div
                  v-if="!hover"
                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-3 white--text"
                  style="height: 100%; opacity: 0.4; justify-content: center; align-items: center;"
                >
                  {{ album.title }}
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
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
