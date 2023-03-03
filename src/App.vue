<template>
  <div id="app">

    <el-container>
      <el-header>

      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
            class="el-menu-vertical-demo"
            background-color="#D9ECFF"
            active-text-color="#409EFF">
            <el-menu-item index="/">
              <i class="el-icon-user-solid"></i>
              <span slot="title">登录</span>
            </el-menu-item>
            <el-menu-item index="TimeTemplate">
              <i class="el-icon-postcard"></i>
              <span slot="title">时间段模板</span>
            </el-menu-item>
<!--            <el-menu-item index="TimesLot">-->
<!--              <i class="el-icon-postcard"></i>-->
<!--              <span slot="title">时间段详情</span>-->
<!--            </el-menu-item>-->
            <el-menu-item index="Scheduling">
              <i class="el-icon-postcard"></i>
              <span slot="title">排版模板</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app, .el-container {
  margin: 0;
  padding: 0;
  height: 100%;
}

.el-menu, .el-menu.el-menu--horizontal {
  border: none;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>
