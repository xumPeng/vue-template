<template>
  <div class="dashboard-container">
    <!-- 使用 Element UI 的栅格布局来安排图表 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="pie-chart" style="height: 340px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <el-select v-model="selectedLine" placeholder="请选择线路" @change="onLineChange">
            <el-option v-for="line in lineOptions" :key="line.value" :label="line.label" :value="line.value">
            </el-option>
          </el-select>
          <div id="bar-chart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card style="margin-top: 20px;">
          <div id="barplot-chart" style="height: 380px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { AllTrainingData } from '@/api/table' // 导入获取数据的API
import * as echarts from 'echarts' // 引入ECharts

export default {
  name: 'Dashboard',
  data() {
    return {
      allTrainingData: [],
      selectedLine: '09', // 默认设置为9号线
    };
  },

  created() {
    this.getAllTrainingData()
  },

  mounted() {
    this.$nextTick(() => {
      this.initPieChart()
      this.initBarChart()
      this.initBarplotChart()
    })
  },

  watch: {
    selectedLine(newVal, oldVal) {
      if (!this.lineOptions.some(option => option.value === newVal)) {
        this.selectedLine = oldVal; // 如果新值不在选项中，则保持旧值
      } else {
        this.initBarChart(); // 当线路改变且有效时，重新初始化柱状图
      }
    }
  },

  computed: {
    // 动态生成线路选项
    lineOptions() {
      // 仅当allTrainingData不为空时才计算线路选项
      if (this.allTrainingData && this.allTrainingData.length > 0) {
        const linesSet = new Set(this.allTrainingData.map(item => item.train_model.substring(0, 2)));
        const options = Array.from(linesSet).map(line => ({
          label: `${line}号线`,
          value: line,
        }));
        // 可以在这里对options进行排序
        return options;
      }
      return []; // 如果没有数据，返回空数组
    },
  },

  methods: {
    async getAllTrainingData() {
      const res = await AllTrainingData()
      this.allTrainingData = res.data
      // 数据加载后重新初始化图表
      this.initPieChart()
      this.initBarChart()
      this.initBarplotChart()
    },

    // 转换数据为饼状图所需的格式
    processPieChartData() {
      const resultDistribution = {}
      this.allTrainingData.forEach(data => {
        const { assessment_item, assessment_result } = data
        if (!resultDistribution[assessment_item]) {
          resultDistribution[assessment_item] = { '1': 0, '2': 0, '3': 0 }
        }
        resultDistribution[assessment_item][assessment_result]++
      })

      return Object.keys(resultDistribution).map(item => ({
        name: item,
        type: 'pie',
        data: Object.keys(resultDistribution[item]).map(key => ({
          value: resultDistribution[item][key],
          name: this.resultName(key)
        }))
      }))
    },
    // 转换考核结果为中文
    resultName(key) {
      const names = { '1': '不合格', '2': '合格', '3': '优秀' }
      return names[key]
    },
    // 饼状图
    initPieChart() {
      const pieChart = echarts.init(document.getElementById('pie-chart'))
      const option = {
        title: {
          text: '考核结果饼状图',
          left: 'center', // 标题居中
          textStyle: {
            fontSize: 20 // 设置字体大小为20
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          ...this.processPieChartData()[0], // 
          center: ['50%', '60%'], // 将饼状图居中
          itemStyle: {
            // 定义不同考核结果的配色方案
            color: (params) => {
              const colors = ['#5470C6', '#91CC75', '#EE6666']
              return colors[params.dataIndex % colors.length]
            }
          }
        }]
      }
      pieChart.setOption(option)
    },

    // 竖柱状图
    processBarChartData() {
      // 根据选择的线路过滤数据
      const filteredData = this.allTrainingData.filter(({ train_model }) => train_model.substring(0, 2) === this.selectedLine);

      const groupResults = {};
      filteredData.forEach(({ crew_group, assessment_result }) => {
        // 这里假设crew_group和assessment_result字段与之前相同
        if (!groupResults[crew_group]) {
          groupResults[crew_group] = { '1': 0, '2': 0, '3': 0 };
        }
        groupResults[crew_group][assessment_result]++;
      });

      const categories = Object.keys(groupResults)
        .map(group => ({
          group,
          total: Object.values(groupResults[group]).reduce((acc, val) => acc + val, 0)
        }))
        .sort((a, b) => b.total - a.total)
        .map(item => item.group);

      const series = ['1', '2', '3'].map(result => ({
        name: this.resultName(result),
        type: 'bar',
        stack: '总量',
        data: categories.map(group => groupResults[group][result])
      }));

      return { series, categories };
    },

    initBarChart() {
      const { series, categories } = this.processBarChartData(); // 使用过滤后的数据
      const barChart = echarts.init(document.getElementById('bar-chart'));
      const option = {
        title: {
          text: '各乘务班组考核结果',
          left: 'center',
          textStyle: {
            fontSize: 20
          }
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: {
          data: ['不合格', '合格', '优秀'],
          left: 'right',
          orient: 'vertical'
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: { interval: 0, rotate: 45 }
        },
        yAxis: { type: 'value' },
        color: ['#EE6666', '#91CC75', '#5470C6'],
        series: series
      };
      barChart.setOption(option, true); // 确保更新图表时覆盖之前的配置
    },

    onLineChange() {
      this.initBarChart(); // 当线路改变时，重新初始化柱状图
    },
    // 处理横向柱状图数据
    processBarplotData() {
      const groupedResults = this.allTrainingData.reduce((acc, item) => {
        const line = item.train_model.substring(0, 2); // 获取前两位作为线路编号
        const result = item.assessment_result; // 考核结果

        // 确保每条线路的数据结构，并使用中文标签
        if (!acc[line]) {
          acc[line] = { "不合格": 0, "合格": 0, "优秀": 0 };
        }

        // 根据考核结果增加对应的计数
        if (result === 1) acc[line]["不合格"]++;
        else if (result === 2) acc[line]["合格"]++;
        else if (result === 3) acc[line]["优秀"]++;

        return acc;
      }, {});

      const categories = ["不合格", "合格", "优秀"];
      const seriesData = categories.map(category => ({
        name: category,
        type: 'bar',
        barWidth: '50%', // 设置柱子的宽度为类别宽度的50%
        data: Object.keys(groupedResults).map(line => groupedResults[line][category]),
        stack: '总分'
      }));

      return { seriesData, categories: Object.keys(groupedResults).map(line => `线路${line}`) };
    },
    // 横向柱状图
    initBarplotChart() {
      const { seriesData, categories } = this.processBarplotData();
      const barplotChart = echarts.init(document.getElementById('barplot-chart'));
      const option = {
        title: {
          text: '各线路考核结果',
          left: 'center', // 标题居中
          textStyle: {
            fontSize: 20 // 设置字体大小为20
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['不合格', '合格', '优秀'],
          left: 'left',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: categories
        },
        color: ['#EE6666', '#91CC75', '#5470C6'], // 红、绿、蓝配色
        series: seriesData
      };
      barplotChart.setOption(option);
    },
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
