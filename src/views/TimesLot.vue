<template>
  <div>
    <el-button type="primary" plain @click="refresh(rowInfo)"><i class="el-icon-refresh-right"></i>刷新</el-button>
    <el-button type="primary" plain @click="addOneInfoBox = true">逐条添加</el-button>

    <el-table
      :data="tableData.filter(data => !search
     || data.ename.toLowerCase().includes(search.toLowerCase())
     || data.job.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%">
      <el-table-column label="班别" prop="classes"/>
      <el-table-column label="时间段编码" prop="timesLotCode"/>
      <el-table-column label="开始时间" prop="start"/>
      <el-table-column label="结束时间" prop="end"/>
      <el-table-column label="取号开始时间" prop="takenNumStart"/>
      <el-table-column label="取号截止时间" prop="takenNumEnd"/>
      <el-table-column label="平均看病市场" prop="pjkBsc"/>
      <el-table-column label="时间段源号" prop="sjdHys"/>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="输入关键字搜索" @input="searchByKey()"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
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
    <el-dialog
      width="45%"
      title="时间明细添加"
      :visible.sync="addOneInfoBox"
    >
      模板名称:
      <h3 style="display: inline">{{ rowInfo.templateName }}</h3>
      <br />
      <br />
      <el-form
      >
        <el-form-item label="班别:" prop="classes">
          &nbsp;&nbsp;
          <el-radio-group v-model="infoForm.classes" @change="classesChange">
            <el-radio label="上午">上午</el-radio>
            <el-radio label="下午">下午</el-radio>
          </el-radio-group>
        </el-form-item>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
        <el-form-item label="时间段编码:">
          <el-input v-model="infoForm.timeSlotCode" />
        </el-form-item>
        <el-form-item label="时间段开始时间:" prop="start">
          <el-time-select
            placeholder="开始时间"
            v-model="infoForm.start"
            :picker-options="{
                start: timeStart,
                step: '00:05',
                end: timeEnd,
              }"
            @change="startChange"
            :clearable="false"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="时间段结束时间:" prop="end">
          <el-time-select
            placeholder="结束时间"
            v-model="infoForm.end"
            :picker-options="{
                start: timeStart,
                step: '00:05',
                end: timeEnd,
                minTime: infoForm.start,
              }"
            @change="endChange"
            :clearable="false"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="取号开始时间:" prop="takeNumStart">
          &nbsp;&nbsp;
          <el-time-select
            placeholder="开始时间"
            v-model="infoForm.takeNumStart"
            :picker-options="{
                start: takeNumStart,
                step: '00:05',
                end: infoForm.end,
              }"
            :clearable="false"
            @change="takeNumStartChange"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="取号截止时间:" prop="takeNumEnd">
          &nbsp;&nbsp;
          <el-time-select
            placeholder="截止时间"
            v-model="infoForm.takeNumEnd"
            :picker-options="{
                start: takeNumStart,
                step: '00:05',
                end: infoForm.end,
                minTime: infoForm.takeNumStart,
              }"
            :clearable="false"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="平均看病时长(分钟):">
          <el-input v-model="infoForm.pjkbsc" />
        </el-form-item>
        <el-form-item label="时间段号源数:">
          <el-input v-model="infoForm.sjdhys" />
        </el-form-item>
      </el-form>
      <el-table :data="infoData">
        <el-table-column
          property="timeSlotCode"
          label="模板下已存在的时间段"
        />
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="addInfo('infoForm')"
        >添加</el-button
        >
        <el-button @click="addOneInfoBox = false">取消</el-button>
      </div>
    </el-dialog>


    <br>
  </div>
</template>

<script>
export default {
  name: "TimesLot",
  data() {
    return {
      tableData: [],
      organs: [],
      depts: [],
      doctors: [],
      defaultAM: [new Date(2000, 5, 28, 8, 0), new Date(2000, 5, 28, 12, 0)],
      defaultPM: [new Date(2000, 5, 28, 13, 0), new Date(2000, 5, 28, 17, 0)],
      addTimeTemplateBox: false,
      updTimeTemplateBox: false,
      timeTemplateForm: {
        timeTemplateId: "",
        templateBelong: "",
        useful: "1",
        organId: "",
        deptNo: "",
        dId: "",
        templateName: "",
        pinyinCode: "",
        amTimeArr: "",
        pmTimeArr: "",
        amTime: "",
        amStart: "",
        amStop: "",
        pmTime: "",
        pmStart: "",
        pmStop: "",
      },
      findForm: {
        organId: "",
        templateBelong: "",
        deptNo: "",
        dId: "",
        useful: "",
        templateName: "",
      },
      rules: {
        templateBelong: [{ required: true, message: "请选择模板所属" }],
        useful: [{ required: true, message: "请选择是否有效" }],
        organId: [{ required: true, message: "请选择所属机构" }],
        deptNo: [{ required: true, message: "请选择所属部门" }],
        dId: [{ required: true, message: "请选择所属医生" }],
        templateName: [
          { required: true, message: "请输入模板名称" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
          },
        ],
        pinyinCode: [{ required: true, message: "请生成拼音简码" }],
        amTimeArr: [
          {
            required: true,
            message: "请选择上午时间",
          },
        ],
        pmTimeArr: [
          {
            required: true,
            message: "请选择下午时间",
          },
        ],
      },
      deptDisabled: true,
      doctorDisabled: true,
      deptDisabled1: true,
      doctorDisabled1: true,
      deptProp: "",
      doctorProp: "",
      isMore: false,
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      pageSize: 7,
      pageTableData: [],
      totalPages: 0,
      timeTemplateInfo: false,
      infoData: [],
      infoTitle: "",
      rowInfo: "",
      addOneInfoBox: false,
      infoForm: {
        classes: "上午",
        timeSlotCode: "",
        start: "",
        end: "",
        takeNumStart: "",
        takeNumEnd: "",
        pjkbsc: "",
        sjdhys: "",
      },
      infoRules: {
        classes: [{ required: true, message: "请选择班别" }],
        timeSlotCode: [{ required: true, message: "请输入时间编码" }],
        start: [{ required: true, message: "请选择时间段开始时间" }],
        end: [{ required: true, message: "请选择时间段结束时间" }],
        takeNumStart: [{ required: true, message: "请选择取号开始时间" }],
        takeNumEnd: [{ required: true, message: "请选择取号截止时间" }],
      },
      timeStart: "",
      timeEnd: "",
      takeNumStart: "",
    }
  },
  methods: {

    TimeLot() {
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdmx/init"
      }).then(function (res) {
        vm.tableData = res.data;
        vm.getPageInfo();
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

    handleEdit(index, row) {


      console.log(index, row);
    },
    classesChange(val) {
      if (val === "上午") {
        this.infoForm.start = "";
        this.infoForm.end = "";
        this.timeStart = this.rowInfo.amStart;
        this.timeEnd = this.rowInfo.amStop;
      } else {
        this.infoForm.start = "";
        this.infoForm.end = "";
        this.timeStart = this.rowInfo.pmStart;
        this.timeEnd = this.rowInfo.pmStop;
      }
    },
    startChange() {
      this.infoForm.end = "";
      this.infoForm.takeNumStart = "";
      this.infoForm.takeNumEnd = "";
      var index = this.infoForm.start.indexOf(":");
      var length = this.infoForm.start.length;
      var hour = this.infoForm.start.substring(0, index);
      var min = this.infoForm.start.substring(index + 1, length);
      hour = hour - 1 < 10 ? "0" + (hour - 1) : hour - 1;
      this.takeNumStart = hour + ":" + min;
    },
    endChange() {
      if (this.infoForm.start != "" && this.infoForm.end != "") {
        this.infoForm.timeSlotCode =
          this.infoForm.start + "-" + this.infoForm.end;
      }
      this.infoForm.takeNumStart = "";
      this.infoForm.takeNumEnd = "";
    },
    takeNumStartChange() {
      this.infoForm.takeNumEnd = "";
    },
    getSjdhys(val) {
      if (
        isNaN(val) ||
        val === "" ||
        this.infoForm.start === "" ||
        this.infoForm.end === ""
      ) {
        return;
      }
      var index = this.infoForm.start.indexOf(":");
      var length = this.infoForm.start.length;
      var hour = this.infoForm.start.substring(0, index);
      var min = this.infoForm.start.substring(index + 1, length);
      var startTime = new Date(2000, 5, 28, hour, min);
      var index = this.infoForm.end.indexOf(":");
      var length = this.infoForm.end.length;
      var hour = this.infoForm.end.substring(0, index);
      var min = this.infoForm.end.substring(index + 1, length);
      var endTime = new Date(2000, 5, 28, hour, min);
      this.infoForm.sjdhys = parseInt(
        (endTime.getTime() - startTime.getTime()) / 1000 / 60 / val
      );
    },
    handleDelete(index, row) {
      console.log(index, row);
      var vm = this;
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_del?timesLotId=" + row.timesLotId,
        }).then(function (res) {
          if (res.data == "success") {
            vm.$message.success('删除成功');
            vm.TimeLot();
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
    this.TimeLot();
  }

}
</script>

<style scoped>

</style>
