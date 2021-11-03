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
          placeholder="渠道月份"
        />
        <el-select
          v-model="query.dataStatus"
          clearable
          size="small"
          placeholder="数据状态"
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
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="渠道月份" prop="uploadTime">
            <el-input v-model="form.uploadTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据状态">
            <el-input v-model="form.dataStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Date">
            <el-input v-model="form.infoDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Ref ID">
            <el-input v-model="form.refId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Method">
            <el-input v-model="form.paymentMethod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Transaction Type">
            <el-input v-model="form.transType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="End-user payment, KRW">
            <el-input v-model="form.userPaymentKrw" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="End-user payment, $">
            <el-input v-model="form.userPaymentUsd" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Rolling Reserve, $">
            <el-input v-model="form.rollingReserveUsd" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Commission, $">
            <el-input v-model="form.commissionUsd" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Revenue, $">
            <el-input v-model="form.revenueUsd" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="FX loss/gain adjustment">
            <el-input v-model="form.gainAdjustment" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Paid Amount, $">
            <el-input v-model="form.paidAmountUsd" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @sort-change="sortData" @selection-change="crud.selectionChangeHandler">
        <el-table-column prop="uploadTime" label="渠道月份" />
        <el-table-column prop="dataStatus" label="数据状态">
          <template slot-scope="scope">
            {{ dict.label.data_status[scope.row.dataStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="passport" :sortable="'custom'" label="用户唯一标识" />
        <el-table-column prop="gameCode" :sortable="'custom'" label="游戏唯一标识" />
        <el-table-column prop="lpOrderId" :sortable="'custom'" label="lunplay交易订单号" />
        <el-table-column prop="lpoint" :sortable="'custom'" label="商品项lp点数" />
        <el-table-column prop="moneyUsd" :sortable="'custom'" label="商品项美金" />
        <el-table-column prop="infoDate" label="Date" />
        <el-table-column prop="refId" label="Ref ID" />
        <el-table-column prop="paymentMethod" label="Payment Method" />
        <el-table-column prop="transType" label="Transaction Type" />
        <el-table-column prop="userPaymentKrw" label="End-user payment, KRW" />
        <el-table-column prop="userPaymentUsd" label="End-user payment, $" />
        <el-table-column prop="rollingReserveUsd" label="Rolling Reserve, $" />
        <el-table-column prop="commissionUsd" label="Commission, $" />
        <el-table-column prop="revenueUsd" label="Revenue, $" />
        <el-table-column prop="gainAdjustment" label="FX loss/gain adjustment" />
        <el-table-column prop="paidAmountUsd" label="Paid Amount, $" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataPaymentwall from '@/api/channelData/channelDataPaymentwall'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, infoDate: null, refId: null, paymentMethod: null, transType: null, userPaymentKrw: null, userPaymentUsd: null, rollingReserveUsd: null, commissionUsd: null, revenueUsd: null, gainAdjustment: null, paidAmountUsd: null }
export default {
  name: 'ChannelDataPaymentwall',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'paymentwall渠道数据', url: 'api/channelDataPaymentwall', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataPaymentwall }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataPaymentwall:add'],
        edit: ['admin', 'channelDataPaymentwall:edit'],
        del: ['admin', 'channelDataPaymentwall:del']
      },
      rules: {
        uploadId: [
          { required: true, message: '上传表ID不能为空', trigger: 'blur' }
        ],
        uploadTime: [
          { required: true, message: '渠道月份不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'uploadTime', display_name: '渠道月份' },
        { key: 'dataStatus', display_name: '数据状态' }
      ],
      statusArr: [
        { label: '有效', value: 0 },
        { label: '无效', value: 1 }
      ],
      sortProp: null,
      type: {
        ascending: 'asc',
        descending: 'desc'
      },
      sortType: null
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    sortData(data) {
      if (data.order === null) {
        data.order = 'descending'
      }
      this.crud.loading = true
      this.sortProp = data.prop
      this.sortType = this.type[data.order]
      const query = this.crud.getQueryParams()
      query.sort = `${this.sortProp},${this.sortType}`
      crudChannelDataPaymentwall.sortData(query).then(res => {
        this.crud.loading = false
        this.crud.data = res.content
      })
    }
  }
}
</script>

<style scoped>
::v-deep .crud-opts-left {
  display: none;
}
</style>
