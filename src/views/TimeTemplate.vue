<template>

  <div>
    <div>
      <el-form ref="findForm" :model="findForm" :inline="true">
        <el-form-item label="模板所属:">
          <el-select
            v-model="findForm.templateBelong"
            placeholder="请选择模板所属"
            @change="templateSelectChange"
          >
            <el-option label="机构" value="机构"></el-option>
            <el-option label="科室" value="科室"></el-option>
            <el-option label="医生" value="医生"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构:"
        >
          <el-select
            v-model="findForm.organId"
            placeholder="请选择所属机构"
            @change="organIdSelectChange1"
          >
            <el-option
              v-for="organ in organs"
              :key="organ.organId"
              :label="organ.organName"
              :value="organ.organId"
            >
            </el-option>
          </el-select
          >
        </el-form-item>
        <el-form-item label="所属科室:">
          <el-select
            v-model="findForm.deptNo"
            placeholder="请选择科室"
            @change="deptNoSelectChange1"
            :disabled="deptDisabled1"
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
        <el-form-item label="所属医生:">
          <el-select
            v-model="findForm.dId"
            placeholder="请选择医生"
            :disabled="doctorDisabled1"
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
        <el-form-item label="是否有效:">
          <el-select v-model="findForm.useful" placeholder="请选择是否有效">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称:">
          <el-input
            v-model="findForm.templateName"
            style="width: 350px"
            placeholder="请输入模板名称"
          ></el-input>
        </el-form-item>
        <el-form-item
        >
          <el-button
            @click="findByKey"
            type="primary"
            icon="el-icon-search"
            plain
          >&nbsp;&nbsp;查询
          </el-button
          >
        </el-form-item>
        <el-button type="primary"
                   icon="el-icon-circle-plus"
                   @click="addTimeTemplateBox = true"
        >新建
        </el-button>

        <el-button @click="removeMore()" type="danger" plain><i class="el-icon-delete-solid"></i>&nbsp;&nbsp;&nbsp;&nbsp;删除选中
        </el-button>
      </el-form>
    </div>

    <el-table
      :data="pageTableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      @cell-dblclick="getInfo"

    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="ID"
        prop="timeTemplateId">
      </el-table-column>
      <el-table-column
        label="模板所属"
        prop="templateBeLong">
      </el-table-column>
      <el-table-column
        label="所属机构"
        prop="organ.organName">
      </el-table-column>
      <el-table-column
        label="所属科室"
        prop="dept.deptName">
      </el-table-column>
      <el-table-column
        label="所属医生"
        prop="doctor.dname">
      </el-table-column>
      <el-table-column
        label="时间段模板名称"
        prop="templateName">
      </el-table-column>
      <el-table-column
        label="上午时间"
        prop="amTime">
      </el-table-column>
      <el-table-column
        label="下午时间"
        prop="pmTime">
      </el-table-column>
      <el-table-column
        label="是否有效"
        prop="useful" :formatter="formatStatus">
      </el-table-column>

      <el-table-column
        align="right"
        width="200px">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"/>
        </template>

        <template slot-scope="scope">
          <el-button
            @click="toDetails(scope.$index,scope.row)"
            size="mini">
            <i class="el-icon-view el-icon--right"></i>

          </el-button>
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
    <div>
      <el-dialog
        title="时间段模板维护"
        :visible.sync="addTimeTemplateBox"
        @closed="clear('timeTemplateForm')"
        width="500px"
      >
        <el-form ref="timeTemplateForm" :model="timeTemplateForm" :rules="rules">
          <el-form-item label="模板所属:" prop="templateBelong">
            <el-radio-group
              v-model="timeTemplateForm.templateBelong"
              @change="templateBelongRadioChange"
            >
              <el-radio label="机构"></el-radio>
              <el-radio label="科室"></el-radio>
              <el-radio label="医生"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否有效:" prop="useful">
            <el-radio-group v-model="timeTemplateForm.useful">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属机构:" prop="organId">
            <el-select
              v-model="timeTemplateForm.organId"
              placeholder="请选择所属机构"
              @change="organIdSelectChange"
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
          <el-form-item label="科室:" :prop="deptProp">
            <el-select
              v-model="timeTemplateForm.deptNo"
              placeholder="请选择科室"
              :disabled="deptDisabled"
              @change="deptNoSelectChange"
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
          <el-form-item label="医生:" :prop="doctorProp">
            <el-select
              v-model="timeTemplateForm.dId"
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
          <el-form-item label="模板名称:" prop="templateName" label-width="85px">
            <el-input v-model="timeTemplateForm.templateName"></el-input>
          </el-form-item>
          <el-form-item label="拼音简码:" prop="pinyinCode" label-width="85px">
            <el-input v-model="timeTemplateForm.pinyinCode"></el-input>
            <el-button
              @click="getPinyinCode(timeTemplateForm.templateName)"
              size="mini"
            >自动生成拼音简码
            </el-button
            >
          </el-form-item>
          <el-form-item label="上午时间:" prop="amTimeArr">
            <el-time-picker
              is-range
              :default-value="defaultAM"
              v-model="timeTemplateForm.amTimeArr"
              :clearable="false"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="下午时间:" prop="pmTimeArr">
            <el-time-picker
              is-range
              :default-value="defaultPM"
              v-model="timeTemplateForm.pmTimeArr"
              :clearable="false"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-time-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="addTimeTemplate('timeTemplateForm')"
          >确定
          </el-button
          >
          <el-button @click="addTimeTemplateBox = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="时间段模板维护"
        :visible.sync="updTimeTemplateBox"
        @closed="clear('timeTemplateForm')"
        width="500px"
        top="10px"
      >
        <el-form ref="timeTemplateForm" :model="timeTemplateForm" :rules="rules">
          <el-form-item label="模板所属:" prop="templateBelong">
            <el-radio-group
              v-model="timeTemplateForm.templateBelong"
              @change="templateBelongRadioChange"
            >
              <el-radio label="机构"></el-radio>
              <el-radio label="科室"></el-radio>
              <el-radio label="医生"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否有效:" prop="useful">
            <el-radio-group v-model="timeTemplateForm.useful">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属机构:" prop="organId">
            <el-select
              v-model="timeTemplateForm.organId"
              placeholder="请选择所属机构"
              @change="organIdSelectChange"
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
          <el-form-item label="科室:" :prop="deptProp">
            <el-select
              v-model="timeTemplateForm.deptNo"
              placeholder="请选择科室"
              :disabled="deptDisabled"
              @change="deptNoSelectChange"
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
          <el-form-item label="医生:" :prop="doctorProp">
            <el-select
              v-model="timeTemplateForm.dId"
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
          <el-form-item label="模板名称:" prop="templateName" label-width="85px">
            <el-input v-model="timeTemplateForm.templateName"></el-input>
          </el-form-item>
          <el-form-item label="拼音简码:" prop="pinyinCode" label-width="85px">
            <el-input v-model="timeTemplateForm.pinyinCode"></el-input>
            <el-button
              @click="getPinyinCode(timeTemplateForm.templateName)"
              size="small"
            >自动生成拼音简码
            </el-button
            >
          </el-form-item>
          <el-form-item label="上午时间:" prop="amTimeArr">
            <el-time-picker
              is-range
              :default-value="defaultAM"
              v-model="timeTemplateForm.amTimeArr"
              :clearable="false"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="下午时间:" prop="pmTimeArr">
            <el-time-picker
              is-range
              :default-value="defaultPM"
              v-model="timeTemplateForm.pmTimeArr"
              :clearable="false"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-time-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="updTimeTemplate('timeTemplateForm')"
          >保存
          </el-button
          >
          <el-button @click="updTimeTemplateBox = false">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="时间段模板明细"
        :visible.sync="timeTemplateInfo"
        width="1200px"
        top="50px"
      >
        <div style="text-align: right">
          <h1 style="text-align: left">{{ infoTitle }}</h1>
          <el-button type="primary" plain @click="refresh(rowInfo)"
          >刷新</el-button
          >
          <el-button type="primary" plain @click="addOneInfoBox = true"
          >逐条添加</el-button
          >
          <el-button type="primary" plain>批量添加</el-button>
        </div>
        <br />
        <br />
        <el-table :data="infoData" border :default-sort="{ prop: 'start' }">
          <el-table-column property="classes" label="班别" />
          <el-table-column property="timeSlotCode" label="时间段编码" />
          <el-table-column property="start" label="开始时间" />
          <el-table-column property="end" label="结束时间" />
          <el-table-column property="takeNumStart" label="取号开始时间" />
          <el-table-column property="takeNumEnd" label="取号结束时间" />
          <el-table-column property="pjkbsc" label="看病时长(分钟)" />
          <el-table-column property="sjdhys" label="时间段号源数" />
          <el-table-column label="修改" width="100">
            <template slot-scope="scope">
              <el-button
                @click="infoHandleEdit(scope.row)"
                icon="el-icon-edit-outline"
                type="info"
                plain
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="删除" width="100">
            <template slot-scope="scope">
              <el-button
                @click="infoHandleDelete(scope.row)"
                icon="el-icon-delete"
                type="danger"
                plain
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          width="680px"
          title="时间明细添加"
          :visible.sync="addOneInfoBox"
          append-to-body
          top="20px"
          @closed="clear('infoForm')"
        >
          <el-container>
            <el-aside width="200px"
            ><el-table
              :data="infoData"
              :default-sort="{ prop: 'timeSlotCode' }"
            >
              <el-table-column
                property="timeSlotCode"
                label="模板下已存在的时间段"
              /> </el-table
            ></el-aside>
            <el-main
            >模板名称:
              <h3 style="display: inline">{{ rowInfo.templateName }}</h3>
              <br />
              <br />
              <el-form
                :model="infoForm"
                :rules="infoRules"
                ref="infoForm"
                :inline="true"
              >
                <el-form-item label="班别:" prop="classes">
                  <el-radio-group
                    v-model="infoForm.classes"
                    @change="classesChange"
                  >
                    <el-radio label="上午">上午</el-radio>
                    <el-radio label="下午">下午</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="时间段编码:" prop="timeSlotCode">
                  <el-input
                    v-model="infoForm.timeSlotCode"
                    :disabled="true"
                    placeholder="自动生成时间段编码"
                  />
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
                <el-form-item label="平均看病时长(分钟):" prop="pjkbsc">
                  <el-input
                    v-model.number="infoForm.pjkbsc"
                    @change="getSjdhys"
                    placeholder="请输入平均看病时长(分钟)"
                  />
                </el-form-item>
                <el-form-item label="时间段号源数:" prop="sjdhys">
                  <el-input
                    v-model.number="infoForm.sjdhys"
                    placeholder="请输入时间段号源数"
                  />
                </el-form-item>
              </el-form>
            </el-main>
          </el-container>
          <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="addInfo('infoForm')"
            >添加</el-button
            >
            <el-button @click="addOneInfoBox = false">取消</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-checkbox v-model="isMore">连续添加</el-checkbox>
          </div>
        </el-dialog>
        <el-dialog
          width="680px"
          title="时间明细修改"
          :visible.sync="updOneInfoBox"
          append-to-body
          top="20px"
          @closed="clear('infoForm')"
        >
          <el-container>
            <el-aside width="200px"
            ><el-table
              :data="infoData"
              :default-sort="{ prop: 'timeSlotCode' }"
            >
              <el-table-column
                property="timeSlotCode"
                label="模板下已存在的时间段"
              /> </el-table
            ></el-aside>
            <el-main
            >模板名称:
              <h3 style="display: inline">{{ rowInfo.templateName }}</h3>
              <br />
              <br />
              <el-form
                :model="infoForm"
                :rules="infoRules"
                ref="infoForm"
                :inline="true"
              >
                <el-form-item label="班别:" prop="classes">
                  <el-radio-group
                    v-model="infoForm.classes"
                    @change="classesChange"
                  >
                    <el-radio label="上午">上午</el-radio>
                    <el-radio label="下午">下午</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="时间段编码:" prop="timeSlotCode">
                  <el-input
                    v-model="infoForm.timeSlotCode"
                    :disabled="true"
                    placeholder="自动生成时间段编码"
                  />
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
                <el-form-item label="平均看病时长(分钟):" prop="pjkbsc">
                  <el-input
                    v-model.number="infoForm.pjkbsc"
                    @change="getSjdhys"
                    placeholder="请输入平均看病时长(分钟)"
                  />
                </el-form-item>
                <el-form-item label="时间段号源数:" prop="sjdhys">
                  <el-input
                    v-model.number="infoForm.sjdhys"
                    placeholder="请输入时间段号源数"
                  />
                </el-form-item>
              </el-form>
            </el-main>
          </el-container>
          <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="updInfo('infoForm')"
            >保存</el-button
            >
            <el-button @click="updOneInfoBox = false">取消</el-button>
          </div>
        </el-dialog>
      </el-dialog>
      <el-dialog
        width="680px"
        title="时间明细修改"
        :visible.sync="updOneInfoBox"
        append-to-body
        top="20px"
        @closed="clear('infoForm')"
      >
        <el-container>
          <el-aside width="200px"
          ><el-table
            :data="infoData"
            :default-sort="{ prop: 'timeSlotCode' }"
          >
            <el-table-column
              property="timeSlotCode"
              label="模板下已存在的时间段"
            /> </el-table
          ></el-aside>
          <el-main
          >模板名称:
            <h3 style="display: inline">{{ rowInfo.templateName }}</h3>
            <br />
            <br />
            <el-form
              :model="infoForm"
              :rules="infoRules"
              ref="infoForm"
              :inline="true"
            >
              <el-form-item label="班别:" prop="classes">
                <el-radio-group
                  v-model="infoForm.classes"
                  @change="classesChange"
                >
                  <el-radio label="上午">上午</el-radio>
                  <el-radio label="下午">下午</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="时间段编码:" prop="timeSlotCode">
                <el-input
                  v-model="infoForm.timeSlotCode"
                  :disabled="true"
                  placeholder="自动生成时间段编码"
                />
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
              <el-form-item label="平均看病时长(分钟):" prop="pjkbsc">
                <el-input
                  v-model.number="infoForm.pjkbsc"
                  @change="getSjdhys"
                  placeholder="请输入平均看病时长(分钟)"
                />
              </el-form-item>
              <el-form-item label="时间段号源数:" prop="sjdhys">
                <el-input
                  v-model.number="infoForm.sjdhys"
                  placeholder="请输入时间段号源数"
                />
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="updInfo('infoForm')"
          >保存</el-button
          >
          <el-button @click="updOneInfoBox = false">取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "TimeTemplate",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      organs: [],
      depts: [],
      doctors: [],
      defaultAM: [new Date(2000, 5, 28, 8, 0), new Date(2000, 5, 28, 12, 0)],
      defaultPM: [new Date(2000, 5, 28, 13, 0), new Date(2000, 5, 28, 17, 0)],
      addTimeTemplateBox: false,
      updTimeTemplateBox: false,
      timeTemplateForm: {
        timeTemplateId: "",
        templateBelong: "机构",
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
        templateBelong: [
          {required: true, message: "请选择模板所属", trigger: "change"},
        ],
        useful: [
          {required: true, message: "请选择是否有效", trigger: "change"},
        ],
        organId: [
          {required: true, message: "请选择所属机构", trigger: "change"},
        ],
        deptNo: [
          {required: true, message: "请选择所属部门", trigger: "change"},
        ],
        dId: [{required: true, message: "请选择所属医生", trigger: "change"}],
        templateName: [
          {required: true, message: "请输入模板名称", trigger: "blur"},
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        pinyinCode: [
          {required: true, message: "请生成拼音简码", trigger: "blur"},
        ],
        amTimeArr: [
          {
            required: true,
            message: "请选择上午时间",
            trigger: "change",
          },
        ],
        pmTimeArr: [
          {
            required: true,
            message: "请选择下午时间",
            trigger: "change",
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
      updOneInfoBox: false,
      infoForm: {
        timesLotId: "",
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
        pjkbsc: [{ type: "number", message: "平均看病时长必须为数字" }],
        sjdhys: [{ type: "number", message: "请输入时间段号源数(数字)" }],
      },
      timeStart: "",
      timeEnd: "",
      takeNumStart: "",
    }
  },
  methods: {


    templateBelongRadioChange(val) {
      if (val === "机构") {
        this.timeTemplateForm.organId = "";
        this.deptDisabled = true;
        this.depts = [];
        this.timeTemplateForm.deptNo = "";
        this.doctorDisabled = true;
        this.doctors = [];
        this.timeTemplateForm.dId = "";
        this.deptProp = "";
        this.doctorProp = "";
      }
      if (val === "科室") {
        this.deptDisabled = false;
        this.timeTemplateForm.deptNo = "";
        this.doctorDisabled = true;
        this.doctors = [];
        this.timeTemplateForm.dId = "";
        this.deptProp = "deptNo";
        this.doctorProp = "";
      }
      if (val === "医生") {
        this.deptDisabled = false;
        this.doctorDisabled = false;
        this.deptProp = "deptNo";
        this.doctorProp = "dId";
      }
    },
    templateSelectChange(val) {
      if (val === "机构") {
        this.findForm.organId = "";
        this.deptDisabled1 = true;
        this.depts = [];
        this.findForm.deptNo = "";
        this.doctorDisabled1 = true;
        this.doctors = [];
        this.findForm.dId = "";
      }
      if (val === "科室") {
        this.deptDisabled1 = false;
        this.findForm.deptNo = "";
        this.doctorDisabled1 = true;
        this.doctors = [];
        this.findForm.dId = "";
      }
      if (val === "医生") {
        this.deptDisabled1 = false;
        this.doctorDisabled1 = false;
      }
    },
    formatStatus(row) {
      return row.useful == "1" ? "否" : "是";
    },
    // toDetails(index,row){
    //   sessionStorage.setItem("timeTemplateId",row.timeTemplateId);
    //   sessionStorage.setItem("mingzi",row.mingzi);
    //   location.href='http://localhost:8080/#/mingzi'
    // },
    getInfo(row) {
      this.infoData = [];
      this.infoTitle = row.templateName;
      this.rowInfo = row;
      var vm = this;
      this.classesChange("上午");
      this.axios({
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_sel",
        method: "get",
        params: { id: row.timeTemplateId },
      }).then(function (res) {
        vm.infoData = res.data;
        vm.timeTemplateInfo = true;
      });
    },
    addInfo(formName) {
      var vm =this;
      this.$refs[formName].validate((valid) => {
        if (valid){
          this.axios({
            url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_save",
            method: "post",
            data:{
              templateId: vm.rowInfo.timeTemplateId,
              classes: vm.infoForm.classes,
              timeSlotCode: vm.infoForm.timeSlotCode,
              start: vm.infoForm.start,
              end: vm.infoForm.end,
              takeNumStart: vm.infoForm.takeNumStart,
              takeNumEnd: vm.infoForm.takeNumEnd,
              pjkbsc: vm.infoForm.pjkbsc,
              sjdhys: vm.infoForm.sjdhys,
            },
          }).then(function (res){
            if (res.data === 1) {
              vm.$message.success("添加成功!");
              vm.refresh(vm.rowInfo);
              if (vm.isMore) {
                vm.clear(formName);
              } else {
                vm.addOneInfoBox = false;
              }
            }

          })
            .catch(function () {
            vm.$message.error("添加失败!");
          });

        }else {
          vm.$message.error("格式错误!");
        }
        });
    },
    infoHandleEdit(row) {
      var vm = this;
      this.infoForm.timeSlotId = row.timeSlotId;
      this.infoForm.classes = row.classes;
      this.classesChange(row.classes);
      this.infoForm.timeSlotCode = row.timeSlotCode;
      this.$nextTick(() => {
        this.infoForm.start = row.start;
        this.startChange();
        this.infoForm.end = row.end;
        this.endChange();
        this.infoForm.takeNumStart = row.takeNumStart;
        this.takeNumStartChange();
        this.infoForm.takeNumEnd = row.takeNumEnd;
        this.infoForm.pjkbsc = row.pjkbsc;
        this.infoForm.sjdhys = row.sjdhys;
      });
      vm.updOneInfoBox = true;
    },
    updInfo(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_update",
            method: "post",
            data: {
              timeSlotId: vm.infoForm.timeSlotId,
              templateId: vm.rowInfo.timeTemplateId,
              classes: vm.infoForm.classes,
              timeSlotCode: vm.infoForm.timeSlotCode,
              start: vm.infoForm.start,
              end: vm.infoForm.end,
              takeNumStart: vm.infoForm.takeNumStart,
              takeNumEnd: vm.infoForm.takeNumEnd,
              pjkbsc: vm.infoForm.pjkbsc,
              sjdhys: vm.infoForm.sjdhys,
            },

          })
            .then(function (res) {
              if (res.data === 1) {
                vm.$message.success("修改成功!");
                vm.refresh(vm.rowInfo);
                vm.addOneInfoBox = false;
              } else if (res.data === 10) {
                vm.$message.error("该时间段重复!");
              } else {
                vm.$message.error("修改失败!");
              }
            })
            .catch(function () {
              vm.$message.error("修改失败!");
            });
        } else {
          vm.$message.error("格式错误!");
        }
      });
    },


    refresh(row) {
      this.infoData = [];
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_sel",
        method: "get",
        params: { id: row.timeTemplateId },
      }).then(function (res) {
        vm.infoData = res.data;
      });
    },

    organIdSelectChange(val) {
      this.depts = [];
      this.timeTemplateForm.deptNo = "";
      this.doctors = [];
      this.timeTemplateForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ksxx?organId=" + val,
      }).then(function (res) {
        vm.depts = res.data;
      });

    },
    organIdSelectChange1(val) {
      this.depts = [];
      this.findForm.deptNo = "";
      this.doctors = [];
      this.findForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ksxx?organId=" + val,
      }).then(function (res) {
        vm.depts = res.data;
      });
    },
    startChange() {
      this.infoForm.end = "";
      this.infoForm.takeNumStart = "";
      this.infoForm.takeNumEnd = "";
      this.infoForm.sjdhys = "";
      var index = this.infoForm.start.indexOf(":");
      var length = this.infoForm.start.length;
      var hour = this.infoForm.start.substring(0, index);
      var min = this.infoForm.start.substring(index + 1, length);
      hour = hour - 1 < 10 ? "0" + (hour - 1) : hour - 1;
      this.takeNumStart = hour + ":" + min;
    },
    deptNoSelectChange(val) {
      this.doctors = [];
      this.timeTemplateForm.dId = "";
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_ryxx?deptNo=" + val,
      }).then(function (res) {
        vm.doctors = res.data;
      });
    },
    deptNoSelectChange1(val) {
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
    takeNumStartChange() {
      this.infoForm.takeNumEnd = "";
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
    endChange() {
      if (this.infoForm.start != "" && this.infoForm.end != "") {
        this.infoForm.timeSlotCode =
          this.infoForm.start + "-" + this.infoForm.end;
      }
      this.infoForm.takeNumStart = "";
      this.infoForm.takeNumEnd = "";
      this.getSjdhys(this.infoForm.pjkbsc);
    },
    TimeTemplate() {
      var vm = this;
      this.axios({
        method: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/init",
      }).then(function (res) {
        vm.tableData = res.data;
        vm.getPageInfo();
      });
      this.axios({
        methods: "get",
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/get_jgxx",
      }).then(function (res) {
        vm.organs = res.data;
      })
    },

    classesChange(val) {
      this.infoForm.start = "";
      this.infoForm.end = "";
      if (val === "上午") {
        this.timeStart = this.rowInfo.amStart;
        this.timeEnd = this.rowInfo.amStop;
      } else {
        this.timeStart = this.rowInfo.pmStart;
        this.timeEnd = this.rowInfo.pmStop;
      }
      this.infoForm.takeNumStart = "";
      this.infoForm.takeNumEnd = "";
    },


    addTimeTemplate(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.timeTemplateForm.amStart = this.timeTemplateForm.amTimeArr[0];
          this.timeTemplateForm.amStop = this.timeTemplateForm.amTimeArr[1];
          this.timeTemplateForm.pmStart = this.timeTemplateForm.pmTimeArr[0];
          this.timeTemplateForm.pmStop = this.timeTemplateForm.pmTimeArr[1];
          var amStartHour =
            this.timeTemplateForm.amStart.getHours() < 10
              ? "0" + this.timeTemplateForm.amStart.getHours()
              : this.timeTemplateForm.amStart.getHours();
          var amStartMinute =
            this.timeTemplateForm.amStart.getMinutes() < 10
              ? "0" + this.timeTemplateForm.amStart.getMinutes()
              : this.timeTemplateForm.amStart.getMinutes();
          var amStopHour =
            this.timeTemplateForm.amStop.getHours() < 10
              ? "0" + this.timeTemplateForm.amStop.getHours()
              : this.timeTemplateForm.amStop.getHours();
          var amStopMinute =
            this.timeTemplateForm.amStop.getMinutes() < 10
              ? "0" + this.timeTemplateForm.amStop.getMinutes()
              : this.timeTemplateForm.amStop.getMinutes();
          this.timeTemplateForm.amTime =
            amStartHour +
            ":" +
            amStartMinute +
            "-" +
            amStopHour +
            ":" +
            amStopMinute;
          var pmStartHour =
            this.timeTemplateForm.pmStart.getHours() < 10
              ? "0" + this.timeTemplateForm.pmStart.getHours()
              : this.timeTemplateForm.pmStart.getHours();
          var pmStartMinute =
            this.timeTemplateForm.pmStart.getMinutes() < 10
              ? "0" + this.timeTemplateForm.pmStart.getMinutes()
              : this.timeTemplateForm.pmStart.getMinutes();
          var pmStopHour =
            this.timeTemplateForm.pmStop.getHours() < 10
              ? "0" + this.timeTemplateForm.pmStop.getHours()
              : this.timeTemplateForm.pmStop.getHours();
          var pmStopMinute =
            this.timeTemplateForm.pmStop.getMinutes() < 10
              ? "0" + this.timeTemplateForm.pmStop.getMinutes()
              : this.timeTemplateForm.pmStop.getMinutes();
          this.timeTemplateForm.pmTime =
            pmStartHour +
            ":" +
            pmStartMinute +
            "-" +
            pmStopHour +
            ":" +
            pmStopMinute;
          console.log(this.timeTemplateForm);
          this.axios({
            url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmb_save",
            method: "post",
            data: {
              templateName: vm.timeTemplateForm.templateName,
              templateBeLong: vm.timeTemplateForm.templateBelong,
              amTime: vm.timeTemplateForm.amTime,
              amStart:
                vm.timeTemplateForm.amStart.getHours() +
                ":" +
                vm.timeTemplateForm.amStart.getMinutes(),
              amStop:
                vm.timeTemplateForm.amStop.getHours() +
                ":" +
                vm.timeTemplateForm.amStop.getMinutes(),
              pmTime: vm.timeTemplateForm.pmTime,
              pmStart:
                vm.timeTemplateForm.pmStart.getHours() +
                ":" +
                vm.timeTemplateForm.pmStart.getMinutes(),
              pmStop:
                vm.timeTemplateForm.pmStop.getHours() +
                ":" +
                vm.timeTemplateForm.pmStop.getMinutes(),
              organ: {organId: vm.timeTemplateForm.organId},
              dept: {deptNo: vm.timeTemplateForm.deptNo},
              doctor: {did: vm.timeTemplateForm.dId},
              useFul: vm.timeTemplateForm.useful,
              pinyinCode: vm.timeTemplateForm.pinyinCode,
            },
          }).then(function (res) {
            if (res.data == "success") {
              vm.addTimeTemplateBox = false
              vm.TimeTemplate();
              vm.$message.success('增加成功');

            }

          });
        } else {
          alert("error!");
          return false;
        }
      });
    },
    infoHandleDelete(row) {
      var vm = this;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.axios({
          method: "post",
          url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmx_del",
          data: {
            timesLotId: row.timesLotId,
          },
        })
          .then(function (res) {
            if (res.data === 1) {
              vm.$message.success("删除成功");
              vm.refresh(vm.rowInfo);
            } else {
              vm.$message.error("删除失败");
            }
          })
          .catch(function () {
            vm.$message.error("删除失败");
          });
      });
    },
    clear(formName) {
      this.$refs[formName].resetFields();
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

    handleEdit(row) {
      this.updTimeTemplateBox = true;

      console.log(row)
      this.timeTemplateForm.timeTemplateId = row.timeTemplateId;
      this.timeTemplateForm.templateBelong = row.templateBeLong;
      this.templateBelongRadioChange(this.timeTemplateForm.templateBelong);
      this.timeTemplateForm.useful = row.useFul.toString();
      this.timeTemplateForm.organId = row.organ.organId;
      this.organIdSelectChange(this.timeTemplateForm.organId);
      if (row.dept != null) {
        this.timeTemplateForm.deptNo = row.dept.deptNo;
        this.deptNoSelectChange(this.timeTemplateForm.deptNo);
        if (row.doctor != null) {
          this.timeTemplateForm.dId = row.doctor.did;
        }
      }
      this.timeTemplateForm.templateName = row.templateName;
      this.timeTemplateForm.pinyinCode = row.pinyinCode;
      this.timeTemplateForm.amTimeArr = [];
      this.timeTemplateForm.amTimeArr[0] = new Date(
        2000,
        5,
        28,
        row.amStart.substring(0, row.amStart.indexOf(":")),
        row.amStart.substring(row.amStart.indexOf(":") + 1, row.amStart.length)
      );
      this.timeTemplateForm.amTimeArr[1] = new Date(
        2000,
        5,
        28,
        row.amStop.substring(0, row.amStop.indexOf(":")),
        row.amStop.substring(row.amStop.indexOf(":") + 1, row.amStop.length)
      );
      this.timeTemplateForm.pmTimeArr = [];
      this.timeTemplateForm.pmTimeArr[0] = new Date(
        2000,
        5,
        28,
        row.pmStart.substring(0, row.pmStart.indexOf(":")),
        row.pmStart.substring(row.pmStart.indexOf(":") + 1, row.pmStart.length)
      );
      this.timeTemplateForm.pmTimeArr[1] = new Date(
        2000,
        5,
        28,
        row.pmStop.substring(0, row.pmStop.indexOf(":")),
        row.pmStop.substring(row.pmStop.indexOf(":") + 1, row.pmStop.length)
      );
    },

    handleDelete(index, row) {
      var vm = this;
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmb_del",
          data: {
            timeTemplateId: row.timeTemplateId,
          }
        }).then(function (res) {
          if (res.data == "success") {
            vm.$message.success('删除成功');
            vm.TimeTemplate();
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
        var timeTemplateIds = '';
        for (let i = 0; i < this.multipleSelection.length; i++) {
          timeTemplateIds += 'timeTemplateId=' + this.multipleSelection[i].timeTemplateId + '&';
        }

        this.axios({
          method: 'get',
          url: 'http://localhost:8088/hygl/cspzgl/sjdpz/sjdmb_delMove?' + timeTemplateIds,
        }).then(function (res) {
          if (res.data > 0) {
            vm.$message.success('成功删除' + res.data + '条数据');
            vm.TimeTemplate();
          } else {
            vm.$message.error('删除失败');
          }
        }).catch(function () {
          vm.$message.error('删除失败');
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    findByKey() {
      var vm = this;
      this.axios({
        url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmb_sel",
        method: "get",
        params: {
          // templateName: vm.findForm.templateName,
          // templateBelong: vm.findForm.templateBelong,
          templateName: vm.findForm.templateName,
          templateBelong: vm.findForm.templateBelong,
          useful: vm.findForm.useful,
          organId: vm.findForm.organId,
          deptNo: vm.findForm.deptNo,
          dId: vm.findForm.dId,
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
    updTimeTemplate(formName) {
      var vm = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.timeTemplateForm.amStart = this.timeTemplateForm.amTimeArr[0];
          this.timeTemplateForm.amStop = this.timeTemplateForm.amTimeArr[1];
          this.timeTemplateForm.pmStart = this.timeTemplateForm.pmTimeArr[0];
          this.timeTemplateForm.pmStop = this.timeTemplateForm.pmTimeArr[1];
          var amStartHour =
            this.timeTemplateForm.amStart.getHours() < 10
              ? "0" + this.timeTemplateForm.amStart.getHours()
              : this.timeTemplateForm.amStart.getHours();
          var amStartMinute =
            this.timeTemplateForm.amStart.getMinutes() < 10
              ? "0" + this.timeTemplateForm.amStart.getMinutes()
              : this.timeTemplateForm.amStart.getMinutes();
          var amStopHour =
            this.timeTemplateForm.amStop.getHours() < 10
              ? "0" + this.timeTemplateForm.amStop.getHours()
              : this.timeTemplateForm.amStop.getHours();
          var amStopMinute =
            this.timeTemplateForm.amStop.getMinutes() < 10
              ? "0" + this.timeTemplateForm.amStop.getMinutes()
              : this.timeTemplateForm.amStop.getMinutes();
          this.timeTemplateForm.amTime =
            amStartHour +
            ":" +
            amStartMinute +
            "-" +
            amStopHour +
            ":" +
            amStopMinute;
          var pmStartHour =
            this.timeTemplateForm.pmStart.getHours() < 10
              ? "0" + this.timeTemplateForm.pmStart.getHours()
              : this.timeTemplateForm.pmStart.getHours();
          var pmStartMinute =
            this.timeTemplateForm.pmStart.getMinutes() < 10
              ? "0" + this.timeTemplateForm.pmStart.getMinutes()
              : this.timeTemplateForm.pmStart.getMinutes();
          var pmStopHour =
            this.timeTemplateForm.pmStop.getHours() < 10
              ? "0" + this.timeTemplateForm.pmStop.getHours()
              : this.timeTemplateForm.pmStop.getHours();
          var pmStopMinute =
            this.timeTemplateForm.pmStop.getMinutes() < 10
              ? "0" + this.timeTemplateForm.pmStop.getMinutes()
              : this.timeTemplateForm.pmStop.getMinutes();
          this.timeTemplateForm.pmTime =
            pmStartHour +
            ":" +
            pmStartMinute +
            "-" +
            pmStopHour +
            ":" +
            pmStopMinute;
          this.axios({
            url: "http://localhost:8088/hygl/cspzgl/sjdpz/sjdmb_update",
            method: "post",
            data: {
              timeTemplateId: vm.timeTemplateForm.timeTemplateId,
              templateName: vm.timeTemplateForm.templateName,
              templateBeLong: vm.timeTemplateForm.templateBelong,
              amTime: vm.timeTemplateForm.amTime,
              amStart:
                vm.timeTemplateForm.amStart.getHours() +
                ":" +
                vm.timeTemplateForm.amStart.getMinutes(),
              amStop:
                vm.timeTemplateForm.amStop.getHours() +
                ":" +
                vm.timeTemplateForm.amStop.getMinutes(),
              pmTime: vm.timeTemplateForm.pmTime,
              pmStart:
                vm.timeTemplateForm.pmStart.getHours() +
                ":" +
                vm.timeTemplateForm.pmStart.getMinutes(),
              pmStop:
                vm.timeTemplateForm.pmStop.getHours() +
                ":" +
                vm.timeTemplateForm.pmStop.getMinutes(),
              organ: {organId: vm.timeTemplateForm.organId},
              dept: {deptNo: vm.timeTemplateForm.deptNo},
              doctor: {did: vm.timeTemplateForm.dId},
              useful: vm.timeTemplateForm.useful,
              pinyinCode: vm.timeTemplateForm.pinyinCode,
            },
          })
            .then(function (res) {
              if (res.data == "success") {
                vm.$message.success("修改成功!");
                vm.TimeTemplate();
                vm.updTimeTemplateBox = false;
              } else {
                vm.$message.error("修改失败!");
              }
            })
            .catch(function () {
              vm.$message.error("修改失败!");
            });
        } else {
          vm.$message.error("格式错误!");
          return false;
        }
      });
    },

  },
  created: function () {
    this.TimeTemplate();
  }
}
</script>

<style scoped>

</style>
