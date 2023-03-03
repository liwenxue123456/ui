<template>
  <div>
    <el-button @click="addFormBox = true" type="primary" plain><i class="el-icon-circle-plus"></i>&nbsp;&nbsp;&nbsp;&nbsp;添加员工
    </el-button>
    <el-button @click="removeMore()" type="danger" plain><i class="el-icon-delete-solid"></i>&nbsp;&nbsp;&nbsp;&nbsp;删除选中
    </el-button>
    <el-table
      :data="pageTableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="科室编号" prop="organId"/>
      <el-table-column label="机构名称" prop="organName"/>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input  v-model="organ.organName" placeholder="输入关键字搜索"/>
          <el-button
            @click="searchByKey"
            type="primary"
            icon="el-icon-search"
            plain
          >&nbsp;&nbsp;查询
          </el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain @click="handleEdit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[7, 14, 21, 28, 35]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align: right"
    >
    </el-pagination>
    <!--  添加-->
    <el-dialog title="添加机构" :visible.sync="addFormBox" @closed="clear('organ')">
      <el-form ref="organ" :model="organ" :rules="rules">
        <el-form-item label="科室ID" :label-width="formLabelWidth" prop="organId">
          <el-input v-model.number="organ.organId"></el-input>
        </el-form-item>
        <el-form-item label="科室名字" :label-width="formLabelWidth" prop="organName">
          <el-input v-model="organ.organName"></el-input>
        </el-form-item>
        <!--      <el-form-item label="所属部门" :label-width="formLabelWidth" prop="deptNo">-->
        <!--        <el-select v-model="empForm.deptNo" placeholder="请选择所属部门">-->
        <!--          <el-option v-for="dept in deptS" :label="dept.dname" :value="dept.deptNo" :key="dept.deptNo"></el-option>-->
        <!--        </el-select>-->
        <!--      </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="addEmp('organ')">添加</el-button>
        <el-button @click="addFormBox = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改员工信息" :visible.sync="updFormBox" @closed="clear('organ')">
      <el-form ref="organ" :model="organ" :rules="rules">
        <el-form-item label="机构Id" :label-width="formLabelWidth" prop="organId">
          <el-input v-model.number="organ.organId"></el-input>
        </el-form-item>
        <el-form-item label="机构名字" :label-width="formLabelWidth" prop="organName">
          <el-input v-model="organ.organName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="updEmp('organ')">修改</el-button>
        <el-button @click="updFormBox = false">取消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
export default {
  name: "Dept",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      search: "",
      addFormBox: false,
      updFormBox: false,
      organ: {
        organId: "",
        organName: "",
      },
      formLabelWidth: '100px',
      currentPage: 1,
      total: 0,
      pageSize: 7,
      pageTableData: [],
      totalPages: 0,
    }

  },
  methods: {
    getData() {
      var vm = this;
      this.axios({
        method: 'get',
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_jgxx",
      }).then(function (res) {
        vm.tableData = res.data;
        vm.getPageInfo();
      });
    },
    searchByKey() {
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/findByCondition",
        method: "get",
        params: {
          organName: vm.organ.organName,
        },
      })
        .then(function (res) {
          vm.tableData = res.data;
          vm.getPageInfo();
        })
        .catch(function () {
          vm.$message.error("查询失败");
        });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPageInfo();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getPageInfo();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getPageInfo() {
      this.total = this.tableData.length;
      this.totalPages =
        this.total % this.pageSize == 0
          ? this.total / this.pageSize
          : parseInt(this.total / this.pageSize) + 1;
      if (this.currentPage > this.totalPages) {
        this.handleCurrentChange(this.currentPage - 1);
      }
      this.pageTableData = [];
      for (let i = (this.currentPage - 1) * this.pageSize; i < this.total; i++) {
        this.pageTableData.push(this.tableData[i]);
        if (this.pageTableData.length === this.pageSize) {
          break;
        }
      }
    },
    handleEdit(row) {
      this.updFormBox = true;
      var vm = this;
      this.axios({
        method: 'get',
        url: 'http://localhost:8088/hygl/findOne?organId=' + row.organId,
      }).then(function (res) {
        vm.organ.organId = res.data.organId;
        vm.organ.organName = res.data.organName;

      });
    },
    updEmp(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: 'http://localhost:8088/hygl/update',
            data: {
              organId: vm.organ.organId,
              organName: vm.organ.organName,
            }
          }).then(function (res) {
            if (res.data === 1) {
              vm.$message.success('修改成功');
              vm.getData();
              vm.updFormBox = false;
              vm.clear(formName);
            } else {
              vm.$message.error('修改失败');
            }
          }).catch(function () {
            vm.$message.error('修改失败');
          })
        } else {
          this.$message.error('格式有误');
          return false;
        }
      });
    },
    clear(formName) {
      this.$refs[formName].resetFields();
    },
    addEmp(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        this.axios({
          method: 'post',
          url: 'http://localhost:8088/hygl/add',
          data: {
            organId: vm.organ.organId,
            organName: vm.organ.organName,
          }
        })
          .then(function (res) {
            if (res.data === 1) {
              vm.$message.success('添加成功');
              vm.getData();
              vm.addFormBox = false;
              vm.clear(formName);
            } else {
              vm.$message.error('添加失败');
            }
          }).catch(function () {
          vm.$message.error('添加失败');
        });
      });
    },
    handleDelete(row) {
      var vm = this;
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'get',
          url: 'http://localhost:8088/hygl/delete/?organId=' + row.organId,

        })
          .then(function (res) {
            if (res.data === 1) {
              vm.$message.success('删除成功');
              vm.getData();
            } else {
              vm.$message.error('删除失败');
            }
          }).catch(function () {
          vm.$message.error('删除失败');
        });
      });
    },
    removeMore() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('未选中数据');
        return false;
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var vm = this;
        var organIds = '';
        // var empNoss=empNos.charAt(empNos.length-1);
        for (let i = 0; i < this.multipleSelection.length; i++) {
          organIds += 'organId=' + this.multipleSelection[i].organId + '&';
        }
        this.axios({
          method: 'get',
          url: 'http://localhost:8088/hygl/deleteMove?' + organIds,
        }).then(function (res) {
          if (res.data > 0) {
            vm.$message.success('成功删除' + res.data + '条数据');
            vm.getData();
          } else {
            vm.$message.error('删除失败');
          }
        }).catch(function () {
          vm.$message.error('删除失败');
        });
      });
    },
  },

  created: function () {
    this.getData();
  }
};
</script>

<style scoped>

</style>
