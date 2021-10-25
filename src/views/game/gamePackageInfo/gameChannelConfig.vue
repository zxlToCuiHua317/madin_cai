<template>
  <div class="app-container">
    <div v-if="query.pack_id === ''">
      <div class="my-code">点击游戏包查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <div>
          <!-- 搜索 -->
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
            v-model="query.createTime"
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
          :disabled="!checkPer(['admin','gameChannelConfig:add'])"
          class="filter-item "
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addConfig()"
        >新增</el-button>

        <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
        <!-- <crudOperation :permission="permission" /> -->
        <!-- 表单 -->
        <el-dialog
          :visible.sync="isShowDelg"
          width="750px"
          top="5vh"
          height="95%"
          :title="dlogTitle"
          :before-close="beforClose"
          :close-on-click-modal="false"
        >
          <el-form
            ref="form"
            :model="scopeData"
            :rules="rules"
            size="small"
            label-width="120px"
          >
            <el-form-item label="gameCode">
              <el-input
                v-model="scopeData.title"
                placeholder="请输入消息标题"
                style="width: 80%"
                disabled
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
            prop="pack_id"
            label="pack_id"
            width="60px"
          />
          <el-table-column
            align="center"
            prop="index"
            label="序号"
            width="60px"
          />
          <el-table-column align="center" prop="game_code" label="gameCode" />
          <el-table-column align="center" prop="channel_type" label="储值渠道" />
          <el-table-column align="center" prop="channel_fee" label="渠道费率" />
          <el-table-column align="center" prop="create_time" label="创建时间" />
          <el-table-column align="center" prop="remark" label="备注" />
          <el-table-column label="操作" width="90px" align="center" fixed="right">
            <template slot-scope="scope">
              <div v-show="scope.row.status !== 1" class="edit">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="!checkPer(['admin','gameChannelConfig:edit'])"
                  icon="el-icon-edit"
                  @click="editConfig(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import crudRefGameChannelConfig from '@/api/game/gamechanneConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { parseTimes } from '@/utils/index'
// import rrOperation from '@crud/RR.operation'
// import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {}
export default {
  name: 'GameChannelConfig',
  components: { pagination },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'GameChannelConfig',
      url: '/api/dingtalkUserConfig',
      idField: 'id',
      sort: 'id,desc',
      query: { pack_id: '' },
      crudMethod: { ...crudRefGameChannelConfig },
      queryOnPresenterCreated: false
    })
  },
  data() {
    return {
      isShowDelg: false,
      isShow: false,
      offPreview: false,
      dialogVisible: false,
      isUpLoad: true,
      isGetPath: false,
      disabled: false,
      isDel: false,
      scopeData: {
        pack_id: null,
        game_code: null,
        channel_type: null,
        channel_fee: null,
        remark: null
      },
      permission: {
        add: ['admin', 'gameChannelConfig:add'],
        edit: ['admin', 'gameChannelConfig:edit'],
        del: ['admin', 'gameChannelConfig:del']
      },
      rules: {
        gamecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        runstate: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      channelArr: [{ label: 'Google', value: 'Google' }, { label: 'IOS', value: 'IOS' }, { label: '华为', value: '华为' }, { label: 'OPPO', value: 'OPPO' }],
      sendArr: [{ label: '未发送', value: 0 }, { label: '已发送', value: 1 }],
      fileList: [],
      fileName: null,
      fileNamespace: null,
      nowDate: Date.now(),
      getRequestUrls: null,
      getuploadPath: null,
      getImgPath: null,
      dialogLoading: false,
      curdHook: '',
      dlogTitle: ''
    }
  },
  created() {
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },

    onBeforeUploadImage(file) {
      console.log(file)
    },
    UploadImage(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.getRequestUrls = file
      this.dialogVisible = true
    },
    imgDel() {
      this.isDel = true
      this.fileList = []
    },
    fileChange(file, fileList) {
      this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
      this.fileList = fileList
      if (this.curdHook === 'edit') {
        const GETIMG = JSON.parse(JSON.stringify(this.scopeData))
        const _this = this
        const filename = GETIMG.imagePath.replace('http://lp-img-hk.oss-cn-hongkong.aliyuncs.com/ref/', '')
        this.client.put(this.getuploadPath + filename, this.fileList[0].raw).then(function(r1) {
          _this.getRequestUrls = r1.url
        // 判断是否 上传成功 并且 获取到了 上传访问路径
        }).then(r2 => {
          console.log(r2)
        })
          .catch(function(err) {
            _this.$message.error(err)
          })
      }
    },
    maxFileNum() {
      this.$message.error('只能上传一个文件哦')
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
    editConfig(data) {
      const deepData = JSON.parse(JSON.stringify(data))
      console.log(deepData)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = deepData
      this.curdHook = 'edit'
      this.dlogTitle = `编辑${this.crud.query.deptName}-${this.crud.query.userName}配置`
      this.fileList = [{ url: deepData.imagePath }]
    },
    getServiceValue() {
      const _this = this
      switch (this.curdHook) {
        case 'add':
          this.scopeData.userId = this.query.userId
          if (this.fileList.length === 0) {
            _this.$notify({
              message: '请先选择图片后在提交',
              type: 'error'
            })
            return
          }
          this.fileName = this.fileList[0].name
          this.fileNamespace = this.fileName.split('.')
          if (_this.scopeData.content && _this.scopeData.sendTime && _this.scopeData.imagePath && _this.scopeData.title) {
            _this.scopeData.sendTime = parseTimes(_this.scopeData.sendTime)
            _this.dialogLoading = true
            crudRefGameChannelConfig.add(_this.scopeData).then(res => {
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
          } else {
            _this.$notify({
              message: '请填入必选数据',
              type: 'error'
            })
          }
          break
        case 'edit':
          if (_this.scopeData.content && _this.scopeData.sendTime && _this.scopeData.imagePath && _this.scopeData.title) {
            _this.dialogLoading = true
            crudRefGameChannelConfig.edit(this.scopeData).then(res => {
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
          } else {
            _this.$notify({
              message: '请填入必选数据',
              type: 'error'
            })
          }
          break
      }
    },
    delConfig() {
      crudRefGameChannelConfig.del()
    },
    delImgPath() {
      this.curdHook = 'delImg'
      this.scopeData.imagePath = ''
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.fileList = []
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        if (key === 'content') { this.scopeData[key] = '' } else {
          this.scopeData[key] = null
        }
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.fileList = []
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        if (key === 'content') { this.scopeData[key] = '' } else {
          this.scopeData[key] = null
        }
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
::v-deep .ql-editor{
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* line-height: 1.42; */
    height: 300px;
    outline: none;
    overflow-y: auto;
    padding: 12px 15px;
    -o-tab-size: 4;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
}
::v-deep .crud-opts-left {
  display: none;
}
::v-deep .el-upload-list__item-thumbnail{
    width: 100%;
    height: 100%;
    object-fit: contain;
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
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
