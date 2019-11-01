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
                  My name is Sean Aye, I'm a photographer, web developer, and student at the University of Waterloo. I'm looking for freelance photo and or video work. If you are interested in portraits, photo prints, promotional videos, or just want to get in touch, feel free to <a href="mailto:sean.aye2@gmail.com" class="highlight">email me</a>
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
              @load="increment"
            />
          </masonry>
      </v-container>
    </v-card>
    <transition name="fade">
      <v-btn
        v-if="showTooltip"
        color="grey darken-4"
        sticky
        bottom
        right
        v-model="showTooltip"
        elevation="24"
        style="margin-bottom: 20px;"
        @click="$router.push('/photo')"
      >
        View More
      </v-btn>
    </transition>
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
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  data () {
    return {
      vis: true,
      loaded: 0,
      list: [],
      showTooltip: false
    }
  },
  created () {
    this.getList()
  },
  computed: {
    loadedAll () {
      return this.list.length > 0 && this.list.length === this.loaded
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
    },
    loadedAll () {
      if (this.loadedAll) {
        this.showTooltip = true
        setTimeout(() => {
          this.showTooltip = false
        }, 10000)
      }
    }
  },
  methods: {
    visChange (event) {
      this.vis = event
    },
    increment () {
      this.loaded += 1
    },
    getList () {
      const folder = this.$root.context.env.gallery.filter((elem) => {
        return elem.title === 'cover'
      })
      this.list = folder[0].photos.map(path => `cover/${path}`)
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

#up {
  position: absolute;
  top: 55%;
  right: 5%;
  width: 12px;
  height: 12px;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-animation: sdb05 3s infinite;
  animation: sdb06 3s infinite;
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

@-webkit-keyframes sdb06 {
  0% {
    -webkit-transform: rotate(135deg) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(135deg) translate(-10px, 10px);
    opacity: 0;
  }
}

@keyframes sdb06 {
  0% {
    transform: rotate(135deg) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(135deg) translate(-10px, 10px);
    opacity: 0;
  }
}
.Masthead {
  z-index: 0 !important;
}

</style>
