<template>
  <div class="app-container">

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="13" :xl="11" style="margin-bottom: 10px">
        <el-card class="box-card">
          <!--工具栏-->
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input
                v-model="query.gameCode"
                clearable
                placeholder="gameCode"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
              <el-select
                v-model="query.channelType"
                clearable
                size="small"
                placeholder="渠道类型"
                class="filter-item"
                style="width: 150px"
              >
                <el-option
                  v-for="item in channelArr"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="query.onlineTime"
                :default-time="['00:00:00', '23:59:59']"
                type="daterange"
                range-separator=":"
                size="small"
                class="date-item"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
            <el-button
              v-if="crud.optShow.add"
              :disabled="!checkPer(['admin','gamePackageInfo:add'])"
              class="filter-item "
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addConfig()"
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
            <rrOperation :crud="crud" />
            <crudOperation :permission="permission" />
          </div>

          <el-dialog
            :visible.sync="isShowDelg"
            width="750px"
            top="5vh"
            :title="dlogTitle"
            :before-close="beforClose"
            :close-on-click-modal="false"
          >
            <el-form
              ref="scopeData"
              :model="scopeData"
              :rules="rules"
              size="small"
              label-width="120px"
            >
              <el-form-item label="gameCode" prop="gameCode">
                <el-input v-model="scopeData.gameCode" placeholder="请输入gameCode" style="width: 80%;" />
              </el-form-item>
              <el-form-item label="游戏名" prop="gameName">
                <el-input v-model="scopeData.gameName" placeholder="请输入游戏名" style="width: 80%;" />
              </el-form-item>
              <el-form-item label="上线时间" prop="onlineTime">
                <el-date-picker
                  v-model="scopeData.onlineTime"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="游戏包名" prop="packageName">
                <el-input v-model="scopeData.packageName" placeholder="请输入游戏包名" style="width: 80%;" />
              </el-form-item>
              <el-form-item label="渠道" prop="channelType">
                <el-select
                  v-model="scopeData.channelType"
                  clearable
                  size="small"
                  placeholder="渠道类型"
                  class="filter-item"
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in channelArr"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="账号" prop="accountNum">
                <el-input v-model="scopeData.accountNum" placeholder="请输入账号" style="width: 80%;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="scopeData.remark"
                  placeholder="请输入备注"
                  style="width: 80%"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeTip">取消</el-button>
              <el-button
                :loading="dialogLoading"
                type="primary"
                @click="getServiceValue"
              >确认</el-button>
            </div>
          </el-dialog>
          <!--导出表单组件-->
          <el-dialog :close-on-click-modal="false" :before-close="exbeforClose" :visible.sync="isShowDlogEx" :title="dlogTitle" width="500px">
            <el-form ref="exportscopeData" :model="exportscopeData" :rules="exportRules" size="small" label-width="80px">
              <el-form-item label="游戏代码" prop="criteria">
                <el-select
                  v-model="exportscopeData.criteria"
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
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              v-if="isShow"
              align="center"
              prop="id"
              label="id"
              width="60px"
            />
            <el-table-column
              align="center"
              prop="index"
              label="序号"
              width="60px"
            />
            <el-table-column align="center" prop="gameName" label="游戏名" />
            <el-table-column align="center" prop="onlineTime" label="上线时间" width="150">
              <template slot-scope="scope">
                {{ scope.row.onlineTime | dataFormat("1") }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="packageName" label="游戏包名" />
            <el-table-column align="center" prop="channelType" label="渠道" />
            <el-table-column align="center" prop="accountNum" label="账号" />
            <el-table-column align="center" prop="remark" label="备注" />
            <el-table-column
              fixed="right"
              label="操作"
              width="90px"
              align="center"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="bottom-end"
                  popper-class="chProo"
                  trigger="click"
                >
                  <el-button slot="reference" size="mini" icon="el-icon-setting">
                    <i class="fa fa-caret-down" aria-hidden="true" />
                  </el-button>
                  <div class="dise">
                    <div class="edit">
                      <el-button
                        :disabled="!checkPer(['admin','gamePackageInfo:edit'])"
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        :loading="dialogLoading"
                        @click="editInfo(scope.row)"
                      />
                    </div>
                    <div class="del">
                      <el-button
                        :disabled="!checkPer(['admin','gamePackageInfo:del'])"
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        :loading="dialogLoading"
                        @click="delInfo(scope.row)"
                      />
                    </div>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="11" :xl="13">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="getGameCode">{{ getGameName+'('+getGameCode+')'+'-' }}</span><span>储值渠道配置</span>
          </div>
          <gameChannelConfig ref="gameChannelConfig" :row-data="rowData" :permission="permission" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudRefGamePackageInfo from '@/api/game/gamePackInfo'
import crudChannelDownloadRecord from '@/api/channelDownload/channelDownloadRecord'
import gameChannelConfig from './gameChannelConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { parseTime, parseTimeToMol } from '@/utils/index'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = {}
export default {
  name: 'GamePackageInfo',
  components: { pagination, crudOperation, rrOperation, gameChannelConfig },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'gamePackageInfo',
      url: '/api/gamePackageInfo',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudRefGamePackageInfo }
    })
  },
  // 数据字典
  dicts: ['game_pack_channel'],
  data() {
    return {
      isShowDelg: false,
      isShowDlogEx: false,
      isShow: false,
      scopeData: {
        gameCode: null, gameName: null, onlineTime: null, packageName: null, channelType: null, accountNum: null, remark: null
      },
      exportscopeData: { criteria: null, uploadTime: null, remark: null },
      permission: {
        add: ['admin', 'gamePackageInfo:add'],
        edit: ['admin', 'gamePackageInfo:edit'],
        del: ['admin', 'gamePackageInfo:del'],
        list: ['admin', 'gameChannelConfig:list']
      },
      rules: {
        gameCode: [{ required: true, message: 'gameCode不能为空', trigger: 'blur' }],
        gameName: [{ required: true, message: '游戏名不能为空', trigger: 'blur' }],
        onlineTime: [{ required: true, message: '上线时间不能为空', trigger: 'change' }],
        packageName: [{ required: true, message: '游戏包名不能为空', trigger: 'blur' }],
        channelType: [{ required: true, message: '渠道不能为空', trigger: 'change' }],
        accountNum: [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      },
      exportRules: {
        uploadTime: [
          { required: true, message: '导出范围不能为空', trigger: 'change' }
        ],
        criteria: [
          { required: true, message: '游戏代码不能为空', trigger: 'change' }
        ]
      },
      channelArr: null,
      channel_type: null,
      curdHook: '',
      dlogTitle: '',
      dialogLoading: false,
      pop: false,
      rowData: {},
      getGameCode: null,
      getGameName: null,
      gameCodeArr: [],
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
  // eslint-disable-next-line vue/order-in-components
  filters: {
    dataFormat: (msg) => {
      const newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(msg)
      return newDate[0]
    }
  },
  created() {
    console.log(this.dict)
    this.channelArr = this.dict.game_pack_channel
    this.channel_type = this.dict.label.game_pack_channel
    crudChannelDownloadRecord.getGameCode().then(res => {
      console.log(res)
      this.gameCodeArr = res
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      console.log(this.$refs)
      if (this.$refs.gameChannelConfig) {
        this.$refs.gameChannelConfig.query.pack_id = ''
      }
      return true
    },
    addConfig() {
      console.log(this.dict)
      const deepData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'add'
      this.dlogTitle = `新增配置`
    },
    editInfo(data) {
      const deepData = JSON.parse(JSON.stringify(data))
      console.log(deepData)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = deepData
      this.curdHook = 'edit'
      this.dlogTitle = `编辑配置`
    },
    exprotGameInfo() {
      const deepData = JSON.parse(JSON.stringify(this.exportscopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      this.isShowDlogEx = !this.isShowDlogEx
      this.dlogTitle = '导出'
    },
    getServiceValue() {
      const _this = this
      console.log(this.$refs['scopeData'])
      this.$refs['scopeData'].validate((valid) => {
        if (valid) {
          switch (this.curdHook) {
            case 'add':
              _this.dialogLoading = true
              crudRefGamePackageInfo.add(_this.scopeData).then(res => {
                _this.$notify({
                  message: '新增成功',
                  type: 'success'
                })
                _this.closeTip()
                _this.crud.refresh()
                _this.dialogLoading = false
              }).catch(err => {
                _this.$message.error(err)
              })

              break
            case 'edit':
              _this.dialogLoading = true
              crudRefGamePackageInfo.edit(this.scopeData).then(res => {
                this.$notify({
                  message: '编辑成功',
                  type: 'success'
                })
                _this.closeTip()
                this.crud.refresh()
                _this.dialogLoading = false
              }).catch(err => {
                this.$message.error(err)
              })
          }
        } else {
          return false
        }
      })
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.fileList = []
      this.$refs['scopeData'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.fileList = []
      this.$refs['scopeData'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    delInfo(data) {
      this.$confirm(`确认删除选中的数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogLoading = true
        const ids = []
        ids.push(data.id)
        crudRefGamePackageInfo.del(ids).then(res => {
          this.dialogLoading = false
          this.$refs.gameChannelConfig.query.packId = ''
          this.$notify({
            message: '删除成功',
            type: 'success'
          })
          this.crud.refresh()
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(val) {
      if (this.checkPer(['admin', 'gameChannelConfig:list'])) {
        if (val) {
          console.log(val)
          this.getGameCode = val.gameCode
          this.getGameName = val.gameName
          this.rowData = val
          this.$refs.gameChannelConfig.query.packId = val.id
          this.$refs.gameChannelConfig.query.gameCode = val.gameCode
          this.$refs.gameChannelConfig.query.createTime = [parseTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), parseTime(new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)))]
          this.$refs.gameChannelConfig.crud.toQuery()
        }
      } else {
        this.$message.error('没有权限')
      }
    },
    sendDataForSer() {
      this.$refs['exportscopeData'].validate((valid) => {
        if (valid) {
          if (this.exportscopeData.uploadTime[0].getTime() === this.exportscopeData.uploadTime[1].getTime()) {
            this.exportscopeData.uploadTime = parseTimeToMol(this.exportscopeData.uploadTime[0])
          } else {
            this.exportscopeData.uploadTime = parseTimeToMol(this.exportscopeData.uploadTime[0]) + '至' + parseTimeToMol(this.exportscopeData.uploadTime[1])
          }
          this.exportscopeData.tempType = 1
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
  align-items: center;
  .edit {
    margin-bottom: 5px;
  }
  .del {
    margin-bottom: 5px;
  }
}

.postin {
  position: absolute;
}

::v-deep .el-dialog__wrapper {
  .el-dialog {
    overflow: auto;
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
