<template>
  <fieldset>
    <legend>总体数据</legend>
    <fieldset>
      <legend>红1</legend>
      <line-chart :chart-data="unionLotto" :row-data="rowData" />
    </fieldset>
    <fieldset>
      <legend>红2</legend>
      <line-chart :chart-data="unionLotto2" :row-data="rowData2" />
    </fieldset>
  </fieldset>
</template>

<script>
import LineChart from '../dashboard/admin/components/LineChart'
import { getUnionLotto, getProbability } from '@/api/union-lotto'

export default {
  name: 'UnionLotto',
  components: {
    LineChart
  },
  data() {
    return {
      unionLotto: {
        expectedData: [0, 10, 11, 12]
      },
      rowData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      unionLotto2: {
        expectedData: [0, 10, 11, 12]
      },
      rowData2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    }
  },
  created() {
    this.getUnionLottoData()
    this.getProbabilityData()
  },
  methods: {
    getUnionLottoData() {
      getUnionLotto().then(res => {
        console.log(res)
      })
    },
    getProbabilityData() {
      getProbability().then(res => {
        const x = []
        const y = []
        const x2 = []
        const y2 = []
        const data = res.probability
        for (let i = 0; i < data.length; i++) {
          data[i].red1 = data[i].red1.replace(/'/g, '"')
          const red1 = JSON.parse(data[i].red1)
          for (let j = 0; j < red1.length; j++) {
            x.push(red1[j].n)
            y.push(red1[j].count)
          }
          console.log(x)
          console.log(y)
          this.rowData = x
          this.unionLotto.expectedData = y

          data[i].red2 = data[i].red2.replace(/'/g, '"')
          const red2 = JSON.parse(data[i].red2)
          for (let j = 0; j < red2.length; j++) {
            x2.push(red2[j].n)
            y2.push(red2[j].count)
          }
          this.rowData2 = x2
          this.unionLotto2.expectedData = y2
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
