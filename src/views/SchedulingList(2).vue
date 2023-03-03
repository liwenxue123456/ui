<template>
  <div>
    <el-form :inline="true" ref="findForm" :model="findForm">
      <el-form-item label="排班类别:">
        <el-select
          v-model="findForm.schedulingType"
          placeholder="请选择排班类别"
          @change="typeChange"
        >
          <el-option label="机构" value="机构"></el-option>
          <el-option label="科室" value="科室"></el-option>
          <el-option label="医生" value="医生"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医疗机构:">
        <el-select
          v-model="findForm.organId"
          placeholder="请选择机构"
          @change="organSelectChange"
        >
          <el-option
            v-for="organ in organs"
            :key="organ.organId"
            :label="organ.organName"
            :value="organ.organId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室:">
        <el-select
          v-model="findForm.deptNo"
          placeholder="请选择科室"
          @change="deptSelectChange"
          :disabled="deptDisabled"
        >
          <el-option
            v-for="dept in depts"
            :key="dept.deptNo"
            :label="dept.deptName"
            :value="dept.deptNo"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医生:">
        <el-select
          v-model="findForm.dId"
          placeholder="请选择医生"
          :disabled="doctorDisabled"
        >
          <el-option
            v-for="doctor in doctors"
            :key="doctor.did"
            :label="doctor.dname"
            :value="doctor.did"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="号类:">
        <el-select v-model="findForm.numClass" placeholder="请选择号类">
          <el-option label="专家" value="专家"></el-option>
          <el-option label="普通" value="普通"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="号别:">
        <el-select v-model="findForm.numType" placeholder="请选择号别">
          <el-option label="主任医师" value="主任医师"></el-option>
          <el-option label="高级医师" value="高级医师"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班别:">
        <el-select v-model="findForm.classes" placeholder="请选择班别">
          <el-option label="上午" value="上午"></el-option>
          <el-option label="下午" value="下午"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="星期:">
        <el-select v-model="findForm.week" placeholder="请选择星期">
          <el-option label="一" value="一"></el-option>
          <el-option label="二" value="二"></el-option>
          <el-option label="三" value="三"></el-option>
          <el-option label="四" value="四"></el-option>
          <el-option label="五" value="五"></el-option>
          <el-option label="六" value="六"></el-option>
          <el-option label="日" value="日"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="节假出诊:">
        <el-select
          v-model="findForm.isHoliday"
          placeholder="请选择是否节假日出诊"
        >
          <el-option label="是" value="是"></el-option>
          <el-option label="否" value="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有效:">
        <el-select v-model="findForm.useful" placeholder="请选择是否有效">
          <el-option label="是" value="是"></el-option>
          <el-option label="否" value="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="find" type="primary" icon="el-icon-search" plain
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          @click="reset"
          type="primary"
          icon="el-icon-refresh-left"
          plain
          >条件重置</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          @click="addFormBox = true"
          type="primary"
          icon="el-icon-circle-plus-outline"
          plain
          >逐条新建</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-circle-plus-outline" plain
          >批量新建</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button @click="removeMore" type="danger" icon="el-icon-delete" plain
          >删除选中</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="pageTableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="排班类别" prop="schedulingType" width="80%" />
      <el-table-column label="机构" prop="organ.organName" />
      <el-table-column label="科室" prop="dept.deptName" />
      <el-table-column label="医生" prop="doctor.dname" />
      <el-table-column label="号类" prop="numClass" width="65%" />
      <el-table-column label="号别" prop="numType" width="80%" />
      <el-table-column label="星期" prop="week" width="65%" />
      <el-table-column label="班别" prop="classes" width="65%" />
      <el-table-column label="时间段" prop="timeCode" width="100%" />
      <el-table-column label="号源数" prop="sjdhys" width="65%" />
      <el-table-column label="可加号数" prop="addNumAble" width="80%" />
      <el-table-column label="节假出诊" prop="isHoliday" width="80%" />
      <el-table-column label="挂号窗口" prop="numWindow" width="80%" />
      <el-table-column label="有效" prop="useful" width="65%" />
      <el-table-column label="查看" width="80%">
        <template slot-scope="scope">
          <el-button @click="view(scope.row)" icon="el-icon-search"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改" width="80%">
        <template slot-scope="scope">
          <el-button
            @click="edit(scope.row)"
            icon="el-icon-edit-outline"
            type="info"
            plain
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="80%">
        <template slot-scope="scope">
          <el-button
            @click="remove(scope.row)"
            icon="el-icon-delete"
            type="danger"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[6, 12, 18, 24, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align: right"
    >
    </el-pagination>
    <br />
    <el-dialog
      title="一周排班模板添加"
      :visible.sync="addFormBox"
      @close="clear('schedulingForm')"
      width="1010px"
      top="60px"
    >
      <el-container>
        <el-aside width="280px">
          <el-table :data="timeTemplateData" @row-click="getTimeCode">
            <el-table-column label="时间段模板名称" prop="templateName" />
            <el-table-column label="时间段编码" prop="timeCode" />
          </el-table>
        </el-aside>
        <el-main
          ><el-form
            ref="schedulingForm"
            :model="schedulingForm"
            :inline="true"
            :rules="rules"
          >
            <el-form-item label="排班类别:" prop="schedulingType">
              <el-select
                v-model="schedulingForm.schedulingType"
                placeholder="请选择排班类别"
                @change="formTypeChange"
              >
                <el-option label="机构" value="机构"></el-option>
                <el-option label="科室" value="科室"></el-option>
                <el-option label="医生" value="医生"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医疗机构:" prop="organId">
              <el-select
                v-model="schedulingForm.organId"
                placeholder="请选择机构"
                @change="formOrganChange"
              >
                <el-option
                  v-for="organ in organs1"
                  :key="organ.organId"
                  :label="organ.organName"
                  :value="organ.organId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科室:" :prop="deptNo">
              <el-select
                v-model="schedulingForm.deptNo"
                placeholder="请选择科室"
                @change="formDeptChange"
                :disabled="deptDisabled1"
              >
                <el-option
                  v-for="dept in depts1"
                  :key="dept.deptNo"
                  :label="dept.deptName"
                  :value="dept.deptNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生:" :prop="dId">
              <el-select
                v-model="schedulingForm.dId"
                placeholder="请选择医生"
                @change="formDoctorChange"
                :disabled="doctorDisabled1"
              >
                <el-option
                  v-for="doctor in doctors1"
                  :key="doctor.did"
                  :label="doctor.dname"
                  :value="doctor.did"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="星期:" prop="week">
              <el-select v-model="schedulingForm.week" placeholder="请选择星期">
                <el-option label="一" value="一"></el-option>
                <el-option label="二" value="二"></el-option>
                <el-option label="三" value="三"></el-option>
                <el-option label="四" value="四"></el-option>
                <el-option label="五" value="五"></el-option>
                <el-option label="六" value="六"></el-option>
                <el-option label="日" value="日"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班别:" prop="classes">
              <el-radio-group
                v-model="schedulingForm.classes"
                @change="formClassesChange"
              >
                <el-radio label="上午">上午</el-radio>
                <el-radio label="下午">下午</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="时间段编码:" prop="timeCode">
              <el-input
                v-model="schedulingForm.timeCode"
                :disabled="true"
                placeholder="选择模板生成时间段编码"
              />
            </el-form-item>
            <el-form-item label="时间段号源数:">
              <el-input
                v-model="schedulingForm.sjdhys"
                :disabled="true"
                placeholder="选择模板生成时间段号源数:"
              />
            </el-form-item>
            <el-form-item label="号类:" prop="numClass">
              <el-select
                v-model="schedulingForm.numClass"
                placeholder="请选择号类:"
              >
                <el-option label="专家" value="专家"></el-option>
                <el-option label="普通" value="普通"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="号别:" prop="numType">
              <el-select
                v-model="schedulingForm.numType"
                placeholder="请选择号别:"
              >
                <el-option label="主任医师" value="主任医师"></el-option>
                <el-option label="高级医师" value="高级医师"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="挂号窗口:" prop="numWindow">
              <el-select
                v-model="schedulingForm.numWindow"
                placeholder="请选择挂号窗口"
              >
                <el-option label="无限制" value="无限制"></el-option>
                <el-option label="一号窗口" value="一号窗口"></el-option>
                <el-option label="二号窗口" value="二号窗口"></el-option>
                <el-option label="三号窗口" value="三号窗口"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="addChecked" @change="addCheckBoxChange"
                >加号:</el-checkbox
              >
            </el-form-item>
            <el-form-item prop="addNumAble">
              <el-input
                :disabled="!addChecked"
                v-model.number="schedulingForm.addNumAble"
                placeholder="请输入可加号源数"
              ></el-input>
            </el-form-item>
            <el-form-item label="节假日是否出诊:" prop="isHoliday">
              <el-radio-group v-model="schedulingForm.isHoliday">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="是否有效:" prop="useful">
              <el-radio-group v-model="schedulingForm.useful">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form></el-main
        >
      </el-container>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="add('schedulingForm')" type="primary"
          >添加</el-button
        >
        <el-button @click="addFormBox = false">取消</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-checkbox v-model="isMore">连续添加</el-checkbox>
      </div>
    </el-dialog>
    <el-dialog
      title="一周排班模板维护"
      :visible.sync="updFormBox"
      @close="clear('schedulingForm')"
      width="1010px"
      top="60px"
    >
      <el-container>
        <el-aside width="280px">
          <el-table :data="timeTemplateData" @row-click="getTimeCode">
            <el-table-column label="时间段模板名称" prop="templateName" />
            <el-table-column label="时间段编码" prop="timeCode" />
          </el-table>
        </el-aside>
        <el-main
          ><el-form
            ref="schedulingForm"
            :model="schedulingForm"
            :inline="true"
            :rules="rules"
          >
            <el-form-item label="排班类别:" prop="schedulingType">
              <el-select
                v-model="schedulingForm.schedulingType"
                placeholder="请选择排班类别"
                @change="formTypeChange"
              >
                <el-option label="机构" value="机构"></el-option>
                <el-option label="科室" value="科室"></el-option>
                <el-option label="医生" value="医生"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医疗机构:" prop="organId">
              <el-select
                v-model="schedulingForm.organId"
                placeholder="请选择机构"
                @change="formOrganChange"
              >
                <el-option
                  v-for="organ in organs1"
                  :key="organ.organId"
                  :label="organ.organName"
                  :value="organ.organId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科室:" :prop="deptNo">
              <el-select
                v-model="schedulingForm.deptNo"
                placeholder="请选择科室"
                @change="formDeptChange"
                :disabled="deptDisabled1"
              >
                <el-option
                  v-for="dept in depts1"
                  :key="dept.deptNo"
                  :label="dept.deptName"
                  :value="dept.deptNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生:" :prop="dId">
              <el-select
                v-model="schedulingForm.dId"
                placeholder="请选择医生"
                @change="formDoctorChange"
                :disabled="doctorDisabled1"
              >
                <el-option
                  v-for="doctor in doctors1"
                  :key="doctor.did"
                  :label="doctor.dname"
                  :value="doctor.did"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="星期:" prop="week">
              <el-select v-model="schedulingForm.week" placeholder="请选择星期">
                <el-option label="一" value="一"></el-option>
                <el-option label="二" value="二"></el-option>
                <el-option label="三" value="三"></el-option>
                <el-option label="四" value="四"></el-option>
                <el-option label="五" value="五"></el-option>
                <el-option label="六" value="六"></el-option>
                <el-option label="日" value="日"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班别:" prop="classes">
              <el-radio-group
                v-model="schedulingForm.classes"
                @change="formClassesChange"
              >
                <el-radio label="上午">上午</el-radio>
                <el-radio label="下午">下午</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="时间段编码:" prop="timeCode">
              <el-input
                v-model="schedulingForm.timeCode"
                :disabled="true"
                placeholder="选择模板生成时间段编码"
              />
            </el-form-item>
            <el-form-item label="时间段号源数:">
              <el-input
                v-model="schedulingForm.sjdhys"
                :disabled="true"
                placeholder="选择模板生成时间段号源数:"
              />
            </el-form-item>
            <el-form-item label="号类:" prop="numClass">
              <el-select
                v-model="schedulingForm.numClass"
                placeholder="请选择号类:"
              >
                <el-option label="专家" value="专家"></el-option>
                <el-option label="普通" value="普通"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="号别:" prop="numType">
              <el-select
                v-model="schedulingForm.numType"
                placeholder="请选择号别:"
              >
                <el-option label="主任医师" value="主任医师"></el-option>
                <el-option label="高级医师" value="高级医师"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="挂号窗口:" prop="numWindow">
              <el-select
                v-model="schedulingForm.numWindow"
                placeholder="请选择挂号窗口"
              >
                <el-option label="无限制" value="无限制"></el-option>
                <el-option label="一号窗口" value="一号窗口"></el-option>
                <el-option label="二号窗口" value="二号窗口"></el-option>
                <el-option label="三号窗口" value="三号窗口"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="addChecked" @change="addCheckBoxChange"
                >加号:</el-checkbox
              >
            </el-form-item>
            <el-form-item prop="addNumAble">
              <el-input
                :disabled="!addChecked"
                v-model.number="schedulingForm.addNumAble"
                placeholder="请输入可加号源数"
              ></el-input>
            </el-form-item>
            <el-form-item label="节假日是否出诊:" prop="isHoliday">
              <el-radio-group v-model="schedulingForm.isHoliday">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="是否有效:" prop="useful">
              <el-radio-group v-model="schedulingForm.useful">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form></el-main
        >
      </el-container>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="editSubmit('schedulingForm')" type="primary"
          >保存</el-button
        >
        <el-button @click="updFormBox = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="排班详情" :visible.sync="infoBox">
      <el-table :data="infoData">
        <el-table-column property="timeSlotCode" label="时间段编码" />
        <el-table-column property="start" label="开始时间" />
        <el-table-column property="end" label="结束时间" />
        <el-table-column property="takeNumStart" label="取号开始时间" />
        <el-table-column property="takeNumEnd" label="取号结束时间" />
        <el-table-column property="pjkbsc" label="平均看病时长(分钟)" />
        <el-table-column property="sjdhys" label="时间段号源数" />
      </el-table>
    </el-dialog>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree"
      @node-click="handleNodeClick"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  created() {
    this.getData();
  },
  data() {
    return {
      tableData: [],
      pageTableData: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      pageSize: 6,
      findForm: {
        organId: "",
        schedulingType: "",
        deptNo: "",
        dId: "",
        numClass: "",
        numType: "",
        classes: "",
        isHoliday: "",
        useful: "",
        week: "",
        addNumAble: "",
      },
      deptDisabled: true,
      doctorDisabled: true,
      deptDisabled1: true,
      doctorDisabled1: true,
      deptNo: "",
      dId: "",
      organs: [],
      depts: [],
      doctors: [],
      organs1: [],
      depts1: [],
      doctors1: [],
      multipleSelection: [],
      addFormBox: false,
      schedulingForm: {
        schedulingId: "",
        organId: "",
        schedulingType: "",
        deptNo: "",
        dId: "",
        week: "",
        classes: "上午",
        timeCode: "",
        sjdhys: "",
        numClass: "",
        numType: "",
        numWindow: "",
        addNumAble: 0,
        isHoliday: "是",
        useful: "是",
        timeTemplateId: "",
      },
      timeTemplateData: [],
      timeSlotData: [],
      timeCode: "",
      addChecked: true,
      rules: {
        organId: [
          { required: true, message: "请选择医疗机构", trigger: "blur" },
        ],
        schedulingType: [
          { required: true, message: "请选择排班类别", trigger: "blur" },
        ],
        week: [{ required: true, message: "请选择星期", trigger: "blur" }],
        classes: [{ required: true, message: "请选择班别", trigger: "blur" }],
        timeCode: [
          {
            required: true,
            message: "请选择模板生成时间编码",
            trigger: "blur",
          },
        ],
        sjdhys: [
          {
            required: true,
            message: "请选择模板生成时间段号源数",
            trigger: "blur",
          },
        ],
        numClass: [{ required: true, message: "请选择号类", trigger: "blur" }],
        numType: [{ required: true, message: "请选择号别", trigger: "blur" }],
        numWindow: [
          { required: true, message: "请选择挂号窗口", trigger: "blur" },
        ],
        isHoliday: [
          { required: true, message: "请选择节假日是否出诊", trigger: "blur" },
        ],
        useful: [
          { required: true, message: "请选择是否有效", trigger: "blur" },
        ],
        addNumAble: [
          { type: "number", message: "号源必须为数字", trigger: "blur" },
        ],
        deptNo: [{ required: true, message: "请选择科室", trigger: "blur" }],
        dId: [{ required: true, message: "请选择医生", trigger: "blur" }],
      },
      isMore: false,
      infoBox: false,
      infoData: [],
      updFormBox: false,
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    getData() {
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/pbjhgl/pbmb/init",
        method: "get",
      }).then(function (res) {
        vm.tableData = res.data;
        vm.getPageInfo();
      });
      this.axios({
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_jgxx",
        method: "get",
      }).then(function (res) {
        vm.organs = res.data;
        vm.organs1 = res.data;
      });
      this.axios({
        url: "http://localhost:8088/hygl/pbjhgl/pbmb/listys",
        method: "get",
      }).then(function (res) {
        vm.data = res.data;
      });
    },
    getPageInfo() {
      this.total = this.tableData.length;
      this.totalPages =
        this.total % this.pageSize == 0
          ? this.total / this.pageSize
          : parseInt(this.total / this.pageSize) + 1;
      if (this.currentPage > this.totalPages && this.totalPages !== 0) {
        this.handleCurrentChange(this.currentPage - 1);
      }
      this.pageTableData = [];
      for (
        let i = (this.currentPage - 1) * this.pageSize;
        i < this.total;
        i++
      ) {
        this.pageTableData.push(this.tableData[i]);
        if (this.pageTableData.length === this.pageSize) {
          break;
        }
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPageInfo();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getPageInfo();
    },
    typeChange(val) {
      if (val === "机构") {
        this.findForm.organId = "";
        this.deptDisabled = true;
        this.depts = [];
        this.findForm.deptNo = "";
        this.doctorDisabled = true;
        this.doctors = [];
        this.findForm.dId = "";
      }
      if (val === "科室") {
        this.deptDisabled = false;
        this.findForm.deptNo = "";
        this.doctorDisabled = true;
        this.doctors = [];
        this.findForm.dId = "";
      }
      if (val === "医生") {
        this.deptDisabled = false;
        this.doctorDisabled = false;
      }
    },
    organSelectChange(val) {
      this.depts = [];
      this.findForm.deptNo = "";
      this.doctors = [];
      this.findForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ksxx?oId=" + val,
      }).then(function (res) {
        vm.depts = res.data;
      });
    },
    deptSelectChange(val) {
      this.doctors = [];
      this.findForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ryxx?deptNo=" + val,
      }).then(function (res) {
        vm.doctors = res.data;
      });
    },
    find() {
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_sel",
        method: "get",
        params: vm.findForm,
      }).then(function (res) {
        vm.tableData = res.data;
        vm.getPageInfo();
      });
    },
    reset() {
      this.findForm = this.$options.data().findForm;
      this.getData();
    },
    remove(row) {
      var vm = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.axios({
          url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_del",
          method: "post",
          data: {
            ids: [row.schedulingId],
          },
        })
          .then(function (res) {
            if (res.data === 1) {
              vm.$message.success("删除成功");
              vm.find();
            } else {
              vm.$message.error("删除失败");
            }
          })
          .catch(function () {
            vm.$message.error("删除失败");
          });
      });
    },
    removeMore() {
      var vm = this;
      var ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids[i] = this.multipleSelection[i].schedulingId;
      }
      if (this.multipleSelection.length === 0) {
        return this.$message.error("未选中数据");
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.axios({
          url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_del",
          method: "post",
          data: { ids: ids },
        })
          .then(function (res) {
            if (res.data > 0) {
              vm.$message.success("成功删除" + res.data + "条数据");
              vm.find();
            } else {
              vm.$message.error("删除失败");
            }
          })
          .catch(function () {
            vm.$message.error("删除失败");
          });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formTypeChange(val) {
      if (val === "机构") {
        this.schedulingForm.organId = "";
        this.deptDisabled1 = true;
        this.depts1 = [];
        this.schedulingForm.deptNo = "";
        this.deptNo = "";
        this.doctorDisabled1 = true;
        this.doctors1 = [];
        this.schedulingForm.dId = "";
        this.dId = "";
      }
      if (val === "科室") {
        this.deptDisabled1 = false;
        this.schedulingForm.deptNo = "";
        this.deptNo = "deptNo";
        this.doctorDisabled1 = true;
        this.doctors1 = [];
        this.schedulingForm.dId = "";
        this.dId = "";
      }
      if (val === "医生") {
        this.deptDisabled1 = false;
        this.deptNo = "deptNo";
        this.doctorDisabled1 = false;
        this.dId = "dId";
      }
    },
    formOrganChange(val) {
      this.depts1 = [];
      this.schedulingForm.deptNo = "";
      this.doctors1 = [];
      this.schedulingForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ksxx?oId=" + val,
      }).then(function (res) {
        vm.depts1 = res.data;
      });
      this.formClassesChange();
    },
    formDeptChange(val) {
      this.doctors1 = [];
      this.schedulingForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ryxx?deptNo=" + val,
      }).then(function (res) {
        vm.doctors1 = res.data;
      });
      this.formClassesChange();
    },
    formDoctorChange() {
      this.formClassesChange();
    },
    formClassesChange() {
      if (this.schedulingForm.organId === "") {
        this.timeTemplateData = [];
        this.timeSlotData = [];
        return;
      }
      this.schedulingForm.timeCode = "";
      this.schedulingForm.sjdhys = "";
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_add_init",
        method: "get",
        params: {
          organId: vm.schedulingForm.organId,
          deptNo: vm.schedulingForm.deptNo,
          dId: vm.schedulingForm.dId,
          classes: vm.schedulingForm.classes,
        },
      }).then(function (res) {
        vm.timeTemplateData = [];
        vm.timeSlotData = [];
        vm.timeTemplateData = res.data.timeTemplates;
        vm.timeSlotData = res.data.timeSlots;
        if (vm.schedulingForm.classes === "上午") {
          for (let i = 0; i < vm.timeTemplateData.length; i++) {
            vm.timeTemplateData[i]["timeCode"] = vm.timeTemplateData[i].amTime;
          }
        } else {
          for (let i = 0; i < vm.timeTemplateData.length; i++) {
            vm.timeTemplateData[i]["timeCode"] = vm.timeTemplateData[i].pmTime;
          }
        }
      });
    },
    getTimeCode(row) {
      this.schedulingForm.timeCode = row.timeCode;
      this.schedulingForm.sjdhys = 0;
      for (let i = 0; i < this.timeSlotData.length; i++) {
        if (
          this.timeSlotData[i].templateId === row.timeTemplateId &&
          this.timeSlotData[i].classes === this.schedulingForm.classes
        ) {
          this.schedulingForm.sjdhys += this.timeSlotData[i].sjdhys;
        }
      }
      this.schedulingForm.timeTemplateId = "";
      this.schedulingForm.timeTemplateId = row.timeTemplateId;
    },
    addCheckBoxChange() {
      if (!this.addChecked) {
        this.schedulingForm.addNumAble = 0;
      }
    },
    add(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_save",
            method: "post",
            data: {
              organ: { organId: vm.schedulingForm.organId },
              schedulingType: vm.schedulingForm.schedulingType,
              dept: { deptNo: vm.schedulingForm.deptNo },
              doctor: { did: vm.schedulingForm.dId },
              week: vm.schedulingForm.week,
              classes: vm.schedulingForm.classes,
              timeCode: vm.schedulingForm.timeCode,
              sjdhys: vm.schedulingForm.sjdhys,
              numClass: vm.schedulingForm.numClass,
              numType: vm.schedulingForm.numType,
              numWindow: vm.schedulingForm.numWindow,
              addNumAble: vm.schedulingForm.addNumAble,
              isHoliday: vm.schedulingForm.isHoliday,
              useful: vm.schedulingForm.useful,
              timeTemplateId: vm.schedulingForm.timeTemplateId,
            },
          })
            .then(function (res) {
              if (res.data === 1) {
                vm.$message.success("添加成功!");
                vm.find();
                if (vm.isMore) {
                  vm.clear(formName);
                } else {
                  vm.addFormBox = false;
                }
              } else if (res.data === 10) {
                vm.$message.error("该时间段已存在排班!");
              } else {
                vm.$message.error("添加失败!");
              }
            })
            .catch(function () {
              vm.$message.error("添加失败!");
            });
        } else {
          this.$message.error("格式错误!");
          return false;
        }
      });
    },
    clear(formName) {
      this.timeTemplateData = [];
      this.timeSlotData = [];
      this.formTypeChange("机构");
      this.addChecked = true;
      this.schedulingForm = this.$options.data().schedulingForm;
      this.$refs[formName].resetFields();
    },
    view(row) {
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_sel",
        method: "get",
        params: { id: row.timeTemplateId },
      })
        .then(function (res) {
          vm.infoData = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].classes === row.classes) {
              vm.infoData[i] = res.data[i];
            }
          }
          vm.infoBox = true;
        })
        .catch(function () {
          vm.$message.error("查询失败");
        });
    },
    edit(row) {
      this.schedulingForm.schedulingId = row.schedulingId;
      this.schedulingForm.schedulingType = row.schedulingType;
      this.formTypeChange(this.schedulingForm.schedulingType);
      this.schedulingForm.organId = row.organ.organId;
      this.formOrganChange(this.schedulingForm.organId);
      if (row.dept !== null) {
        this.schedulingForm.deptNo = row.dept.deptNo;
        this.formDeptChange(this.schedulingForm.deptNo);
        if (row.doctor !== null) {
          this.schedulingForm.dId = row.doctor.did;
          this.formDoctorChange(this.schedulingForm.dId);
        }
      }
      this.schedulingForm.week = row.week;
      this.schedulingForm.classes = row.classes;
      this.formClassesChange(this.schedulingForm.classes);
      this.schedulingForm.timeCode = row.timeCode;
      this.schedulingForm.sjdhys = row.sjdhys;
      this.schedulingForm.numClass = row.numClass;
      this.schedulingForm.numType = row.numType;
      this.schedulingForm.numWindow = row.numWindow;
      this.schedulingForm.addNumAble = row.addNumAble;
      this.schedulingForm.isHoliday = row.isHoliday;
      this.schedulingForm.useful = row.useful;
      this.schedulingForm.timeTemplateId = row.timeTemplateId;
      this.updFormBox = true;
    },
    editSubmit(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_save",
            method: "post",
            data: {
              schedulingId: vm.schedulingForm.schedulingId,
              organ: { organId: vm.schedulingForm.organId },
              schedulingType: vm.schedulingForm.schedulingType,
              dept: { deptNo: vm.schedulingForm.deptNo },
              doctor: { did: vm.schedulingForm.dId },
              week: vm.schedulingForm.week,
              classes: vm.schedulingForm.classes,
              timeCode: vm.schedulingForm.timeCode,
              sjdhys: vm.schedulingForm.sjdhys,
              numClass: vm.schedulingForm.numClass,
              numType: vm.schedulingForm.numType,
              numWindow: vm.schedulingForm.numWindow,
              addNumAble: vm.schedulingForm.addNumAble,
              isHoliday: vm.schedulingForm.isHoliday,
              useful: vm.schedulingForm.useful,
              timeTemplateId: vm.schedulingForm.timeTemplateId,
            },
          })
            .then(function (res) {
              if (res.data === 1) {
                vm.$message.success("修改成功!");
                vm.find();
                vm.updFormBox = false;
              } else if (res.data === 10) {
                vm.$message.error("该时间段已存在排班!");
              } else {
                vm.$message.error("修改失败!");
              }
            })
            .catch(function () {
              vm.$message.error("修改失败!");
            });
        } else {
          this.$message.error("格式错误!");
          return false;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.children != null) {
        return;
      }
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/pbjhgl/pbmb/pbmb_sel",
        method: "get",
        params: { dId: data.id },
      }).then(function (res) {
        vm.tableData = res.data;
        vm.getPageInfo();
      });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style>
</style>