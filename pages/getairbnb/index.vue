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
            Pool money for AirBnB
          </v-card-title>
          <v-card-text>
            <v-row justify-content-center>
              <v-col cols="12">
                Price breakdown: I was charged $3400 CAD for booking the AirBnB and $138 CAD for booking the club, $3538 total, but I can only accpet payments in USD.
              </v-col>
              <v-col cols="12">
                The current exchange rate from CAD to USD is $1 CAD >> ${{ Math.round(convRate * 10000) / 10000 }} USD. This means im owed ${{ Math.round(USD * 100) / 100 }} USD.
              </v-col>
              <v-col cols="12">
                My payment processor takes 2.9% in transaction fees (less than paypal). This means in total people need to pay me ${{ Math.round(txFee * 100) / 100 }} USD.
              </v-col>
              <v-col cols="12">
                Assuming we have {{ numPpl }} people. Everyone needs to pay ${{ Math.round(amount * 100) / 100 }} USD, rounded up to nearest dollar.
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="amount"
                  type="number"
                  label="Payment Amount"
                  prefix="$"
                  suffix="USD"
                  :rules="[validAmount]"
                  outlined
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-tabs v-if="!paid" v-model="paymentMethod" background-color="grey darken-4">
                  <v-tab key="0">
                    Card
                  </v-tab>
                  <v-tab key="1">
                    Browser
                  </v-tab>
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
                      getname
                      desc="Pooling AirBnB Money"
                      @paid="paid = true"
                    />
                  </v-tab-item>
                  <v-tab-item
                    key="1"
                    background-color="grey darken-4"
                    style="margin-top: 20px;"
                  >
                    <BrowserPayment
                      :value="Number(amount)"
                      getname
                      desc="Pooling AirBnB Money"
                      @paid="paid = true"
                    />
                  </v-tab-item>
                </v-tabs>
                <div v-if="paid">
                  Payment complete! Thank You.
                </div>
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
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  data () {
    return {
      paymentMethod: 0,
      paid: false,
      convRate: 0.7578,
      iPaid: 3538,
      numPpl: 19
    }
  },
  computed: {
    USD () {
      return this.iPaid * Number(this.convRate)
    },
    txFee () {
      return this.USD * 1.029
    },
    amount () {
      return Math.ceil(this.txFee / this.numPpl)
    }
  },
  created () {
    this.getExchange()
  },
  methods: {
    validAmount (int) {
      return (int > 0) ? true : 'Enter an amount higher than 0'
    },
    async getExchange () {
      const r = await this.$axios.get('https://api.exchangeratesapi.io/latest?symbols=USD,CAD&base=CAD')
      this.convRate = r.data.rates.USD
    }
  }
}
</script>

<style>
.theme--dark.v-tabs-items {
  background-color: rgba(66, 66, 66, 0) !important;
}
</style>
