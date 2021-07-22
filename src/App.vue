<template>
  <div id="app">
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="drawerOpen = true">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <mu-button icon slot="left" @click="gotoPage('/')">
        <mu-icon value="home"></mu-icon>
      </mu-button>
      梦幻西游统计工具
      <mu-button v-if="userInfo != null" flat slot="right" @click="namePress">{{
        userInfo.nickname
      }}</mu-button>
      <!-- <mu-button
        v-if="userInfo != null"
        slot="right"
        flat
        color="warning"
        @click="logout"
        >登出</mu-button
      > -->
      <mu-button v-else flat slot="right" @click="loginPress">登 录</mu-button>
    </mu-appbar>
    <router-view id="nav" :key="mapType"></router-view>
    <mu-drawer :open.sync="drawerOpen" :docked="docked">
      <mu-list>
        <mu-list-item button @click="gotoPage('/map', '01')">
          <mu-list-item-title>D5统计</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="gotoPage('/map', '02')">
          <mu-list-item-title>东界统计</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="gotoPage('/map', '03')">
          <mu-list-item-title>银华镜统计</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="gotoPage('/map', '04')">
          <mu-list-item-title>鬼市统计</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="gotoPage('/map', '05')">
          <mu-list-item-title>小西天（雷音寺）统计</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button @click="gotoPage('/circle', '10')">
          <mu-list-item-title>跑环统计</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button>
          <mu-list-item-title>其他统计</mu-list-item-title>
        </mu-list-item>
        <!-- <mu-list-item @click="open = false" button>
          <mu-list-item-title>Close</mu-list-item-title>
        </mu-list-item> -->
      </mu-list>
    </mu-drawer>
    <mu-dialog
      title="使用此工具前的提示"
      width="600"
      max-width="80%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="openTip"
    >
      本工具纯属个人需要制作的一个工具，现公开分享给大家，希望大家喜欢；
      <br />工具登录码由系统提供，不会要求用户输入帐号密码相关内容；
      <br />大家在使用过程中请勿输入任何个人/游戏帐号信息，本工具也不需要大家提供这些信息，请放心使用。
      <br />
      <mu-button slot="actions" flat color="primary" @click="agreePress"
        >同意</mu-button
      >
    </mu-dialog>
    <mu-dialog
      title="系统自动生成帐号密码"
      width="600"
      max-width="80%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="genDialog"
    >
      为你自动生成的登录码为：
      <br />
      登录码：{{ genCode
      }}<span
        class="copy"
        v-clipboard:copy="genCode"
        v-clipboard:success="onCopy"
        >复制</span
      >
      <br />请牢记登录码，最好是保存到电脑/手机上。
      <mu-button slot="actions" flat color="primary" @click="genDialog = false"
        >我记住了！</mu-button
      >
    </mu-dialog>
    <mu-dialog title="登 录" width="560" :open.sync="loginDialog">
      <mu-form ref="form" :model="validateForm" class="mu-demo-form">
        <!-- <mu-form-item
          label="昵称"
          help-text="帮助文字"
          prop="username"
          :rules="usernameRules"
        >
          <mu-text-field
            v-model="validateForm.username"
            prop="username"
          ></mu-text-field>
        </mu-form-item> -->
        <mu-form-item label="登录码" prop="password" :rules="passwordRules">
          <mu-text-field
            type="text"
            v-model="validateForm.password"
            prop="password"
          ></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="isAgree" :rules="argeeRules">
          还没有登录码？
          <mu-button flat color="primary" @click="getGenUser"
            >点我生成一个</mu-button
          >
        </mu-form-item>
        <mu-form-item prop="isAgree" :rules="argeeRules">
          <mu-checkbox
            label="同意用户协议"
            v-model="validateForm.isAgree"
          ></mu-checkbox>
        </mu-form-item>
      </mu-form>
      <mu-button slot="actions" flat color="default" @click="closeLoginDialog"
        >关 闭</mu-button
      >
      <mu-button slot="actions" flat color="primary" @click="submit"
        >登 录</mu-button
      >
    </mu-dialog>
    <mu-dialog title="修改昵称" width="420" :open.sync="nickDialog">
      昵称仅限修改一次
      <mu-text-field
        v-model="nickName"
        placeholder="请输入昵称（10个字以内）"
        :error-text="nickNameSetError"
      ></mu-text-field>
      <mu-button slot="actions" flat @click="closeLoginDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="ensureSetNickName"
        >确定</mu-button
      >
    </mu-dialog>
  </div>
</template>
<script>
import { getCode, login, setNickName } from "@/api/user.js";
export default {
  data() {
    return {
      key: "",
      loginDialog: false,
      openTip: false,
      genDialog: false,
      docked: false,
      drawerOpen: false,
      genCode: "", //请求接口生成的登录码
      mapType: "",
      userInfo: null,
      nickDialog: false,
      nickNameSetError: "",
      nickName: "",
      // usernameRules: [
      //   { validate: val => !!val, message: "必须填写用户名" },
      //   { validate: val => val.length >= 3, message: "用户名长度大于3" }
      // ],
      passwordRules: [
        { validate: val => !!val, message: "必须填写登录码" },
        {
          validate: val => val.length == 24,
          message: "登录码不正确"
        }
      ],
      argeeRules: [{ validate: val => !!val, message: "必须同意用户协议" }],
      validateForm: {
        password: "",
        isAgree: true
      }

      // genUser: {
      //   username: "dasda",
      //   pwd: "dasdsdasda"
      // }
    };
  },
  created() {},
  mounted() {
    let user = localStorage.userInfo;
    if (user) {
      this.userInfo = JSON.parse(user);
    }
  },
  methods: {
    loginPress() {
      console.log(localStorage.agree);
      if (localStorage.agree == 1) {
        this.loginDialog = true;
      } else {
        this.openTip = true;
      }
    },

    agreePress() {
      this.openTip = false;
      this.loginDialog = true;
      localStorage.agree = 1;
    },
    /* 点击生成的时候，会向服务器请求，生成一个帐号密码 */
    getGenUser() {
      getCode()
        .then(res => {
          this.genCode = res.data;
        })
        .catch(e => {
          console.log(e);
        });
      this.genDialog = true;
    },
    onCopy() {
      this.$toast.success("登录码已复制到剪切板");
    },
    closeLoginDialog() {
      this.loginDialog = false;
      this.nickDialog = false;
    },
    /* 未修改名字的时候，可以点击，修改一次姓名 */
    namePress() {
      if (!this.userInfo.nickset) {
        this.nickDialog = true;
      }
    },
    ensureSetNickName() {
      if (this.nickName.length < 1) {
        this.nickNameSetError = "请输入正确格式的昵称";
        return;
      }
      if (this.nickName.length > 10) {
        this.nickNameSetError = "请输入正确格式的昵称";
        return;
      }
      let data = {
        uid: this.userInfo.code,
        nickname: this.nickName
      };
      setNickName(data).then(res => {
        if (res.code == 200) {
          this.nickDialog = false;
          this.userInfo = res.data;
          localStorage.userInfo = JSON.stringify(res.data);
          this.$router.go(0);
        } else {
          this.nickNameSetError = res.msg;
        }
      });
    },
    gotoPage(str, type) {
      this.mapType = type;
      this.$router.push({ path: str, query: { type: type } });
      this.drawerOpen = false;
    },
    submit() {
      this.$refs.form.validate().then(result => {
        if (result) {
          //验证成功后，讲验证的code复制给gencode
          this.genCode = this.validateForm.password;
          login(this.genCode)
            .then(res => {
              if (res.code == 5001) {
                this.$toast.error(res.msg);
                return;
              }
              this.userInfo = res.data;
              localStorage.userInfo = JSON.stringify(this.userInfo);
              this.loginDialog = false;
            })
            .catch(e => {
              console.log(e);
            });
        }
      });
    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        username: "",
        password: "",
        isAgree: false
      };
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 720px;
}
.copy {
  color: #0091ea;
  font-size: 22px;
  margin-left: 20px;
  cursor: pointer;
}

#nav {
  padding: 30px;
  @extend %row;
  justify-content: center;
  width: 100%;
  min-width: 720px;
  height: 100%;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
