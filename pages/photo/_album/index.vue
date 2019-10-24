<template>
  <v-container>
    <client-only>
      <masonry :cols="{ default: 3, 800: 2, 400: 1 }">
        <template v-for="img in images">
          <lazySkeleton :key="img" :src="require(`~/assets/img/${img}`)" actions />
        </template>
      </masonry>
    </client-only>
  </v-container>
</template>

<script>
import lazySkeleton from '~/components/lazy-skeleton'

export default {
  components: {
    lazySkeleton
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
