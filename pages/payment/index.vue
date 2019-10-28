<template>
  <!-- <card
    class="stripe-card"
    :class="{ complete }"
    stripe="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
    :options="stripeOptions"
    @change="complete = $event.complete"
  /> -->
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="10"
        md="8"
        xl="6"
      >
        <v-card color="grey darken-4">
          <v-card-title>
            Donate
          </v-card-title>
          <v-card-text>
            Hosting cloud services (like this website) is not free.
             Please consider supporting me as developer and as a
             photographer by giving a small dontation.
             All donations are secure, anonymous
             and help keep this site online :)
            <br>
            I accept all major payment cards, browser payments, such as Google Pay, and cryptocurrency.
            <br>
            Thank you.
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="amount"
                  type="number"
                  label="Donation Amount"
                  prefix="$"
                  suffix="USD"
                  :rules="[validAmount]"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-tabs v-model="paymentMethod" background-color="grey darken-4">
                  <v-tab key="0">Card</v-tab>
                  <v-tab key="1">Browser</v-tab>
                  <v-tab key="2">Cryptocurrency</v-tab>
                  <v-tab-item
                    key="0"
                    background-color="grey darken-4"
                    style="margin-top: 20px;"
                  >
                    <CardPayment
                      :options="{
                        hidePostalCode: true,
                        style: {
                          base: {
                            color: '#DDDDDD',
                            iconColor: '#DDDDDD'
                          }
                        }
                      }"
                      :amount="amount"
                    />
                  </v-tab-item>
                  <v-tab-item
                    key="1"
                    background-color="grey darken-4"
                    style="margin-top: 20px;"
                  >
                    <PaymentRequestButton
                      v-if="canMakePayment"
                      :options="{ paymentRequest: paymentReqObj }"
                    >
                    </PaymentRequestButton>
                    <div v-else>
                      Your browser does not have a supported payment method saved.
                    </div>
                  </v-tab-item>
                  <v-tab-item key="2">
                    <div style="margin-top: 10px; margin-bottom: 10px;">
                      <a
                        class="donate-with-crypto"
                        href="https://commerce.coinbase.com/checkout/72300cd0-6226-4355-8469-a272ec4bdb5e">
                        <span>DONATE WITH CRYPTO</span>
                      </a>
                      <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807">
                      </script>
                    </div>
                  </v-tab-item>
                </v-tabs>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { paymentRequest } from 'vue-stripe-elements-plus'
import PaymentRequestButton from '~/components/PaymentRequestButton'
import CardPayment from '~/components/CardPayment'

export default {
  components: {
    PaymentRequestButton,
    CardPayment
  },
  data () {
    return {
      paymentMethod: 0,
      amount: 5,
      paymentReqObj: null,
      canMakePayment: null
    }
  },
  methods: {
    async validateIntent () {
      const req = paymentRequest({
        country: 'CA',
        currency: 'usd',
        total: {
          amount: this.amount * 100,
          label: 'Donation Amount'
        },
        requestPayerName: true,
        requestPayerEmail: true
      }).on('token', async (obj) => {
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
              desc: "MC SERVER DONATION"
              live: $live
            )
          }`,
          variables: {
            token: obj.token.id,
            name: obj.payerName,
            amount: this.amount * 100,
            live: obj.token.livemode
          }
        })
        if (!r.data.errors) {
          obj.complete('success')
        } else {
          obj.complete('fail')
        }
      })
      this.canMakePayment = await req.canMakePayment()
      this.paymentReqObj = req
      console.log('intent')
    },
    validAmount (int) {
      return (int > 0) ? true : 'Enter an amount higher than 0'
    }
  },
  mounted () {
    this.validateIntent()
  }
}
</script>

<style>
.theme--dark.v-tabs-items {
  background-color: rgba(66, 66, 66, 0) !important;
}
</style>
