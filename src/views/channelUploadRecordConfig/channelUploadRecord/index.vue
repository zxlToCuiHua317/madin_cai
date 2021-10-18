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
        <rrOperation :crud="crud" />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          class="filter-item postin"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="addGameInfo()"
        >新增</el-button>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="645px"
        top="5vh"
        height="95%"
        title="新增"
        :before-close="beforClose"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="150px"
        >
          <el-form-item label="渠道类型">
            <el-select
              v-model="scopeData.type"
              clearable
              size="small"
              placeholder="渠道类型"
              class="filter-item"
              style="width: 150px"
              :disabled="isFlag"
            >
              <el-option
                v-for="item in channelArr"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="上传时间">
            <el-date-picker
              v-model="scopeData.uploadTime"
              type="month"
              range-separator=":"
              size="small"
              class="date-item"
              value-format="yyyy-MM"
              placeholder="选择时间"
            >
              />
            </el-date-picker></el-form-item>

          <el-form-item label="备注">
            <el-input
              v-model="scopeData.remark"
              type="textarea"
              :rows="8"
              style="width: 80%"
            />
          </el-form-item>

          <el-form-item v-if="isAdd" label="文件上传">
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
            >
              <i class="el-icon-upload" />
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTip">取消</el-button>
          <el-button
            :loading="crud.cu === 2"
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
        <el-table-column align="center" prop="type" label="渠道类型" />
        <el-table-column align="center" prop="uploadTime" label="上传时间" width="180" />
        <el-table-column align="center" prop="filename" label="上传文件名" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <div>{{ getStatus[scope.row.status] }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" />
        <el-table-column align="center" prop="errMsg" label="错误信息">
          <template slot-scope="scope">
            <el-popover placement="top" title="消息内容" width="300" trigger="hover">
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
import { crudUploadFile } from '@/api/channelUploadRecordConfig/channelUploadRecord'
import { parseTime } from '@/utils/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
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
  data() {
    return {
      isShowDelg: false,
      isShow: false,
      scopeData: {
        type: null,
        uploadTime: null,
        filepath: null,
        remark: null
      },
      getStatus: ['上传完成等待处理', '处理完成且处理成功', '处理失败'],
      channelArr: [],
      fileList: [],
      permission: {
        add: ['admin', 'channelUploadRecord:add'],
        edit: ['admin', 'channelUploadRecord:edit'],
        del: ['admin', 'channelUploadRecord:del']
      },
      rules: {
        gamecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        runstate: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      statusArr: [
        { label: '等待处理', value: 0 },
        { label: '处理成功', value: 1 },
        { label: '处理失败', value: 2 }
      ],
      curdHook: '',
      logo: null,
      client: null,
      nowDate: new Date().getTime(),
      getRequestUrls: null,
      getuploadPath: null,
      isAdd: true,
      isEdit: false,
      fileName: null,
      fileNamespace: null,
      isFlag: false
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
    UploadImage() {},
    fileChange(file) {
      this.logo = file.raw // 取出上传文件的对象，在其它地方也可以使用
      this.fileList.push(this.logo)
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
      this.isEdit = true
      this.isAdd = false
      this.isFlag = true
      const deepData = JSON.parse(JSON.stringify(data))
      this.isShowDelg = !this.isShowDelg
      this.scopeData = deepData
      this.curdHook = 'edit'
      this.dlogTitle = '编辑'
    },
    getServiceValue() {
      const _this = this
      switch (this.curdHook) {
        case 'add':

          console.log(this.fileList)
          this.fileName = this.fileList[0].name
          this.fileNamespace = this.fileName.split('.')
          // 实例化OSS Client。
          // object表示上传到OSS的文件名称。
          // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
          this.client.put(this.getuploadPath + this.nowDate + '.' + this.fileNamespace[1], this.fileList[0]).then(function(r1) {
            console.log('put success: %j', r1)
            _this.getRequestUrls = r1.url
            // 判断是否 上传成功 并且 获取到了 上传访问路径
            if (_this.getRequestUrls) {
              _this.scopeData.createTime = parseTime(new Date())
              _this.scopeData.filepath = _this.getRequestUrls
              _this.scopeData.status = 0
              crudUploadFile.add(_this.scopeData).then(res => {
                _this.$notify({
                  message: '新增成功',
                  type: 'warning'
                })
                _this.isShowDelg = !_this.isShowDelg
                _this.crud.refresh()
              }).catch(err => {
                _this.$message.error(err)
              })
            }
          }).then(r2 => {
            console.log(r2)
          })
            .catch(function(err) {
              _this.$message.error(err)
            })

          break
        case 'edit':
          this.isShowDelg = !this.isShowDelg
          this.isEdit = false
          this.isAdd = true
          this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
          for (var key in this.scopeData) {
            this.scopeData[key] = null
          }
          break
      }
    },
    closeTip() {
      this.isEdit = false
      this.isAdd = true
      this.isFlag = true
      this.isShowDelg = !this.isShowDelg
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    beforClose() {
      this.isEdit = false
      this.isAdd = true
      this.isFlag = true
      this.isShowDelg = !this.isShowDelg
      this.scopeData = JSON.parse(JSON.stringify(this.scopeData))
      for (var key in this.scopeData) {
        this.scopeData[key] = null
      }
    },
    handlePreview() {}
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
