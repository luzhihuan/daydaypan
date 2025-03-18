<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <el-form
          class="login-register"
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          @submit.prevent>
        <div class="login-title">天天云盘</div>

        <!--          邮箱输入-->
        <el-form-item prop="email">
          <el-input
              clearable
              size="large"
              placeholder="请输入邮箱"
              v-model="formData.email"
              maxlength="150"
          >
            <!--            插槽  前面的icon图标-->
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <!--          密码输入-->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
              type="password"
              size="large"
              placeholder="请输入密码"
              v-model.trim="formData.password"
              show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>

        <!--注册-->
        <div v-if="opType == 0 || opType == 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                  size="large"
                  placeholder="请输入邮箱验证码"
                  v-model.trim="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button
                  class="send-email-btn"
                  type="primary"
                  size="large"
                  @click="getEmailCode"
              >
                获取验证码
              </el-button>
            </div>
            <el-popover placement="left" :width="500" trigger="click">
              <div>
                <p>在垃圾箱中查找邮箱验证码</p>
              </div>
              <template #reference>
                <span class="a-link" :style="{'font-size':'14px'}">未收到邮箱验证码?</span>
              </template>
            </el-popover>
          </el-form-item>
          <!--          昵称-->
          <el-form-item prop="nickName" v-if="opType==0">
            <el-input
                size="large"
                placeholder="请输入昵称"
                v-model.trim="formData.nickName"
                maxlength="20"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <!--          密码-->
          <el-form-item prop="registerPassword">
            <el-input
                type="password"
                size="large"
                placeholder="请输入密码"
                v-model.trim="formData.registerPassword"
                show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="reRegisterPassword">
            <el-input
                type="password"
                size="large"
                placeholder="请再次输入密码"
                v-model.trim="formData.reRegisterPassword"
                show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>


        <!--        验证码-->
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
                size="large"
                placeholder="请输入验证码"
                v-model.trim="formData.checkCode"
                @keyup.enter="doSubmit"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <div @click="loadCheckCode(0)">
              <img :src="checkCodeUrl"/>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="opType==1">
          <div class="rememberme-panel">
            <el-checkbox v-model.trim="formData.remembrMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码?</a>
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">没有账号?</a>
          </div>
        </el-form-item>
        <el-form-item v-if="opType==0">
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号?</a>
          </div>
        </el-form-item>
        <el-form-item v-if="opType==2">
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登陆?</a>
          </div>
        </el-form-item>
        <!--        按钮-->
        <el-form-item>
          <el-button
              type="primary"
              class="op-btn"
              size="large"
              @click="doSubmit">
            <span v-if="opType==0">注册</span>
            <span v-if="opType==1">登录</span>
            <span v-if="opType==2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <Dialog
        :show="dialogConfig4SendMailCode.show"
        :title="dialogConfig4SendMailCode.title"
        :buttons="dialogConfig4SendMailCode.buttons"
        width="500px"
        :showCancel="false"
        @close="dialogConfig4SendMailCode.show=false"
    >
      <el-form
          :model="formData4SendMailCode"
          :rules="rules"
          ref="formData4SendMailCodeRef"
          label-width="80px"
          @submit.prevent>
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input
                size="large"
                placeholder="请输入验证码"
                v-model.trim="formData4SendMailCode.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
                :src="checkCodeEmailUrl"
                class="check-code"
                @click="changeCheckCode(1)"
            />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<!--123456789@qq.com-->
<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import md5 from 'js-md5'
import Dialog from "@/components/Dialog.vue";

const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const rules = {
  email: [
    {required: true, message: '请输入正确的邮箱', trigger: 'blur'},
    {validator: proxy.Verify.email, message: '请输入正确的邮箱', trigger: 'blur'}
  ],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
  emailCode: [{required: true, message: '请输入邮箱验证码', trigger: 'blur'}],
  nickName: [{required: true, message: '请输入昵称', trigger: 'blur'}],
  registerPassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: proxy.Verify.password, message: '密码只能是数字,字母,特殊字符8~18位', trigger: 'blur'}
  ],
  reRegisterPassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: checkRePassword, message: '两次输入的密码不一致', trigger: 'blur'}
  ],
  checkCode: [{required: true, message: '请输入图片验证码', trigger: 'blur'}],
}

// 验证码
// const checkCodeUrl4SendMailCode = ref('')
const checkCodeEmailUrl = ref('')
// 验证码处理逻辑
const checkCodeUrl = ref('')
const checkCodeKey = ref('')

const loadCheckCode = async (type) => {
  let result = await proxy.Request({
    url: proxy.Api.checkCode,
    params: {
      type: type,
    }
  })
  if (!result) {
    return;
  }
  if (type == null || type == 0) {
    proxy.VueCookies.set('checkCodeKey', result.data.checkCodeKey)
    checkCodeUrl.value = result.data.checkCode
  } else {
    proxy.VueCookies.set('checkCodeEmailKey', result.data.checkCodeKey)
    checkCodeEmailUrl.value = result.data.checkCode
  }
}


//获取邮箱验证码
const getEmailCode = () => {
  formDataRef.value.validateField('email', async (valid) => {
    if (!valid) {
      return
    }
    dialogConfig4SendMailCode.show = true
    nextTick(() => {
      //更换验证码
      changeCheckCode(1)
      // 清空上次输入的验证码
      formData4SendMailCodeRef.value.resetFields()
      formData4SendMailCode.value = {
        email: formData.value.email
      }
    })
  })
}
// 更换验证码
const changeCheckCode = (type) => {
  if (type === 0) {
    loadCheckCode(0)
  } else {
    loadCheckCode(1)
  }
}

// 操作类型  0:注册 1:登录 2:重置密码
const opType = ref(1)
const showPanel = (type) => {
  opType.value = type
  if (type === 0) { // 注册
    loadCheckCode(0)
  } else if (type === 1) { // 登录
    loadCheckCode(1)
  } else if (type === 2) { // 重置密码
    loadCheckCode(2)
  }
  restForm()
}

onMounted(() => {
  showPanel(1)
})

const formData4SendMailCode = ref({})
const formData4SendMailCodeRef = ref()
//发送邮箱验证码弹窗
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: '发送邮箱验证码',
  buttons: [
    {
      type: 'primary',
      text: '发送验证码',
      click: (e) => {
        sendEmailCode()
      }
    }
  ]
})

//发送邮箱验证码
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    const params = Object.assign({}, formData4SendMailCode.value)
    params.type = opType.value == 0 ? 0 : 1
    params.checkCodeKey = proxy.VueCookies.get('checkCodeEmailKey')
    let result = await proxy.Request({
      url: proxy.Api.sendEmailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode(1)
      }
    })
    if (!result) {
      return
    }
    proxy.Message.success('验证码发送成功，请登录邮箱查看')
    dialogConfig4SendMailCode.show = false
  })
}
//重置表单
const restForm = () => {
  changeCheckCode(0)
  formData.value = {}
  formDataRef.value.resetFields()
  //登录
  if (opType.value == 1) {
    const cookieLoginInfo = proxy.VueCookies.get('loginInfo')
    if (cookieLoginInfo) {
      formData.value = cookieLoginInfo
    }
  }
}
//提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    //注册 找回密码
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword
      params.checkCodeKey = proxy.VueCookies.get('checkCodeKey')
      delete params.registerPassword
      delete params.reRegisterPassword
    }
    //登录
    if (opType.value == 1) {
      params.checkCodeKey = proxy.VueCookies.get('checkCodeKey')
      let cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password
      if (params.password !== cookiePassword) {
        params.password = md5(params.password)
      }
    }
    let url = null
    if (opType.value == 0) {
      url = proxy.Api.register
    } else if (opType.value == 1) {
      url = proxy.Api.login
    } else if (opType.value == 2) {
      url = proxy.Api.resetPwd
    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0)
      }
    })
    if (!result) {
      return
    }
    if (opType.value == 0) {
      proxy.Message.success('注册成功，请登录')
      showPanel(1)
    } else if (opType.value == 1) {
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe
        }
        proxy.VueCookies.set('loginInfo', loginInfo, '7d')
      } else {
        proxy.VueCookies.remove('loginInfo')
      }
      proxy.Message.success('登录成功')
      //存储cookies
      proxy.VueCookies.set('userInfo', result.data, 0)
      proxy.VueCookies.set('token', result.data.token, 0)
      //重定向到原始页面
      const redirectUrl = route.query.redirectUrl || '/main/all'
      router.push(redirectUrl)
    } else if (opType.value == 2) {
      proxy.Message.success('重置密码成功，请登录')
      showPanel(1)
    }
  })
}
</script>

<style lang="scss" scoped>
.login-body {
  height: calc(100vh);
  background-size: cover;
  background: url("../assets/login_bg.jpg");
  display: flex;

  .bg {
    flex: 1;
    background-size: cover;
    background-position: center;
    background-size: 800px;
    background-repeat: no-repeat;
    mix-blend-mode: multiply; // 调整混合模式以显示底层背景
    opacity: 0.8;
    background-image: url("../assets/login_img.png");
  }

  .login-panel {
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);

    .login-register {
      padding: 25px;
      background: #fff;
      border-radius: 5px;

      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .send-email-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .send-email-btn {
          margin-left: 5px;
        }
      }

      .rememberme-panel {
        width: 100%;
      }

      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .op-btn {
        width: 100%;
      }
    }
  }

  .check-code-panel {
    width: 100%;
    display: flex;

    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .login-btn-qq {
    margin-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      cursor: pointer;
      margin-left: 10px;
      width: 20px;
    }
  }
}
</style>