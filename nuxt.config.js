
import colors from 'vuetify/es5/util/colors'
import makeGallery from './makeGallery.js'
import { VuetifyProgressiveModule } from 'vuetify-loader'



const initNuxt = async () => { 
  const gallery = await makeGallery()
  console.log(gallery)
  return {
    mode: 'spa',
    env: {
      gallery,
      stripeKey: (process.env.NODE_ENV === 'development') ? 'pk_test_ZYQ2ez0gTwY07wlAbgZKCMKN00h2HcUXd3' : 'pk_live_XK9H5h8sWxjpCyhAFMhUbVEj00jFVTeG5C',
      APIEndpoint: 'https://mc.seanaye.ca/graphql/'
    },
    generate: {
      routes: gallery.map((elem) => {
        return `/photo/${elem.title}`
      })
    },
    /*
    ** Headers of the page
    */
    head: {
      titleTemplate: 'Sean Aye',
      title: 'Sean Aye',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Sean Aye is a photographer, web developer, and student at the University of Waterloo.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=PT+Sans'
        }
      ],
      script: [
        { src: 'https://js.stripe.com/v3/' }
      ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },
    /*
    ** Global CSS
    */
    css: [
      '@/assets/style/global'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
      { src: '~/plugins/VueMasonry', ssr: false },
      { src: '~/plugins/VueObserveVisibility', ssr: false}
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
      '@nuxtjs/vuetify',
      // Doc: https://axios.nuxtjs.org/usage
      '@nuxtjs/axios',
      '@nuxtjs/eslint-module'
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
    },
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
      theme: {
        dark: true,
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    },
    /*
    ** Build configuration
    */
    build: {
      /*
      ** You can extend webpack config here
      */
      extend (config, ctx) {

      }
    }
  }
}

export default async () => {
  return await initNuxt()
}
