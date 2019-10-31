<template>
  <v-row>
    <ProcessingModal
      v-if="showOverlay"
      :message="status"
      :complete="complete"
      :success="success"
      :timeout="1000"
    ></ProcessingModal>
    <v-col cols="12">
      <card
        ref="card"
        class="stripe-card"
        :stripe="$root.context.env.stripeKey"
        :options="options"
        @change="validCard = $event.complete"
      />
    </v-col>
    <v-col cols="12" xs="12" md="6">
      <v-btn
        class="pay-with-stripe"
        :disabled="btnDisabled"
        :color="btnColour"
        @click="pay"
      >
        Pay with card
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import ProcessingModal from '~/components/ProcessingModal'

export default {
  components: {
    Card,
    ProcessingModal
  },
  props: {
    options: Object,
    amount: Number
  },
  data () {
    return {
      complete: false,
      success: false,
      validCard: false,
      showOverlay: false,
      status: ''
    }
  },
  methods: {
    async pay () {
      this.showOverlay = true
      this.status = 'Requesting payment token'
      console.log('start')
      let t = ''
      try {
        t = await createToken()
        console.log(t)
      } catch (err) {
        this.complete = true
        this.success = false
        this.status = 'Failed to create payment token'
        console.log(err)
        return
      }
      if (t.error) {
        this.complete = true
        this.success = false
        this.status = 'Received an invalid payment token'
        console.log(t.error)
      } else {
        this.status = 'Processing payment token'
        const r = await this.$axios.post(this.$root.context.env.APIEndpoint, {
          query: `mutation donation(
            $token: String!
            $name: String!
            $amount: Int!
            $live: Boolean!
          ) {
            payment (
              token: $token
              name: $name
              amount: $amount
              desc: "Donation"
              live: $live
            )
          }`,
          variables: {
            token: t.token.id,
            name: 'anonymous',
            amount: this.amount * 100,
            live: t.token.livemode
          }
        })
        const stripeResp = JSON.parse(r.data.data.payment)
        console.log(stripeResp)
        if (r.data.errors || !stripeResp.paid) {
          this.complete = true
          this.success = false
          this.status = 'Failed to process payment'
        } else {
          this.complete = true
          this.success = true
          this.status = 'Payment complete!'
        }
      }
    }
  },
  computed: {
    btnColour () {
      if (this.complete && !this.success) {
        return 'error'
      } else if (this.complete && this.success) {
        return 'success'
      } else {
        return 'primary'
      }
    },
    btnDisabled () {
      return !this.validCard || this.complete || !(this.amount)
    }
  }
}
</script>
