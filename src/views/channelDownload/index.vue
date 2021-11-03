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
        <el-input v-model="query.gameCode" clearable placeholder="游戏代码" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.status" clearable placeholder="状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="模板类型,0-财务，1-研发" prop="tempType">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="渠道">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="游戏代码">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="下载时间">
            <el-date-picker v-model="form.uploadTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="tempType" label="模板类型" />
        <el-table-column prop="channelType" label="渠道" />
        <el-table-column prop="gameCode" label="游戏代码" />
        <el-table-column prop="uploadTime" label="下载时间" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.download_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column v-if="checkPer(['admin','channelDownloadRecord:edit','channelDownloadRecord:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
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
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, tempType: null, channelType: null, gameCode: null, uploadTime: null, filename: null, filepath: null, createBy: null, createTime: null, status: null, errMsg: null, updateTime: null, remark: null }
export default {
  name: 'ChannelDownloadRecord',
  components: { pagination, crudOperation, rrOperation, udOperation },
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
          { required: true, message: '模板类型,0-财务，1-研发不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'tempType', display_name: '模板类型,0-财务，1-研发' },
        { key: 'gameCode', display_name: '游戏代码' },
        { key: 'status', display_name: '状态' }
      ],
      moduleType: [
        { label: '财务', value: 0 },
        { label: '研发', value: 1 }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
