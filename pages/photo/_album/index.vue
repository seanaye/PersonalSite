<template>
  <v-container>
    <client-only>
      <masonry :cols="{ default: 3, 800: 2, 400: 1 }" gutter="10px">
        <template v-for="img in images">
          <vLazyImage :key="img" :src="img" actions />
        </template>
      </masonry>
    </client-only>
  </v-container>
</template>

<script>
import vLazyImage from '~/components/v-lazy-image'

export default {
  components: {
    vLazyImage
  },
  computed: {
    images () {
      const param = this.$route.params.album
      const thisAlbum = this.$root.context.env.gallery.filter((album) => {
        return param === album.title
      })
      return thisAlbum[0].photos.map(path => `${param}/${path}`)
    }
  }
}
</script>
