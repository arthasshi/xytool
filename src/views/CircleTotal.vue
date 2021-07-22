<template>
  <div class="home">
    <mu-paper class="data" :z-depth="3">
      <div class="title">
        <div class="name">牟利场景：</div>
        <div class="total">跑环</div>
        <div class="name">今日总牟利：</div>
        <div class="total">{{ tweenedTotal }}&nbsp;W</div>
      </div>
      <mu-button fab large color="teal" class="add" @click="addShow = !addShow">
        <mu-icon value="add"></mu-icon>
      </mu-button>
      <mu-slide-right-transition>
        <div class="add-container" v-show="addShow">
          <mu-button small color="primary" @click="openAddDialog('01')"
            >支出</mu-button
          >
          <mu-button small color="primary" @click="openAddDialog('02')"
            >收入</mu-button
          >
          <mu-button
            v-if="appleValue == 0"
            small
            color="primary"
            @click="openAddDialog('03')"
            >果子+1</mu-button
          >
          <mu-button
            v-else
            small
            color="primary"
            @click="addApple('03')"
            :disabled="upping"
            >果子+1</mu-button
          >
        </div>
      </mu-slide-right-transition>
      <mu-dialog title="添加" width="720" :open.sync="dialogOpen">
        <!-- 环装 -->
        <div class="add-dialog-container" v-if="viewType == '01'">
          <mu-row gutter>
            <mu-col span="6">
              <mu-select label="支出" v-model="obj.name">
                <mu-option
                  v-for="item in equptList"
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
        <!-- 书铁 -->
        <div class="add-dialog-container" v-else-if="viewType == '02'">
          <mu-row>
            <mu-col span="12">
              <mu-radio
                v-for="item in lvls"
                :key="item"
                :value="item"
                v-model="obj.lvl"
                :label="item"
                style="margin-right:20px"
              ></mu-radio>
            </mu-col>
          </mu-row>
          <mu-row></mu-row>
          <mu-row gutter>
            <mu-col span="6">
              <mu-radio
                :value="'书'"
                v-model="obj.shutie"
                :label="'书'"
              ></mu-radio>
              <mu-radio
                :value="'铁'"
                v-model="obj.shutie"
                :label="'铁'"
              ></mu-radio>
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
        <!-- 修炼果 -->
        <div class="add-dialog-container" v-else-if="viewType == '03'">
          <mu-row gutter>
            <mu-col span="6">
              <div>第一次添加修炼果，请先设置价值</div>
            </mu-col>
            <mu-col span="6">
              <mu-text-field
                v-model="appleValue"
                label="当前价值"
                suffix="w梦幻币"
                label-float
              ></mu-text-field>
            </mu-col>
          </mu-row>
        </div>

        <mu-button
          v-if="viewType == '03'"
          slot="actions"
          flat
          color="primary"
          @click="closeDialog"
          >确定</mu-button
        >
        <mu-button
          v-else
          slot="actions"
          flat
          color="primary"
          @click="ensureAddObj"
          >确定</mu-button
        >
        <mu-button slot="actions" flat color="defalut" @click="closeDialog"
          >关闭</mu-button
        >
      </mu-dialog>
      <mu-data-table
        border
        :columns="columns"
        :sort.sync="sort"
        @sort-change="handleSortChange"
        :data="list"
      >
        <template slot-scope="scope">
          <td>{{ scope.row.type }}</td>
          <td class="is-right">
            {{ scope.row.name }}
          </td>
          <td class="is-right">{{ scope.row.value }}</td>
          <td class="is-right">{{ scope.row.time |ftmDate}}</td>
        </template>
      </mu-data-table>
    </mu-paper>
  </div>
</template>

<script>
import { AddSi, GetSis } from "@/api/data.js";
export default {
  data() {
    return {
      total: 0,
      addType: "",
      tweenedTotal: 0,
      addShow: false,
      dialogOpen: false,
      upping: false,
      sort: {
        name: "",
        order: "asc"
      },

      equptList: [
        "60武器",
        "60装备",
        "70武器",
        "70装备",
        "80武器",
        "80装备",
        "变异",
        "花",
        "乐器"
      ],
      lvls: [90, 100, 110, 120, 130, 140, 150, "战魄"],

      columns: [
        { title: "收/支", width: 130, name: "type" },
        {
          title: "类别",
          name: "name",
          width: 250,
          align: "center",
          sortable: true
        },

        {
          title: "当前价值",
          name: "value",
          width: 126,
          align: "center",
          sortable: true
        },
        {
          title: "发生时间",
          name: "time",
          width: 200,
          align: "center",
          sortable: true
        }
      ],
      obj: {
        name: "",
        eventtype: "",
        value: "",
        time: "",
        shutie: "",
        lvl: ""
      },
      list: [],
      user: null,
      page: 1,
      size: 12,
      itemTotal: 0,
      viewType: "",
      appleValue: 0 //修炼果的价值
    };
  },
  filters: {
    ftmDate: d => {
      let st = new Date(d / 1000 / 1000);
      return st.toLocaleString();
    },
  },
  //   filters: {
  //     mapName: type => {
  //       let name = "";
  //       switch (type) {
  //         case "01":
  //           name = "D5";
  //           break;

  //         case "02":
  //           name = "须弥东界";
  //           break;
  //         case "03":
  //           name = "银华镜";
  //           break;
  //         case "04":
  //           name = "鬼市";
  //           break;
  //         case "05":
  //           name = "小西天（雷音寺）";
  //           break;
  //       }
  //       return name;
  //     }
  //   },
  created() {
    this.addType = this.$route.query.type;
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
    ensureAddObj() {
      this.upping = true;
      this.obj.time = new Date().toLocaleString();
      if (this.viewType == "02") {
        this.obj.eventtype = "收入";
        this.obj.name = `${this.obj.lvl}级${this.obj.shutie}`;
      } else if (this.viewType == "03") {
        this.obj.eventtype = "收入";
      } else {
        this.obj.eventtype = "支出";
        this.obj.value = -this.obj.value;
      }

      this.obj.type = this.addType;
      if (!this.obj.value) {
        this.$toast.warning("物品当前价值必填");
        return;
      }
      this.obj.value = parseInt(this.obj.value);

      AddSi(this.user.uid, this.obj).then(res => {
        if (res.code == "200") {
          this.$toast.success("添加成功");
          this.initList(this.page);
        }
      });
      this.dialogOpen = false;

      this.$tween.fade(
        { total: this.total },
        { total: this.total + parseInt(this.obj.value) },
        1000,
        value => {
          this.tweenedTotal = parseInt(value.total).toFixed(0);
        },
        () => {
          this.upping = false;
          this.total += parseInt(this.obj.value);
          console.log(this.total);
          this.resetObj();
        }
      );
    },
    closeDialog() {
      this.resetObj();
      this.dialogOpen = false;
    },
    resetObj() {
      this.obj = {
        type: "",
        name: "",
        value: "",
        time: ""
      };
    },
    /* 添加一个修炼果 */
    addApple(type) {
      this.viewType = type;
      if (this.appleValue == 0) {
        this.dialogOpen = true;
        return;
      }
      this.obj = {
        type: "收入",
        name: "修炼果",
        value: parseInt(this.appleValue),
        time: ""
      };
      this.ensureAddObj();
    },
    /* 这个是添加时候的弹窗，要根据传递的type判断展示哪个div */
    openAddDialog(type) {
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
