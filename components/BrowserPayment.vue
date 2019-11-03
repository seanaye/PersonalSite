<template>
  <div>
    <PaymentRequestButton
      v-if="canMakePayment"
      :options="{ paymentRequest: paymentReqObj }"
    ></PaymentRequestButton>
    <div v-else>
      Your browser does not have a supported payment method saved.
    </div>
    <ProcessingModal
      v-if="showOverlay"
      :message="status"
      :complete="complete"
      :success="success"
      :timeout="1500"
      @hidden="done"
    ></ProcessingModal>
  </div>
</template>

<script>
import { paymentRequest } from 'vue-stripe-elements-plus'
import PaymentRequestButton from '~/components/PaymentRequestButton'
import ProcessingModal from '~/components/ProcessingModal'

export default {
  components: {
    PaymentRequestButton,
    ProcessingModal
  },
  props: {
    value: Number
  },
  data () {
    return {
      status: '',
      complete: false,
      success: false,
      paymentReqObj: null,
      canMakePayment: false,
      showOverlay: false
    }
  },
  watch: {
    value () {
      if (this.paymentReqObj && this.value > 0) {
        this.paymentReqObj.update({
          total: {
            amount: this.value * 100,
            label: 'Donation Amount'
          }
        })
      }
    }
  },
  created () {
    this.validateIntent()
  },
  methods: {
    async validateIntent () {
      const req = paymentRequest({
        country: 'CA',
        currency: 'usd',
        total: {
          amount: this.value * 100,
          label: 'Donation Amount'
        },
        requestPayerName: false,
        requestPayerEmail: false
      }).on('token', async (obj) => {
        this.showOverlay = true
        this.status = 'Processing payment token'
        console.log(obj)
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
              desc: "SEAN AYE DONATION"
              live: $live
            )
          }`,
          variables: {
            token: obj.token.id,
            name: 'Anonymous',
            amount: this.value * 100,
            live: obj.token.livemode
          }
        })
        console.log(r)
        if (!r.data.errors) {
          console.log('success')
          obj.complete('success')
          this.complete = true
          this.success = true
          this.status = 'Payment complete!'
        } else {
          console.log('fail')
          obj.complete('fail')
          this.success = false
          this.complete = true
          this.status = 'Error processing payment'
        }
      })
      this.canMakePayment = await req.canMakePayment()
      this.paymentReqObj = req
    },
    done () {
      if (this.success) {
        this.$emit('paid')
      }
    }
  }
}
</script>
