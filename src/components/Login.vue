<template>
  <div class="login">
    <img src="../assets/avatar.jpg" alt="">
    <el-form ref="form" :rules="rules" status-icon :model="form" label-width="80px">
      <el-form-item label="用户名" prop='username'>
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input placeholder="请输入密码" v-model="form.password" type='password'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(isValid => {
        if (!isValid) return
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
          const { meta } = res.data
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: 'success',
              duration: 1000
            })
            this.$router.push('/index')
          } else {
            this.$message.error(meta.msg)
          }
        })
      })
    },
    reset () {
      console.log(this.$refs.form.resetFields())
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding : 0
}
.login {
  width: 100%;
  height: 1000px;
  background-color: #2d434c;
  overflow: hidden;
  position: relative;
  .el-form {
      width: 400px;
      background-color: #fff;
      padding :20px;
      padding-top: 75px;
      margin : 0 auto;
      margin-top: 200px;
      border-radius: 20px;
    }
  img {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    top: 135px;
    border-radius: 50%;
    border: 3px solid #fff;
  }
}
</style>
