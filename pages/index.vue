<template>
  <div style="background-color: black;">
    <v-container fluid style="height:100vh; padding: 0px;">
      <v-layout row fill-height>
        <v-flex xs12>
          <parallax v-observe-visibility="visChange" fixed :section-height="100">
            <appcanvas ref="canvas" class="xs12" />
            <span id="scroll" />
          </parallax>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card color="black">
      <v-container fluid>
        <v-row justify="center">
          <v-col
            cols="12"
            sm="10"
            md="8"
            xl="6"
          >
            <v-card color="grey darken-4">
              <v-card-title>
                About
              </v-card-title>
              <v-card-text>
                <span id="smallfont">
                  My name is Sean Aye, I'm a photographer, web developer, and student at the University of Waterloo. I'm looking for freelance photo and or video work. If you are interested in portraits, photo prints, promotional videos, or just want to get in touch, email me at <a href="mailto:contact@seanaye.ca" class="highlight">contact@seanaye.ca</a>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
          <masonry :cols="{ default: 4, 800: 2, 520: 1, 1300: 3 }" gutter="10px">
            <lazySkeleton
              v-for="img in list"
              :key="img"
              :src="require(`~/assets/img/${img}`)"
            />
          </masonry>
      </v-container>
      <v-container>
        <v-row justify="center">
          <v-col
            cols="12"
            sm="10"
            md="8"
            xl="6"
          >
            <v-card class="pb-5" color="grey darken-4">
              <v-card-title>
                Support
              </v-card-title>
              <v-card-text>
                If you enjoy what I do please consider checking out
                <a class="highlight" @click="$router.push('/photo')">more photos.</a>
                You can also help me out by giving a
                <a class="highlight" @click="$router.push('/payment')">small dontaion</a>
                 or
                <a href="mailto://sean.aye2@gmail.com" class="highlight">emailing me.</a>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import Parallax from 'vue-parallaxy'
import appcanvas from '~/components/appcanvas'
import lazySkeleton from '~/components/lazy-skeleton'

export default {
  components: {
    Parallax,
    appcanvas,
    lazySkeleton
  },
  data () {
    return {
      vis: true
    }
  },
  computed: {
    list () {
      const folder = this.$root.context.env.gallery.filter((elem) => {
        return elem.title === 'cover'
      })
      return folder[0].photos.map(path => `cover/${path}`)
    }
  },
  watch: {
    vis () {
      if (this.vis) {
        console.log('started')
        this.$refs.canvas.start()
      } else {
        console.log('stopped')
        this.$refs.canvas.stop()
      }
    }
  },
  methods: {
    visChange (event) {
      this.vis = event
    }
  }
}
</script>

<style>
#scroll {
  position: absolute;
  top: 80vh;
  left: 50%;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-animation: sdb05 3s infinite;
  animation: sdb05 3s infinite;
  box-sizing: border-box;
}

@-webkit-keyframes sdb05 {
  0% {
    -webkit-transform: rotate(-45deg) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(-45deg) translate(-20px, 20px);
    opacity: 0;
  }
}

@keyframes sdb05 {
  0% {
    transform: rotate(-45deg) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(-45deg) translate(-20px, 20px);
    opacity: 0;
  }
}

#smallfont {
  font-size: 14px !important;
  line-height: 2em;
}

a.highlight:hover {
  color: #ff5b5b !important;
  text-decoration: none !important;

}

.v-application a.highlight {
  color: rgba(255,255,255,0.5);
}

.Masthead {
  z-index: 0 !important;
}

</style>
