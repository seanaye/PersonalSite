<template>
  <div>
    <v-skeleton-loader
      :loading="true"
      transition="fade"
      type="image"
    >
      <v-img
        :src="src"
        style="margin-top: 10px; margin-bottom: 10px;"
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
  </div>
</template>
<script>
export default {
  props: {
    src: String
  },
  data () {
    return {
      loading: true
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
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }
}
</script>
