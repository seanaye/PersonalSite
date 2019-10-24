<template>
  <v-card>
    <v-card-text class="lim-padding">
      <v-skeleton-loader
        :loading="!intersected"
        transition="fade"
        type="image"
      >
        <v-img
          :src="src"
          @click="fullscreen"
          @load="log"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-skeleton-loader>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    src: String
  },
  data () {
    return {
      intersected: false,
      observer: null
    }
  },
  methods: {
    fullscreen () {
      window.open(this.src, '_newtab')
    },
    log (event) {
      console.log(event)
    }
  },
  mounted () {
    this.observer = new IntersectionObserver((entries) => {
      const image = entries[0]
      if (image.isIntersecting) {
        this.intersected = true
        console.log('intersected')
        this.observer.disconnect()
      }
    })
    this.observer.observe(this.$el)
  },
  destroyed () {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
</script>

<style scoped>
.lim-padding {
  padding: 8px !important;
}
</style>
