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
          <el-form-item label="Txn Create Time">
            <el-input v-model="form.txnCreateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Completed Time">
            <el-input v-model="form.completedTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Account Subject">
            <el-input v-model="form.accountSubject" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="User ID">
            <el-input v-model="form.userId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Trade Description">
            <el-input v-model="form.tradeDescription" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Merchant Txn ID">
            <el-input v-model="form.merchantTxnId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Trade Order ID">
            <el-input v-model="form.tradeOrderId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Channel ID">
            <el-input v-model="form.channelId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Txn Status">
            <el-input v-model="form.txnStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Country">
            <el-input v-model="form.country" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Order Amount">
            <el-input v-model="form.orderAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Order Currency">
            <el-input v-model="form.orderCurrency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Amount">
            <el-input v-model="form.paymentAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Currency">
            <el-input v-model="form.paymentCurrency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Reference">
            <el-input v-model="form.reference" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Method">
            <el-input v-model="form.paymentMethod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Sub Payment Method ">
            <el-input v-model="form.subPaymentMethod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Txn Commission">
            <el-input v-model="form.txnCommission" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Txn Tax">
            <el-input v-model="form.txnTax" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Commission & Tax Currency">
            <el-input v-model="form.comTaxCurrency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Failure Reason">
            <el-input v-model="form.failureReason" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Settlement Status">
            <el-input v-model="form.settlementStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund ID">
            <el-input v-model="form.refundId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Platform Refund ID">
            <el-input v-model="form.platformRefundId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Channel Refund ID">
            <el-input v-model="form.channelRefundId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Status">
            <el-input v-model="form.refStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Create Time">
            <el-input v-model="form.refCreateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Update Time">
            <el-input v-model="form.refUpdateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Failure Reason">
            <el-input v-model="form.refFailureReason" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Remark">
            <el-input v-model="form.refRemark" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
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
        <el-table-column prop="txnCreateTime" label="Txn Create Time" />
        <el-table-column prop="completedTime" label="Completed Time" />
        <el-table-column prop="accountSubject" label="Account Subject" />
        <el-table-column prop="userId" label="User ID" />
        <el-table-column prop="tradeDescription" label="Trade Description" />
        <el-table-column prop="merchantTxnId" label="Merchant Txn ID" />
        <el-table-column prop="tradeOrderId" label="Trade Order ID" />
        <el-table-column prop="channelId" label="Channel ID" />
        <el-table-column prop="txnStatus" label="Txn Status" />
        <el-table-column prop="country" label="Country" />
        <el-table-column prop="orderAmount" label="Order Amount" />
        <el-table-column prop="orderCurrency" label="Order Currency" />
        <el-table-column prop="paymentAmount" label="Payment Amount" />
        <el-table-column prop="paymentCurrency" label="Payment Currency" />
        <el-table-column prop="reference" label="Reference" />
        <el-table-column prop="paymentMethod" label="Payment Method" />
        <el-table-column prop="subPaymentMethod" label="Sub Payment Method " />
        <el-table-column prop="txnCommission" label="Txn Commission" />
        <el-table-column prop="txnTax" label="Txn Tax" />
        <el-table-column prop="comTaxCurrency" label="Commission & Tax Currency" />
        <el-table-column prop="failureReason" label="Failure Reason" />
        <el-table-column prop="settlementStatus" label="Settlement Status" />
        <el-table-column prop="refundId" label="Refund ID" />
        <el-table-column prop="platformRefundId" label="Platform Refund ID" />
        <el-table-column prop="channelRefundId" label="Channel Refund ID" />
        <el-table-column prop="refStatus" label="Refund Status" />
        <el-table-column prop="refCreateTime" label="Refund Create Time" />
        <el-table-column prop="refUpdateTime" label="Refund Update Time" />
        <el-table-column prop="refFailureReason" label="Refund Failure Reason" />
        <el-table-column prop="refRemark" label="Refund Remark" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataPayermax from '@/api/channelData/channelDataPayermax'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, txnCreateTime: null, completedTime: null, accountSubject: null, userId: null, tradeDescription: null, merchantTxnId: null, tradeOrderId: null, channelId: null, txnStatus: null, country: null, orderAmount: null, orderCurrency: null, paymentAmount: null, paymentCurrency: null, reference: null, paymentMethod: null, subPaymentMethod: null, txnCommission: null, txnTax: null, comTaxCurrency: null, failureReason: null, settlementStatus: null, refundId: null, platformRefundId: null, channelRefundId: null, refStatus: null, refCreateTime: null, refUpdateTime: null, refFailureReason: null, refRemark: null }
export default {
  name: 'ChannelDataPayermax',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'payermax渠道数据', url: 'api/channelDataPayermax', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataPayermax }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataPayermax:add'],
        edit: ['admin', 'channelDataPayermax:edit'],
        del: ['admin', 'channelDataPayermax:del']
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
      this.crud.loading = true
      this.sortProp = data.prop
      this.sortType = this.type[data.order]
      const query = this.crud.getQueryParams()
      query.sort = `${this.sortProp},${this.sortType}`
      crudChannelDataPayermax.sortData(query).then(res => {
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
