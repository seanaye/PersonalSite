<template>
  <v-row>
    <ProcessingModal
      v-if="showOverlay"
      :message="status"
      :complete="complete"
      :success="success"
      :timeout="1500"
      @hidden="done"
    ></ProcessingModal>
    <v-col cols="12" v-if="getname">
      <v-text-field
        v-model="name"
        outlined
        type="text"
        label="Name"
        placeholder="Enter your name"
      >
      </v-text-field>
    </v-col>
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
    amount: Number,
    getname: { type: Boolean, default: false },
    desc: { type: String, required: true }
  },
  data () {
    return {
      complete: false,
      success: false,
      validCard: false,
      showOverlay: false,
      status: '',
      name: ''
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
            $desc: String!
          ) {
            payment (
              token: $token
              name: $name
              amount: $amount
              desc: $desc
              live: $live
            )
          }`,
          variables: {
            token: t.token.id,
            name: this.name || 'anonymous',
            amount: this.amount * 100,
            live: t.token.livemode,
            desc: this.desc
          }
        })
        console.log(r)
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
    },
    done () {
      if (this.success) {
        this.$emit('paid')
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
      const cardNotOK = !this.validCard || this.complete || !(this.amount)
      return (this.getname) ? cardNotOK || !this.name : cardNotOK
    }
  }
}
</script>
