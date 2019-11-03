<template>
  <v-overlay :value="shown">
    <v-container>
      <v-row justify="center">
        <transition name="bounce" mode="out-in">
          <v-progress-circular
            v-if="!complete"
            indeterminate
            color="purple"
            size="30"
          ></v-progress-circular>
          <v-icon v-if="success && complete">mdi-check-bold</v-icon>
          <v-icon v-if="!success && complete">mdi-close</v-icon>
        </transition>
      </v-row>
      <v-row class="pt-3">
        {{ message }}
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
export default {
  props: {
    value: Boolean,
    message: String,
    complete: Boolean,
    success: Boolean,
    timeout: Number
  },
  data () {
    return {
      shown: true
    }
  },
  watch: {
    complete () {
      setTimeout(() => {
        console.log('set shown to false')
        this.shown = false
        this.$emit('hidden')
      }, Number(this.timeout))
    }
  }
}
</script>
