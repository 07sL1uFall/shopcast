<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="el-nav" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="addBtn" type="success" plain @click="showAdd">添加用户</el-button>
    <!-- 表格 -->
    <!--
      el-table 整个表格
      el-table-column 一列
        prop 配置对象的键名即可填入数据
        label 配置一列的th的名字
     -->
    <el-table
      :data="userList"
      style="width: 100%">

      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column label="用户状态">
        <!-- 在obj中可以拿到 row, column, $index 和 store的数据 -->
        <template v-slot:default="obj">
          <!-- {{ obj.row }} 是单条遍历的数据 -->
          <el-switch @change="changeState(obj.row)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot:default = "obj">
          <el-button plain size="small" icon="el-icon-edit" type="primary" @click="showEditUser(obj.row)"></el-button>
          <el-button plain size="small" icon="el-icon-delete" type="danger" @click='delUser(obj.row.id)'></el-button>
          <el-button plain size="small" icon="el-icon-check" type="success">分配角色</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref="form" status-icon :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" required></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" required type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editVisible">
      <el-form ref="editForm" status-icon :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" placeholder="请输入密码" required type="password" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '', // 搜索条件
      pagenum: 1, // 当前页
      pagesize: 4, // 每页条数
      userList: [],
      total: 0,
      dialogFormVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度在3-12之间', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度在3-12之间', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    getUserList () {
      // axios.post(url, data, config).then(...)  data 是将来添加到请求体中的传参
      // axios.get(url, config).then(...)
      // get请求的参数需要配置在 config 的 params 中
      // 在config中可以 params 或者 请求头等额外的信息
      axios.get('http://localhost:8888/api/private/v1/users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        // console.log(res.data)
        const { meta, data } = res
        if (meta.status === 200) {
          this.userList = data.users
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      // console.log(id)
      try {
        await this.$confirm('确定要删除吗？', '提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    search () {
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      try {
        const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    showAdd () {
      this.dialogFormVisible = true
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 创建成功
          // 隐藏模态框。重置form内容，转到最后一页让他看新加的东西
          this.dialogFormVisible = false
          this.total++
          // 重置表单
          this.$refs.form.resetFields()
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 显示修改用户信息的模态框
    showEditUser (row) {
      this.editVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 修改用户信息
    async editUser () {
      const { id, email, mobile } = this.editForm
      // 先等待校验，校验完成后再发送ajax
      await this.$refs.editForm.validate()
      const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.editVisible = false
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-nav{
  line-height: 3
}
hr {
  margin-bottom: 10px
}
.input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
</style>
