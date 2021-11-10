<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.tempType"
          clearable
          size="small"
          placeholder="模板类型"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in moduleType"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 150px"
        >
          <el-option
            v-for="item in download_status"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="query.criteria"
          clearable
          placeholder="条件"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-date-picker
          v-model="query.uploadTime"
          type="month"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM"
          placeholder="导出范围"
        />
        <rrOperation :crud="crud" />
        <el-button
          v-show="isShowDlog"
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!checkPer(['admin','channelDownloadRecord:add'])"
          class="filter-item "
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addGameInfo()"
        >新增</el-button>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="beforeClose" :visible.sync="isShowDlog" :title="dlogTitle" width="500px">
        <el-form ref="scopeData" :model="scopeData" :rules="rules" size="small" label-width="80px">
          <el-form-item label="模板类型" prop="tempType">
            <el-select
              v-model="scopeData.tempType"
              clearable
              size="small"
              placeholder="模板类型"
              class="filter-item"
              style="width: 150px"
              @change="getModule"
            >
              <el-option
                v-for="item in moduleType"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isChannel" label="渠道" prop="channelType">
            <el-select
              v-model="scopeData.channelType"
              clearable
              size="small"
              placeholder="渠道"
              class="filter-item"
              style="width: 150px"
            >
              <el-option
                v-for="item in channel_type"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isGame" label="游戏代码" prop="gameCode">
            <el-select
              v-model="scopeData.gameCode"
              clearable
              size="small"
              placeholder="游戏代码"
              class="filter-item"
              style="width: 150px"
            >
              <el-option
                v-for="item in gameCodeArr"
                :key="item.key"
                :label="item.gameName"
                :value="item.gameCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="导出范围" prop="uploadTime">
            <el-date-picker
              v-model="scopeData.uploadTime"
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
              v-model="scopeData.remark"
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
      <el-table ref="table" v-loading="crud.loading" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="tempType" label="模板类型">
          <template slot-scope="scope">
            {{ dict.label.download_type[scope.row.tempType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="criteria" label="条件">
          <template slot-scope="scope">
            {{ scope.row.criteria }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="uploadTime" label="导出范围" />
        <el-table-column align="center" prop="createBy" label="创建人" />
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.download_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" />
        <el-table-column v-if="checkPer(['admin','channelDownloadRecord:edit'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.status === 3" class="edit">
              <el-button
                size="mini"
                type="warning"
                :disabled="!checkPer(['admin','channelDownloadRecord:edit'])"
                icon="el-icon-download"
                :loading="dialogLoading"
                @click="download(scope.row)"
              >下载</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDownloadRecord from '@/api/channelDownload/channelDownloadRecord'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { parseTimeToMol, downloadFileChannel } from '@/utils/index'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, tempType: null, channelType: null, gameCode: null, uploadTime: null, filename: null, filepath: null, createBy: null, createTime: null, status: null, errMsg: null, updateTime: null, remark: null }
export default {
  name: 'ChannelDownloadRecord',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['download_status', 'channel_type', 'download_type'],
  cruds() {
    return CRUD({ title: '导出任务配置', url: 'api/channelDownloadRecord', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDownloadRecord }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDownloadRecord:add'],
        edit: ['admin', 'channelDownloadRecord:edit'],
        del: ['admin', 'channelDownloadRecord:del']
      },
      rules: {
        tempType: [
          { required: true, message: '模板类型不能为空', trigger: 'blur' }
        ],
        uploadTime: [
          { required: true, message: '导出范围不能为空', trigger: 'change' }
        ],
        gameCode: [
          { required: true, message: '游戏代码不能为空', trigger: 'change' }
        ],
        channelType: [
          { required: true, message: '渠道不能为空', trigger: 'change' }
        ]
      },
      queryTypeOptions: [
        { key: 'tempType', display_name: '模板类型' },
        { key: 'gameCode', display_name: '游戏代码' },
        { key: 'status', display_name: '状态' }
      ],
      moduleType: null,
      download_status: null,
      channel_type: null,
      gameCodeArr: [],
      isShowDlog: false,
      isGame: false,
      isChannel: false,
      curdHook: '',
      dlogTitle: '',
      dialogLoading: false,
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
      },
      scopeData: { tempType: null, channelType: null, gameCode: null, uploadTime: null, remark: null }
    }
  },
  created() {
    console.log(this.dict)
    this.moduleType = this.dict.download_type
    this.download_status = this.dict.download_status
    this.channel_type = this.dict.channel_type
    crudChannelDownloadRecord.getGameCode().then(res => {
      console.log(res)
      this.gameCodeArr.push(res)
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    addGameInfo() {
      const deepData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      this.isShowDlog = !this.isShowDlog
      this.curdHook = 'add'
      this.dlogTitle = '新增'
    },
    sendDataForSer() {
      this.$refs['scopeData'].validate((valid) => {
        if (valid) {
          switch (this.curdHook) {
            case 'add':

              if (this.scopeData.uploadTime[0].getTime() === this.scopeData.uploadTime[1].getTime()) {
                this.scopeData.uploadTime = parseTimeToMol(this.scopeData.uploadTime[0])
              } else {
                this.scopeData.uploadTime = parseTimeToMol(this.scopeData.uploadTime[0]) + '至' + parseTimeToMol(this.scopeData.uploadTime[1])
              }
              if (this.scopeData.tempType && this.scopeData.uploadTime) {
                crudChannelDownloadRecord.add(this.scopeData).then(res => {
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
              }

              console.log(this.scopeData)
              break
          }
        } else {
          return false
        }
      })
    },
    download(data) {
      console.log(data)

      const url = '/api/channelDownloadRecord/downloadTemp'
      this.dialogLoading = true
      crudChannelDownloadRecord.downLoadTemp(url, data.id).then(res => {
        console.log(res)
        downloadFileChannel(res, data.filename)
        this.dialogLoading = false
      }).catch(err => {
        this.dialogLoading = false
        console.log(err)
      })
    },
    beforeClose() {
      this.isChannel = false
      this.isGame = false
      this.isShowDlog = !this.isShowDlog
      this.$refs['scopeData'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    logClose() {
      this.isChannel = false
      this.isGame = false
      this.isShowDlog = !this.isShowDlog
      this.$refs['scopeData'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    getModule(data) {
      switch (data) {
        case '0':
          this.isChannel = true
          this.isGame = false
          // eslint-disable-next-line no-unused-vars
          var { gameCode, ...gameCodedata } = this.rules
          this.rules = gameCodedata
          break
        case '1':
          this.isGame = true
          this.isChannel = false
          // eslint-disable-next-line no-unused-vars
          var { channelType, ...channelTypedata } = this.rules
          this.rules = channelTypedata
          break
        default:
          this.isChannel = false
          this.isGame = false
      }
    }
  }
}
</script>

<style scoped>
::v-deep .crud-opts-left {
  display: none;
}
</style>
