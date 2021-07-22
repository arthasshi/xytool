<template>
  <div class="home">
    <mu-paper class="data" :z-depth="3">
      <div class="title">
        <div class="name">牟利场景：</div>
        <div class="total">{{ addType | mapName }}</div>
        <div class="name">总牟利：</div>
        <div class="total">{{ tweenedTotal }}&nbsp;W</div>
      </div>
      <mu-button fab large color="teal" class="add" @click="addShow = !addShow">
        <mu-icon value="add"></mu-icon>
      </mu-button>
      <mu-slide-right-transition>
        <div class="add-container" v-show="addShow">
          <mu-button small color="primary" @click="openAddDialog(addType)"
            >宝宝</mu-button
          >
          <mu-button small color="primary" @click="openAddDialog('06')"
            >环装</mu-button
          >
          <mu-button small color="primary" @click="openAddDialog('07')"
            >卡片</mu-button
          >
          <mu-button small color="primary" @click="openAddDialog('08')"
            >其他（妙手）</mu-button
          >
        </div>
      </mu-slide-right-transition>
      <mu-dialog title="添加" width="720" :open.sync="dialogOpen">
        <!-- 场景相关宝宝 会根据addtype判断用哪个数据源 -->
        <div
          class="add-dialog-container"
          v-if="addTypes.indexOf(viewType) > -1"
        >
          <mu-row gutter>
            <mu-col span="6">
              <mu-select label="宝宝类型" v-model="obj.name" full-width>
                <mu-option
                  v-for="item in currentBaby"
                  :key="item"
                  :label="item"
                  :value="item"
                ></mu-option>
              </mu-select>
            </mu-col>
            <mu-col span="6">
              <mu-checkbox v-model="obj.isBaby" :label="'是宝宝'"></mu-checkbox>
            </mu-col>
          </mu-row>
          <mu-row gutter>
            <mu-col span="6">
              <mu-select label="技能数" v-model="obj.skill" full-width>
                <mu-option
                  v-for="item in 10"
                  :key="item"
                  :label="item + ''"
                  :value="item"
                ></mu-option>
              </mu-select>
            </mu-col>
            <mu-col span="6">
              <mu-text-field
                v-model="obj.growth"
                label="成长"
                prefix="1."
                label-float
              ></mu-text-field>
            </mu-col>
          </mu-row>
          <mu-row gutter>
            <mu-col span="6">
              <mu-text-field
                v-model="obj.value"
                label="当前价值"
                suffix="w梦幻币"
                label-float
              ></mu-text-field>
            </mu-col>
            <mu-col span="6">
              <!-- <mu-text-field v-model="obj.growth" label="成长" prefix="1." label-float></mu-text-field> -->
            </mu-col>
          </mu-row>
        </div>
        <!-- 环装 -->
        <div class="add-dialog-container" v-else-if="viewType == '06'">
          <mu-row gutter>
            <mu-col span="6">
              <mu-select label="等级" v-model="obj.eLvl">
                <mu-option
                  v-for="item in equptList"
                  :key="item"
                  :label="item"
                  :value="item"
                ></mu-option>
              </mu-select>
            </mu-col>
            <mu-col span="6">
              <mu-radio
                :value="'装备'"
                v-model="obj.eType"
                label="装备"
              ></mu-radio>
              <mu-radio
                :value="'武器'"
                v-model="obj.eType"
                label="武器"
              ></mu-radio>
            </mu-col>
          </mu-row>
          <mu-row gutter>
            <mu-col span="6">
              <mu-text-field
                v-model="obj.value"
                label="当前价值"
                suffix="w梦幻币"
                label-float
              ></mu-text-field>
            </mu-col>
            <mu-col span="6">
              <!-- <mu-text-field v-model="obj.growth" label="成长" prefix="1." label-float></mu-text-field> -->
            </mu-col>
          </mu-row>
        </div>
        <!-- 卡片 -->
        <div class="add-dialog-container" v-else-if="viewType == '07'">
          <mu-row gutter>
            <mu-col span="6">
              <mu-select label="卡片类型" v-model="obj.name" full-width>
                <mu-option
                  v-for="item in currentBaby"
                  :key="item"
                  :label="item"
                  :value="item"
                ></mu-option>
              </mu-select>
            </mu-col>
            <mu-col span="6">
              <mu-text-field
                v-model="obj.value"
                label="当前价值"
                suffix="w梦幻币"
                label-float
              ></mu-text-field>
            </mu-col>
          </mu-row>
        </div>
        <!-- 其他物品 -->
        <div class="add-dialog-container" v-else-if="viewType == '08'">
          <mu-row gutter>
            <mu-col span="6">
              <mu-text-field
                v-model="obj.name"
                label="物品名称"
                label-float
              ></mu-text-field>
            </mu-col>
            <mu-col span="6">
              <mu-text-field
                v-model="obj.value"
                label="当前价值"
                suffix="w梦幻币"
                label-float
              ></mu-text-field>
            </mu-col>
          </mu-row>
        </div>
        <mu-button slot="actions" flat color="primary" @click="ensureAddObj"
          >确定</mu-button
        >
        <mu-button slot="actions" flat color="defalut" @click="closeDialog"
          >关闭</mu-button
        >
      </mu-dialog>
      <mu-data-table
        border
        fit
        :columns="columns"
        :sort.sync="sort"
        @sort-change="handleSortChange"
        :data="list"
      >
        <template slot-scope="scope">
          <td>{{ scope.row.name }}</td>
          <td class="is-right">
            {{
              addType == "06" || addType == "07" || addType == "08"
                ? "-"
                : scope.row.isBaby
                ? "是"
                : "否"
            }}
          </td>
          <td class="is-right">
            {{ scope.row.skill ? scope.row.skill : "-" }}
          </td>
          <td class="is-right">
            {{ scope.row.growth != "" ? "1." + scope.row.growth : "" }}
          </td>
          <td class="is-right">{{ scope.row.value }}</td>
          <td class="is-right">{{ scope.row.time | ftmDate }}</td>
        </template>
      </mu-data-table>
      <mu-flex justify-content="center">
        <mu-pagination
          raised
          circle
          :page-size="size"
          :total="itemTotal"
          :current.sync="page"
          @change="pageChange"
        ></mu-pagination>
      </mu-flex>
    </mu-paper>
  </div>
</template>

<script>
import { AddSi, GetSis } from "@/api/data.js";
export default {
  data() {
    return {
      type: 0,
      total: 0,
      tweenedTotal: 0,
      addShow: false,
      dialogOpen: false,
      sort: {
        name: "",
        order: "asc"
      },
      addTypes: ["01", "02", "03", "04", "05"],
      addType: 0, //这个type应该包含各个场景的宝宝和其他，其值应该也有一些意义。
      d5Baby: ["画魂", "吸血鬼", "幽灵", "鬼将", "幽莹娃娃", "泡泡", "变异"],
      djBaby: ["真陀护法", "毗舍童子", "持国巡守", "泡泡", "变异"],
      yhjBaby: ["真陀护法", "毗舍童子", "妙华天女", "广目巡守", "泡泡", "变异"],
      gsBaby: [
        "谛听",
        "日游神",
        "夜游神",
        "无常鬼差（黑）",
        "无常鬼差（白）",
        "泡泡",
        "变异"
      ],
      xtBaby: [
        "大力金刚",
        "金绕僧",
        "炎魔神",
        "嗜天虎",
        "雾中仙",
        "灵鹤",
        "泡泡",
        "变异"
      ],
      currentBaby: null,
      equptList: ["60", "70", "80"],
      columns: [
        { title: "物品/宝宝", width: 130, name: "name" },
        {
          title: "宝宝",
          name: "isBaby",
          width: 80,
          sortable: true
        },
        {
          title: "技能数",
          name: "skill",
          width: 80,
          align: "center",
          sortable: true
        },
        {
          title: "成长",
          name: "growth",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "当前价值",
          name: "value",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "获得时间",
          name: "time",
          width: 200,
          align: "center",
          sortable: true
        }
      ],
      obj: {
        name: "",
        isBaby: true,
        skill: "",
        growth: "",
        value: "",
        time: ""
      },
      list: [],
      user: null,
      page: 1,
      size: 12,
      itemTotal: 0,
      viewType: "",
      loading: true //因为服务器得了链接速度问题，按钮尽可能还是加上加载状态比较好
    };
  },
  filters: {
    ftmDate: d => {
      let st = new Date(d / 1000 / 1000);
      return st.toLocaleString();
    },
    mapName: type => {
      let name = "";
      switch (type) {
        case "01":
          name = "D5";
          break;

        case "02":
          name = "须弥东界";
          break;
        case "03":
          name = "银华镜";
          break;
        case "04":
          name = "鬼市";
          break;
        case "05":
          name = "小西天（雷音寺）";
          break;
      }
      return name;
    }
  },
  created() {
    this.addType = this.$route.query.type;
    switch (this.addType) {
      case "01":
        this.currentBaby = this.d5Baby;
        break;
      case "02":
        this.currentBaby = this.djBaby;
        break;
      case "03":
        this.currentBaby = this.yhjBaby;
        break;
      case "04":
        this.currentBaby = this.gsBaby;
        break;
      case "05":
        this.currentBaby = this.xtBaby;
        break;
    }
  },

  mounted() {
    this.tweenUpdate();
    this.user = JSON.parse(localStorage.userInfo);
    this.list = [];
    this.initList(1);
  },
  methods: {
    initList(page) {
      this.page = page;
      GetSis(this.user.uid, this.addType, this.page, this.size).then(res => {
        // this.list = this.list.concat(res.data.list);
        this.list = res.data.list;
        // this.list.push(res.data.list);
        console.log(this.list.length);
        this.itemTotal = res.data.total;
        this.tweenedTotal = res.data.money;
        this.total = res.data.money;
      });
    },

    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) =>
        order === "asc" ? a[name] - b[name] : b[name] - a[name]
      );
    },
    pageChange(e) {
      this.initList(e);
    },
    ensureAddObj() {
      this.obj.time = new Date().toLocaleString();
      /* 环装的特殊处理 因为没名字 */
      if (this.viewType == "06") {
        this.obj.name = this.obj.eLvl + this.obj.eType;
      }

      if (this.viewType == "07") {
        this.obj.name += "卡";
      }
      this.obj.type = this.addType;
      if (!this.obj.value) {
        this.$toast.warning("物品当前价值必填");
        return;
      }
      this.obj.value = parseInt(this.obj.value);
      this.obj.eventtype = "收入";

      AddSi(this.user.uid, this.obj).then(res => {
        if (res.code == "200") {
          this.$toast.success("添加成功");
          this.initList(this.page);
        }
      });
      this.dialogOpen = false;
      this.total += parseInt(this.obj.value);

      // this.$tween.fade(
      //   { total: this.total },
      //   { total: this.total + parseInt(this.obj.value) },
      //   2000,
      //   value => {
      //     this.tweenedTotal = parseInt(value.total).toFixed(0);
      //   },
      //   () => {
      //     this.total += parseInt(this.obj.value);
      //     console.log(this.total);
      //     this.resetObj();
      //   }
      // );
    },
    closeDialog() {
      this.resetObj();
      this.dialogOpen = false;
    },
    resetObj() {
      this.obj = {
        name: "",
        isBaby: true,
        skill: "",
        growth: "",
        value: "",
        time: "",
        eType: "", //环装类型
        eLvl: "" //环装等级
      };
    },
    /* 这个是添加时候的弹窗，要根据传递的type判断展示哪个div */
    openAddDialog(type) {
      console.log(type);
      this.viewType = type;
      this.resetObj();
      //   switch(type){

      //   }
      this.dialogOpen = true;
      this.addShow = false;
    },
    tweenUpdate() {
      requestAnimationFrame(this.tweenUpdate);
      this.$tweener.update();
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
    min-width: 720px;
    @extend %col;
    justify-content: flex-start;
    padding: 15rpx;
    position: relative;
    .add {
      position: absolute;
      right: -35px;
      top: 50px;
      z-index: 100;
    }
    .add-dialog-container {
      @extend %row;
      width: 100%;
      height: auto;
      justify-content: flex-start;
      flex-wrap: wrap;
      div > .col {
        @extend %row;
        justify-content: flex-start !important;
        height: 50px;
      }
    }
    .add-container {
      @extend %col;
      justify-content: space-around;
      align-content: center;
      width: 100px;
      height: 200px;
      position: absolute;
      right: -135px;
      top: 50px;
      z-index: 200;
    }
    .title {
      @extend %row;
      justify-content: flex-start;
      width: 100%;
      padding: 20px 0 10px 0;
      margin-bottom: 20px;
      border-bottom: #f5f5f5 2px solid;
      .name {
        font-size: 20px;
        padding-left: 20px;
      }
      .total {
        font-size: 24px;
        color: #f40;
      }
    }
  }
}
</style>
