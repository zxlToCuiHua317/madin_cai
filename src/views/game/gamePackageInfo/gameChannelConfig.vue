<template>
  <div class="app-container">
    <div v-if="query.packId === ''">
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
        <rrOperation :crud="crud" />
        <crudOperation :permission="permission" />
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
            <el-form-item v-if="isShow" label="pickid">
              <el-input
                v-model="scopeData.packId"
                placeholder="请输入消息标题"
                style="width: 80%"
                disabled
              />
            </el-form-item>
            <el-form-item label="gameCode" prop="gameCode">
              <el-input
                v-model="scopeData.gameCode"
                placeholder="请输入gameCode"
                style="width: 80%"
                disabled
              />
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
            <el-form-item label="渠道费率" prop="channelFee">
              <el-input-number v-model="scopeData.channelFee" :precision="0" :max="100" />
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
          <el-table-column align="center" prop="gameCode" label="gameCode" />
          <el-table-column align="center" prop="channelType" label="储值渠道" />
          <el-table-column align="center" prop="channelFee" label="渠道费率" />
          <el-table-column align="center" prop="createTime" label="创建时间" />
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
                      @click="editConfig(scope.row)"
                    />
                  </div>
                  <div class="edit">
                    <el-button
                      :disabled="!checkPer(['admin','gamePackageInfo:del'])"
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="delConfig(scope.row)"
                    />
                  </div>
                </div>
              </el-popover>
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
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {}
export default {
  name: 'GameChannelConfig',
  components: { pagination, rrOperation, crudOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: 'GameChannelConfig',
      url: '/api/gameChannelConfig',
      idField: 'id',
      sort: 'id,desc',
      query: { packId: '' },
      crudMethod: { ...crudRefGameChannelConfig },
      queryOnPresenterCreated: false
    })
  },
  // 数据字典
  dicts: ['channel_type'],
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
        packId: null,
        gameCode: null,
        channelType: null,
        channelFee: null,
        remark: null
      },
      permission: {
        add: ['admin', 'gameChannelConfig:add'],
        edit: ['admin', 'gameChannelConfig:edit'],
        del: ['admin', 'gameChannelConfig:del']
      },
      rules: {
        gameCode: [{ required: true, message: 'gameCode不能为空', trigger: 'blur' }],
        channelType: [{ required: true, message: '储值渠道不能为空', trigger: 'change' }],
        channelFee: [{ required: true, message: '渠道费率不能为空', trigger: 'blur' }]
      },
      channelArr: null,
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
    this.channelArr = this.dict.channel_type
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getNumCon(data) {
      console.log(data)
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
      console.log(this.query)
      console.log(this.query.gameCode)
      this.scopeData.gameCode = this.query.gameCode
      const deepData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in deepData) {
        deepData[key] = null
      }
      deepData.gameCode = this.query.gameCode
      this.scopeData.deepData
      this.isShowDelg = !this.isShowDelg
      this.curdHook = 'add'
      this.dlogTitle = `新增配置`
    },
    editConfig(data) {
      const deepData = JSON.parse(JSON.stringify(data))
      console.log(deepData)
      this.isShowDelg = !this.isShowDelg
      this.scopeData = deepData
      this.curdHook = 'edit'
      this.dlogTitle = `编辑配置`
    },
    getServiceValue() {
      const _this = this
      console.log(this.query)
      this.scopeData.packId = this.query.packId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          switch (this.curdHook) {
            case 'add':
              _this.dialogLoading = true
              crudRefGameChannelConfig.add(_this.scopeData).then(res => {
                _this.$notify({
                  message: '新增成功',
                  type: 'success'
                })
                _this.closeTip()
                _this.crud.refresh()
                _this.dialogLoading = false
              })
              break
            case 'edit':
              _this.dialogLoading = true
              crudRefGameChannelConfig.edit(this.scopeData).then(res => {
                this.$notify({
                  message: '编辑成功',
                  type: 'success'
                })
                _this.closeTip()
                this.crud.refresh()
                _this.dialogLoading = false
              })
          }
        } else {
          return false
        }
      })
    },
    delConfig(data) {
      const ids = []
      ids.push(data.id)
      crudRefGameChannelConfig.del(ids).then(res => {
        this.$notify({
          message: '删除成功',
          type: 'success'
        })
        this.crud.refresh()
      })
    },
    delImgPath() {
      this.curdHook = 'delImg'
      this.scopeData.imagePath = ''
    },
    closeTip() {
      this.isShowDelg = !this.isShowDelg
      this.dialogLoading = false
      this.fileList = []
      this.$refs['form'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    beforClose() {
      this.isShowDelg = !this.isShowDelg
      this.dialogLoading = false
      this.fileList = []
      this.$refs['form'].resetFields()
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
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
