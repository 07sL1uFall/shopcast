<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a @click="logout" href="javascript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">

          <el-submenu index="1">
            <!-- 配置导航的标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <!-- 配置展开的内容, 配置的路径, 将来会被当成绝对路径 -->
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <!-- 配置导航的标题 -->
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <!-- 配置展开的内容 -->
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>

            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>

  </el-container>
</template>

<script>

export default {
  methods: {
    logout () {
      this.$confirm('确定退出吗', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
html body {
    height: 100%;
}
.index {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      h1 {
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #545c64;
      }
    }
    .logout {
      width: 180px;
      text-align: right;
      font-weight: 700;
      height: 60px;
      line-height: 60px;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    height: 600px;
    .el-menu {
      border: none;
    }
  }
  .el-main {
    background-color: #ecf0f1;
  }
}

// 默认情况下, 单页应用程序中, 不同组件之间的样式, 会互相影响
// 解决方案:
// 1. 添加模块的类名包裹
// 2. 给 style标签, 添加scoped属性, 可以让样式只作用于当前组件的模板内容
// 如果希望当前的组件的样式, 只作用于当前组件, 可以添加上scoped属性

// 原理:
// 1. 给当前组件模板的所有元素, 都添加了一个自定义属性  data-v-82b7485c
// 2. 给当前所有 style 标签里面的样式选择器, 都添加上了一个 属性选择器
//       div {...}
//    => div[data-v-82b7485c]  {...}

// .index {
//   div {
//     background-color: pink;
//   }
// }

// div {
//   background-color: pink;
// }
</style>
