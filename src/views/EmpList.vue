<template>
  <div>
    &nbsp;&nbsp;
    <el-button @click="addFormBox = true" type="primary" plain><i class="el-icon-circle-plus"></i>&nbsp;&nbsp;&nbsp;&nbsp;添加员工
    </el-button>
    <el-button @click="removeMore()" type="danger" plain><i class="el-icon-delete-solid"></i>&nbsp;&nbsp;&nbsp;&nbsp;删除选中
    </el-button>
    <el-table
      :data="pageTableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="员工编号" prop="empNo"/>
      <el-table-column label="员工姓名" prop="ename"/>
      <el-table-column label="员工职位" prop="job"/>
      <el-table-column label="所属部门" prop="dept.dname"/>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="输入关键字搜索" @input="searchByKey()"/>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain @click="handleEdit(scope.row)">编辑信息</el-button>
          <el-button type="danger" icon="el-icon-delete" plain @click="handleDelete(scope.row)">删除信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align: right">
    </el-pagination>
    <el-dialog title="添加员工" :visible.sync="addFormBox" @closed="clear('empForm')">
      <el-form ref="empForm" :model="empForm" :rules="rules">
        <el-form-item label="员工编号" :label-width="formLabelWidth" prop="empNo">
          <el-input v-model.number="empForm.empNo"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="eName">
          <el-input v-model="empForm.eName"></el-input>
        </el-form-item>
        <el-form-item label="员工职业" :label-width="formLabelWidth" prop="job">
          <el-input v-model="empForm.job"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth" prop="deptNo">
          <el-select v-model="empForm.deptNo" placeholder="请选择所属部门">
            <el-option v-for="dept in deptS" :label="dept.dname" :value="dept.deptNo" :key="dept.deptNo"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="addEmp('empForm')">添加</el-button>
        <el-button @click="addFormBox = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改员工信息" :visible.sync="updFormBox" @closed="clear('empForm')">
      <el-form ref="empForm" :model="empForm" :rules="rules">
        <el-form-item label="员工编号" :label-width="formLabelWidth" prop="empNo">
          <el-input v-model.number="empForm.empNo"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="eName">
          <el-input v-model="empForm.eName"></el-input>
        </el-form-item>
        <el-form-item label="员工职业" :label-width="formLabelWidth" prop="job">
          <el-input v-model="empForm.job"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth" prop="deptNo">
          <el-select v-model="empForm.deptNo" placeholder="请选择所属部门">
            <el-option v-for="dept in deptS" :label="dept.dname" :value="dept.deptNo" :key="dept.deptNo"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="updEmp('empForm')">修改</el-button>
        <el-button @click="updFormBox = false">取消</el-button>
      </div>
    </el-dialog>
    <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpList",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      search: '',
      deptS: '',
      addFormBox: false,
      updFormBox: false,
      empForm: {
        empNo: '',
        eName: '',
        job: '',
        deptNo: ''
      },
      formLabelWidth: '100px',
      rules: {
        empNo: [
          {required: true, message: '请输入员工编号', trigger: 'blur'},
          {type: 'number', message: '员工编号必须为数字', trigger: 'blur'}
        ],
        eName: [
          {required: true, message: '请输入员工姓名', trigger: 'blur'},
          {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'}
        ],
        job: [
          {required: true, message: '请输入员工职位', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        deptNo: [
          {required: true, message: '请选择所属部门', trigger: 'change'}
        ]
      },
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageTableData: []
    };
  },
  methods: {
    addEmp(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: 'http://localhost:8088/addEmp',
            data: {
              empNo: vm.empForm.empNo,
              ename: vm.empForm.eName,
              job: vm.empForm.job,
              dept: {deptNo: vm.empForm.deptNo}
            }
          }).then(function (res) {
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
        } else {
          this.$message.error('格式有误');
          return false;
        }
      });
    },
    handleEdit(row) {
      this.updFormBox = true;
      this.organ.organId = row.organId, this.organ.organName = row.organName
    },
    updEmp(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: 'http://localhost:8088/modifyEmp',
            data: {
              empNo: vm.empForm.empNo,
              ename: vm.empForm.eName,
              job: vm.empForm.job,
              dept: {deptNo: vm.empForm.deptNo}
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
    handleDelete(row) {
      var vm = this;
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'get',
          url: 'http://localhost:8088/removeEmp?empNo=' + row.empNo,
        }).then(function (res) {
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
        var empNos = '';
        // var empNoss=empNos.charAt(empNos.length-1);
        for (let i = 0; i < this.multipleSelection.length; i++) {
          empNos += 'empNos=' + this.multipleSelection[i].empNo + '&';
        }
        this.axios({
          method: 'get',
          url: 'http://localhost:8088/removeMore?' + empNos,
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
    getData() {
      var vm = this;
      this.axios({
        method: 'get',
        url: 'http://localhost:8088/showEmpByKey?key=' + vm.search,
      }).then(function (res) {
        vm.tableData = res.data;
        vm.total = res.data.length;
        vm.getPageInfo();
      });
      this.axios({
        method: 'get',
        url: 'http://localhost:8088/showAllDept',
      }).then(function (res) {
        vm.deptS = res.data;
      });
    },
    getPageInfo() {
      this.pageTableData = [];
      for (let i = (this.currentPage - 1) * this.pageSize; i < this.total; i++) {
        this.pageTableData.push(this.tableData[i]);
        if (this.pageTableData.length === this.pageSize) {
          break;
        }
      }
    },
    searchByKey() {
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clear(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPageInfo();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getPageInfo();
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>

</style>
