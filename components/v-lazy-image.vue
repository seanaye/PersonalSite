<template>
  <v-hover v-slot:default="{ hover }">
    <v-img
      :src="srcUrl"
      style="margin-top: 10px; margin-bottom: 10px;"
      @click="fullscreen"
    >
    </v-img>
  </v-hover>
</template>

<script>
export default {
  props: {
    src: String,
    actions: Boolean
  },
  data: () => ({
    observer: null,
    intersected: false
  }),
  computed: {
    srcUrl () {
      return this.intersected ? {
        src: require(`~/assets/img/${this.src}`),
        lazySrc: require(`~/assets/img/${this.src}`)
      } : {
        lazySrc: require(`~/assets/img/${this.src}`),
        aspect: 3 / 2
      }
    }
  },
  mounted () {
    this.observer = new IntersectionObserver((entries) => {
      const image = entries[0]
      if (image.isIntersecting) {
        this.intersected = true
        this.observer.disconnect()
      }
    })
    this.observer.observe(this.$el)
  },
  destroyed () {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    fullscreen () {
      window.open(require(`~/assets/img/${this.src}`), '_newtab')
    }
  }
}
</script>

<style>
</style>
