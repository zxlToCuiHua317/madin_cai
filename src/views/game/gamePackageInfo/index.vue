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
                v-model="query.type"
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
            <rrOperation :crud="crud" />
            <crudOperation :permission="permission" />
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
            @row-click="rowEvent"
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
            <el-table-column align="center" prop="game_name" label="游戏名" />
            <el-table-column align="center" prop="online_time" label="上线时间" width="180" />
            <el-table-column align="center" prop="package_name" label="游戏包名" />
            <el-table-column align="center" prop="channel_type" label="渠道">
              <template slot-scope="scope">
                {{ channel_type[scope.row.channel_type] }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="account_num" label="账号" />
            <el-table-column align="center" prop="remark" label="备注" />
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="11" :xl="13">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="crud.getdeptName">{{ crud.getdeptName +" - " }}</span> <span v-if="crud.getuserName">{{ crud.getuserName }}</span> <span>配置查询</span>
          </div>
          <gameChannelConfig ref="gameChannelConfig" :permission="permission" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { crudRefGamePackageInfo } from '@/api/game/gamePackInfo'
import gameChannelConfig from './gameChannelConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
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
      url: '/api/ gamePackageInfo',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudRefGamePackageInfo }
    })
  },
  data() {
    return {
      isShowDelg: false,
      isShow: false,
      scopeData: {
        game_code: null, game_name: null, online_time: null, package_name: null, channel_type: null, account_num: null, remark: null
      },
      permission: {
        add: ['admin', 'gamePackageInfo:add'],
        edit: ['admin', 'gamePackageInfo:edit'],
        del: ['admin', 'gamePackageInfo:del'],
        list: ['admin', 'gameChannelConfig:list']
      },
      rules: {
        gamecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        runstate: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      channelArr: [{ label: 'Google', value: 'Google' }, { label: 'IOS', value: 'IOS' }, { label: '华为', value: '华为' }, { label: 'OPPO', value: 'OPPO' }],
      channel_type: {
        Google: 'Google',
        IOS: 'IOS',
        huawei: '华为',
        oppo: 'oppo'
      },
      curdHook: '',
      dlogTitle: ''
    }
  },

  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.dingConfig) {
        this.$refs.dingConfig.query.packId = ''
      }
      return true
    },
    addConfig() {
      const deepData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'add'
      this.dlogTitle = `新增${this.crud.query.deptName}-${this.crud.query.userName}配置`
    },
    handleCurrentChange(val) {
      if (this.checkPer(['admin', 'gameChannelConfig:list'])) {
        if (val) {
          console.log(val)
          this.$refs.dingConfig.query.packId = val.userId
          this.$refs.dingConfig.crud.toQuery()
        }
      } else {
        this.$message.error('没有权限')
      }
    },
    rowEvent(row) {
      console.log(row)
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
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        .el-form-item__content {
          line-height: 40px;
          position: relative;
          font-size: 14px;
          border-left: 1px solid #ccc;
          padding: 0 10px;
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
