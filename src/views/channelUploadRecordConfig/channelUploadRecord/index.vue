<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-date-picker
          v-model="query.uploadTime"
          type="month"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM"
          placeholder="选择时间"
        />
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in statusArr"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="数据渠道"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in channelData"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','channelUploadRecord:add'])"
          class="filter-item "
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >新增</el-button>
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','channelUploadRecord:add'])"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="exprotGameInfo()"
        >导出</el-button>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="645px"
        top="5vh"
        title="新增"
        :before-close="beforClose"
        :close-on-click-modal="false"
      >
        <el-form
          ref="scopeData"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="150px"
        >
          <el-form-item label="数据渠道" prop="type">
            <el-select
              v-model="scopeData.type"
              clearable
              size="small"
              placeholder="数据渠道"
              class="filter-item"
              style="width: 150px"
              @change="getDateInfo"
            >
              <el-option
                v-for="item in channelData"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="渠道月份" prop="uploadTime">
            <el-date-picker
              v-model="scopeData.uploadTime"
              type="month"
              range-separator=":"
              size="small"
              class="date-item"
              value-format="yyyy-MM"
              placeholder="选择时间"
              @change="getDateInfo"
            >
              />
            </el-date-picker>
          </el-form-item>
          <el-form-item label="文件上传" prop="uploadFile">
            <el-upload
              ref="upload"
              :limit="1"
              drag
              class="upload-demo"
              action="string"
              list-type="picture-card"
              :before-upload="onBeforeUploadImage"
              :http-request="UploadImage"
              :on-change="fileChange"
              :file-list="fileList"
              :on-exceed="maxFileNum"
              :on-remove="removeImg"
            >
              <i class="el-icon-upload" />
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="scopeData.remark"
              type="textarea"
              :rows="8"
              style="width: 80%"
            />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTip">取消</el-button>
          <el-button
            :loading="isLoading"
            type="primary"
            @click="getServiceValue"
          >确认</el-button>
        </div>
      </el-dialog>
      <!--导出表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="exbeforClose" :visible.sync="isShowDlogEx" :title="dlogTitle" width="500px">
        <el-form ref="exportscopeData" :model="exportscopeData" :rules="exportRules" size="small" label-width="80px">
          <el-form-item label="渠道" prop="criteria">
            <el-select
              v-model="exportscopeData.criteria"
              clearable
              size="small"
              placeholder="渠道"
              class="filter-item"
              style="width: 150px"
            >
              <el-option
                v-for="item in channelData"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="导出范围" prop="uploadTime">
            <el-date-picker
              v-model="exportscopeData.uploadTime"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator=":"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="exportscopeData.remark"
              type="textarea"
              :rows="2"
              style="width: 370px;"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="logClose">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="sendDataForSer">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        :data="crud.data"
        size="small"
        style="width: 100%"
      >
        <el-table-column
          v-if="isShow"
          align="center"
          prop="id"
          label="id"
          width="60px"
        />
        <el-table-column align="center" prop="index" label="序号" width="60" />
        <el-table-column align="center" prop="type" label="数据渠道" />
        <el-table-column align="center" prop="uploadTime" label="渠道月份" width="180" />
        <el-table-column align="center" prop="filename" label="上传文件名" />
        <el-table-column align="center" prop="createTime" label="上传时间" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <div>{{ dict.label.upload_status[scope.row.status] }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" />
        <el-table-column align="center" prop="updateTime" label="处理时间" />
        <el-table-column align="center" prop="errMsg" label="错误信息">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.errMsg" placement="top" title="消息内容" width="300" trigger="hover">
              <div>{{ scope.row.errMsg }}</div>
              <span slot="reference">{{ scope.row.errMsg.substr(0,30) + "..." }}</span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudUploadFile from '@/api/channelUploadRecordConfig/channelUploadRecord'
import crudChannelDownloadRecord from '@/api/channelDownload/channelDownloadRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { parseTimeToMol } from '@/utils/index'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  type: null,
  uploadTime: null,
  filepath: null,
  remark: null
}
export default {
  name: 'ChannelUploadRecord',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'ChannelUploadRecord',
      url: '/api/channelUploadRecord',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudUploadFile }
    })
  },
  dicts: ['channel_type', 'upload_status'],
  data() {
    return {
      isShowDelg: false,
      isShowDlogEx: false,
      isShow: false,
      scopeData: {
        type: null,
        uploadTime: null,
        uploadFile: null,
        remark: null
      },
      exportscopeData: { criteria: null, uploadTime: null, remark: null },
      getStatus: ['等待处理', '处理成功', '处理失败'],
      channelArr: [],
      fileList: [],
      permission: {
        add: ['admin', 'channelUploadRecord:add'],
        edit: ['admin', 'channelUploadRecord:edit'],
        del: ['admin', 'channelUploadRecord:del']
      },
      rules: {
        type: [{ required: true, message: '渠道不能为空', trigger: 'change' }],
        uploadTime: [{ required: true, message: '渠道月份不能为空', trigger: 'change' }],
        uploadFile: [{ required: true, message: '上传文件不能为空', trigger: 'change' }]
      },
      exportRules: {

        uploadTime: [
          { required: true, message: '导出范围不能为空', trigger: 'change' }
        ],

        criteria: [
          { required: true, message: '渠道不能为空', trigger: 'change' }
        ]
      },
      statusArr: null,
      channelData: null,
      curdHook: '',
      logo: null,
      client: null,
      nowDate: new Date().getTime(),
      getRequestUrls: null,
      getuploadPath: null,
      fileName: null,
      fileNamespace: null,
      isLoading: false,
      formData: new FormData(),
      renderFile: new FileReader(),
      dlogTitle: null,
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.channelData = this.dict.channel_type
    this.statusArr = this.dict.upload_status
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },

    onBeforeUploadImage(file) {
      console.log(file)
    },
    removeImg(file, fileList) {
      console.log(fileList)
      if (fileList.length === 0) {
        this.rules.uploadFile = [{ required: true, message: '上传文件不能为空', trigger: 'change' }]
        this.$refs['scopeData'].clearValidate('uploadFile')
      }
      this.fileList = []
    },
    UploadImage() {
    },
    fileChange(file) {
      this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
      this.fileList.push(this.logo)
      if (this.fileList.length === 1) {
        // eslint-disable-next-line no-unused-vars
        var { uploadFile, ...data } = this.rules
        this.rules = data
      }
      this.$refs['scopeData'].clearValidate('uploadFile')
    },
    maxFileNum() {
      this.$message.error('只能上传一个文件哦')
    },
    addGameInfo() {
      const deepData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'add'
      this.dlogTitle = '新增'
    },
    checkUpLadoInfo(data) {
      const deepData = JSON.parse(JSON.stringify(data))
      this.isShowDelg = !this.isShowDelg
      this.scopeData = deepData
      this.curdHook = 'edit'
      this.dlogTitle = '编辑'
    },
    exprotGameInfo() {
      const deepData = JSON.parse(JSON.stringify(this.exportscopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      this.isShowDlogEx = !this.isShowDlogEx
      this.dlogTitle = '导出'
    },
    sendDataForSer() {
      this.$refs['exportscopeData'].validate((valid) => {
        if (valid) {
          if (this.exportscopeData.uploadTime[0].getTime() === this.exportscopeData.uploadTime[1].getTime()) {
            this.exportscopeData.uploadTime = parseTimeToMol(this.exportscopeData.uploadTime[0])
          } else {
            this.exportscopeData.uploadTime = parseTimeToMol(this.exportscopeData.uploadTime[0]) + '至' + parseTimeToMol(this.exportscopeData.uploadTime[1])
          }
          this.exportscopeData.tempType = 0
          crudChannelDownloadRecord.add(this.exportscopeData).then(res => {
            this.$notify({
              message: '新增成功',
              type: 'success'
            })
            this.logClose()
            this.crud.refresh()
          })
        } else {
          this.$notify({
            message: '请填入必填参数',
            type: 'warning'
          })
          return false
        }
      })
    },
    getServiceValue() {
      this.$refs['scopeData'].validate((valid) => {
        if (valid) {
          switch (this.curdHook) {
            case 'add':
              this.isLoading = true
              this.renderFile.read
              this.formData.append('uploadFile', this.fileList[0])
              this.scopeData.uploadFile = this.formData

              if (this.scopeData.type && this.scopeData.uploadFile && this.scopeData.uploadTime) {
                this.formData.append('type', this.scopeData.type)
                this.formData.append('uploadTime', this.scopeData.uploadTime)
                this.formData.append('remark', this.scopeData.remark)
                crudUploadFile.add(this.formData).then(res => {
                  this.isLoading = false
                  this.$notify({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.closeTip()
                  this.crud.refresh()
                  this.formData = new FormData()
                  this.fileList = []
                }).catch(err => {
                  this.isLoading = false
                  this.$message.error(err)
                })
              } else {
                this.isLoading = false
                this.$notify({
                  message: '请填入必填参数',
                  type: 'warning'
                })
              }

              break
          }
        } else {
          return false
        }
      })
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.$refs['scopeData'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      this.fileList = []
      this.isLoading = false
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.$refs['scopeData'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      this.fileList = []
      this.isLoading = false
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    logClose() {
      this.isShowDlogEx = !this.isShowDlogEx
      this.$refs['exportscopeData'].resetFields()
      this.exportscopeData = JSON.parse(JSON.stringify(this.exportscopeData))
      this.isLoading = false
      for (var key in this.exportscopeData) {
        this.exportscopeData[key] = null
      }
    },
    exbeforClose() {
      this.isShowDlogEx = !this.isShowDlogEx
      this.$refs['exportscopeData'].resetFields()
      this.exportscopeData = JSON.parse(JSON.stringify(this.exportscopeData))
      this.isLoading = false
      for (var key in this.exportscopeData) {
        this.exportscopeData[key] = null
      }
    },
    getDateInfo() {
      if (this.scopeData.type) {
        this.crud.data.forEach((item, index) => {
          if (item.type === this.scopeData.type && this.scopeData.uploadTime === item.uploadTime) {
            this.$confirm(this.scopeData.type + '渠道在 "' + this.scopeData.uploadTime + '"已有数据,重复上传会导致之前上传的数据失效!是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

            }).catch(() => {

            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.el-popover.chProo {
  position: absolute;
  background: #fff;
  min-width: 100px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  word-break: break-all;
  .popper__arrow {
    left: 78px !important;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped >
::v-deep .crud-opts-left {
  display: none;
}
::v-deep .el-upload-dragger {
      background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.dise {
  display: flex;
  flex-direction: column;
  .edit {
    margin-bottom: 10px;
  }
  .del {
    margin-bottom: 10px;
  }
}

.postin {
  position: absolute;
}

::v-deep .el-dialog__wrapper {
  .el-dialog {
    overflow: auto;
    border-radius: 5px;
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
      }
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      padding: 0 1px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
      .el-form-item {
        margin-bottom: 0;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        .el-form-item__content {
          line-height: 40px;
          position: relative;
          font-size: 14px;
          border-left: 1px solid #ccc;
          padding: 0 10px;
          margin-bottom: 10px;
        }
      }
    }
    .el-dialog__footer {
      padding: 20px;
      padding-top: 10px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
