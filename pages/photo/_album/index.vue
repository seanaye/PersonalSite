<template>
  <v-container>
    <masonry :cols="{ default: 3, 800: 2, 400: 1 }">
      <lazySkeleton
        v-for="img in images"
        :key="img"
        :src="require(`~/assets/img/${img}`)"
      />
    </masonry>
  </v-container>
</template>

<script>
import lazySkeleton from '~/components/lazy-skeleton'

export default {
  components: {
    lazySkeleton
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
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
