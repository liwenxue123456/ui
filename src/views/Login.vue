<template>
  <div class="loginBox">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('form')" class="btn">로그인</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        var vm = this;
        if (valid) {
          this.axios({
            method: 'post',
            url: 'http://localhost:8088/login',
            data: {
              username: vm.form.username,
              password: vm.form.password
            }
          }).then(function (res) {
            if (res.data === 'success') {
              vm.$message.success('登录成功');
            } else {
              vm.$message.error('用户名或密码错误');
            }
          });
        } else {
          this.$message.error('用户名或密码格式错误');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.loginBox {
  width: 300px;
  height: 200px;
  margin: 200px auto;
  text-align: center;
  border: 2px solid #DCDFE6;
  border-radius: 20px;
  padding: 40px 42px 5px 10px;
  background-color: #F2F6FC;
  box-shadow: 0px 0px 30px #DCDFE6;
}

.btn {
  margin-top: 10px;
  margin-right: 42px;
}
</style>
