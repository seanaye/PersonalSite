<template>
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
                      :amount="Number(amount)"
                    />
                  </v-tab-item>
                  <v-tab-item
                    key="1"
                    background-color="grey darken-4"
                    style="margin-top: 20px;"
                  >
                    <BrowserPayment :value="Number(amount)"></BrowserPayment>
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
import CardPayment from '~/components/CardPayment'
import BrowserPayment from '~/components/BrowserPayment'

export default {
  components: {
    CardPayment,
    BrowserPayment
  },
  data () {
    return {
      paymentMethod: 0,
      amount: 5
    }
  },
  methods: {
    validAmount (int) {
      return (int > 0) ? true : 'Enter an amount higher than 0'
    }
  }
}
</script>

<style>
.theme--dark.v-tabs-items {
  background-color: rgba(66, 66, 66, 0) !important;
}
</style>
