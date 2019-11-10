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
            I just checked and the total is 272,842 yen which is almost exactly 2500 USD (give or take $3). Divided by 17 people is $147 USD. Plz send money so I can pay for it. I can take direct card payments or browser payments like google pay.
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
                  <v-tab key="0">Card</v-tab>
                  <v-tab key="1">Browser</v-tab>
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
                      @paid="paid = true"
                      getname
                      desc="Pooling AirBnB Money"
                    />
                  </v-tab-item>
                  <v-tab-item
                    key="1"
                    background-color="grey darken-4"
                    style="margin-top: 20px;"
                  >
                    <BrowserPayment
                      :value="Number(amount)"
                      @paid="paid = true"
                      getname
                      desc="Pooling AirBnB Money"
                    ></BrowserPayment>
                  </v-tab-item>
                </v-tabs>
                <div v-if="paid">Payment complete! Thank You.</div>
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
      amount: 147,
      paid: false
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
