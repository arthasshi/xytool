<template>
  <div class="home">
    <mu-paper class="data" :z-depth="3">
      <mu-paper class="total" :z-depth="1"> 总收入<br />{{ total }} </mu-paper>
      <mu-paper class="yunshi" :z-depth="1">
        <div class="title">今日运势:{{ yunshis[radomIndex].title }}</div>
        <div class="desc">解读:{{ yunshis[radomIndex].desc }}</div>
      </mu-paper>
      <!-- <mu-paper class="chart" :z-depth="1">
        <div class="title">总收入分布</div>
        <div class="pie" id="main"></div>
      </mu-paper> -->
      <mu-paper class="log" :z-depth="1">
        <div class="tip">最近发生了什么</div>
        <div class="item" v-for="(item, index) in list" :key="index">
          {{ item.time | ftmDate }}
          <span class="get">{{ item.eventtype }}：</span>
          {{ item.name }}
        </div>
        <!-- <div class="item">
          2020-7-3 20:44
          <span class="pay">支出：</span>
          龙女卡-1张
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="get">获得：</span>
          画魂--3技能-1.264成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="get">获得：</span>
          画魂--3技能-1.264成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="get">获得：</span>
          画魂--4技能-1.264成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="get">获得：</span>
          画魂--4技能-1.264成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="pay">支出：</span>
          速度符-5张
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="get">获得：</span>
          画魂--3技能-1.264成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="get">获得：</span>
          画魂--4技能-1.264成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="pay">支出：</span>
          持国--1技能-1.25成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="pay">支出：</span>
          持国--1技能-1.22成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="pay">支出：</span>
          持国--1技能-1.22成长
        </div>
        <div class="item">
          2020-7-3 20:44
          <span class="pay">支出：</span>
          持国--1技能-1.272成长
        </div> -->
      </mu-paper>
      <mu-paper class="rank" :z-depth="1">
        <div class="tip">财富天梯</div>
        <div class="item" v-for="(item, index) in rankList" :key="index">
          <div
            class="index"
            :style="{ background: index < 3 ? '#ff9800' : 'transparent' }"
          >
            第{{ index }}名
          </div>
          <div class="name">{{ item.username }}</div>
          <div class="money">{{ item.total }}</div>
        </div>
      </mu-paper>
    </mu-paper>
  </div>
</template>

<script>
// // 引入 ECharts 主模块
// var echarts = require("echarts/lib/echarts");
// // 引入柱状图
// require("echarts/lib/chart/pie");
// // 引入提示框和标题组件
// require("echarts/lib/component/tooltip");
// require("echarts/lib/component/title");

// @ is an alias to /src
import { getSisByUid, getTotalByUid, getRank } from "@/api/data.js";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      rankList: [],
      list: [],
      total: 0,
      uid: "",
      yunshis: [
        {
          title: "紫气东来",
          desc: "坐西朝东玩游戏能增加产出。"
        },
        {
          title: "福至心灵",
          desc: "今天不仅牟利运气好，现实中也很好哟"
        },
        {
          title: "落魄不偶",
          desc: "记得牟利的时候只领双，不领3"
        },
        {
          title: "神来气旺",
          desc: "今天的你牟利超神"
        },
        {
          title: "顺风顺水",
          desc: "今天跑环不会跟你要变异"
        },
        {
          title: "修短随化",
          desc: "上线试一试，运气不好就下线吧"
        },
        {
          title: "有命无运",
          desc: "今天还是陪陪家人吧"
        }
      ]
    };
  },
  computed: {
    radomIndex: function() {
      return Math.floor(Math.random() * this.yunshis.length + 1) - 1;
    }
  },
  filters: {
    ftmDate: d => {
      let st = new Date(d / 1000 / 1000);
      return st.toLocaleString();
    }
  },
  mounted() {
    // this.initChart();

    this.intiList();
  },
  methods: {
    intiList() {
      this.uid = JSON.parse(localStorage.userInfo).code;
      getSisByUid(this.uid).then(res => {
        // this.list = this.list.concat(res.data.list);
        this.list = res.data;
        // this.list.push(res.data.list);
        // this.total = res.data.money;
      });
      getTotalByUid(this.uid).then(res => {
        this.total = res.data;
      });
      getRank().then(res => {
        this.rankList = res.data;
      });
    },
    initChart() {
      // var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      // myChart.setOption({
      //   series: [
      //     {
      //       name: "收入来源",
      //       type: "pie",
      //       radius: "80%",
      //       data: [
      //         { value: 600, name: "无名鬼域" },
      //         { value: 274, name: "凌云度" },
      //         { value: 310, name: "须弥东界" },
      //         { value: 335, name: "小西天（雷音寺）" },
      //         { value: 400, name: "跑环" },
      //         { value: 400, name: "其他" }
      //       ]
      //     }
      //   ]
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  @extend %col;
  justify-content: flex-start;
  width: 100%;
  min-width: 720px;
  height: calc(100vh - 80px);
  .data {
    margin-top: 20px;
    padding: 20px;
    width: 60%;
    height: 100%;
    max-width: 1080px;
    min-width: 760px;
    @extend %row;
    justify-content: space-around;
    padding: 15rpx;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    .total {
      font-size: 20px;
      height: 100px;
      width: 49%;
      line-height: 50px;
      text-align: center;
      background: #64b5f6;
      color: #fff;
      margin-bottom: 20px;
    }
    .yunshi {
      height: 100px;
      width: 49%;
      background: #64b5f6;
      margin-bottom: 20px;
      @extend %col;
      justify-content: space-around;
      .title {
        font-size: 20px;
        color: #fff;
      }
      .desc {
        font-size: 18px;
        color: #fff;
      }
    }
    .chart {
      width: 100%;
      height: 240px;
      background: #eeeeee;
      @extend %col;
      justify-content: center;
      .title {
        font-size: 22px;
      }
      .pie {
        height: 180px;
        width: 100%;
      }
    }
    .log,
    .rank {
      margin-top: 20px;
      flex: 1;
      width: 100%;
      @extend %col;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 20px;
    }
    .log {
      background: #eeeeee;
      widows: 68%;
      max-width: 638px;
      min-width: 400px;
      margin-right: 20px;
      .tip {
        font-size: 22px;
        margin-bottom: 20px;
      }
      .item {
        color: #666;
        font-size: 18px;
        .get {
          color: #f40;
        }
        .pay {
          color: #00bfa5;
        }
      }
    }
    .rank {
      background: #eeeeee;
      .tip {
        font-size: 22px;
        margin-bottom: 20px;
      }
      .item {
        @extend %row;
        width: 100%;
        justify-content: flex-start;
        padding: 5px;
        margin-bottom: 5px;
        color: #666;
        border-radius: 4px;
        .index {
          font-size: 18px;
          padding: 5px;
          border-radius: 4px;
        }
        .name {
          margin-right: 16px;
          font-size: 16px;
          width: auto;
          min-width: 120px;
        }
        .money {
          font-size: 16px;
        }
      }
      width: 30%;
      max-width: 432px;
      min-width: 268px;
    }
  }
}
</style>
