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
          <el-form-item label="No">
            <el-input v-model="form.serNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Order No">
            <el-input v-model="form.orderNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Merchant Request No">
            <el-input v-model="form.merchantNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Ordered (Base on UTC+8)">
            <el-input v-model="form.ordered" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Time (Base on UTC+8)">
            <el-input v-model="form.paymentTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Duration">
            <el-input v-model="form.duration" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Merchant Name">
            <el-input v-model="form.merchantName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Application ID">
            <el-input v-model="form.applicationId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Product SKU">
            <el-input v-model="form.productSku" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Application Name">
            <el-input v-model="form.applicationName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Product Name">
            <el-input v-model="form.productName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Amount">
            <el-input v-model="form.paymentAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Coupon Amount">
            <el-input v-model="form.couponAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Member Point Consumption">
            <el-input v-model="form.pointConsumption" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Member Point Refund">
            <el-input v-model="form.pointRefund" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Currency">
            <el-input v-model="form.currency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Method">
            <el-input v-model="form.paymentMethod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="SDK Channel">
            <el-input v-model="form.sdkChannel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payment Status">
            <el-input v-model="form.paymentStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Callback CP Result">
            <el-input v-model="form.callbackResult" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Type">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Origin Order No">
            <el-input v-model="form.originOrderNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refunded">
            <el-input v-model="form.refunded" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Amount">
            <el-input v-model="form.refundAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Country/Region">
            <el-input v-model="form.countryRegion" style="width: 370px;" />
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
        <el-table-column prop="serNo" label="No" />
        <el-table-column prop="orderNo" label="Order No" />
        <el-table-column prop="merchantNo" label="Merchant Request No" />
        <el-table-column prop="ordered" label="Ordered (Base on UTC+8)" />
        <el-table-column prop="paymentTime" label="Payment Time (Base on UTC+8)" />
        <el-table-column prop="duration" label="Duration" />
        <el-table-column prop="merchantName" label="Merchant Name" />
        <el-table-column prop="applicationId" label="Application ID" />
        <el-table-column prop="productSku" label="Product SKU" />
        <el-table-column prop="applicationName" label="Application Name" />
        <el-table-column prop="productName" label="Product Name" />
        <el-table-column prop="paymentAmount" label="Payment Amount" />
        <el-table-column prop="couponAmount" label="Coupon Amount" />
        <el-table-column prop="pointConsumption" label="Member Point Consumption" />
        <el-table-column prop="pointRefund" label="Member Point Refund" />
        <el-table-column prop="currency" label="Currency" />
        <el-table-column prop="paymentMethod" label="Payment Method" />
        <el-table-column prop="sdkChannel" label="SDK Channel" />
        <el-table-column prop="paymentStatus" label="Payment Status" />
        <el-table-column prop="callbackResult" label="Callback CP Result" />
        <el-table-column prop="type" label="Type" />
        <el-table-column prop="originOrderNo" label="Origin Order No" />
        <el-table-column prop="refunded" label="Refunded" />
        <el-table-column prop="refundAmount" label="Refund Amount" />
        <el-table-column prop="countryRegion" label="Country/Region" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataHuawei from '@/api/channelData/channelDataHuawei'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, serNo: null, orderNo: null, merchantNo: null, ordered: null, paymentTime: null, duration: null, merchantName: null, applicationId: null, productSku: null, applicationName: null, productName: null, paymentAmount: null, couponAmount: null, pointConsumption: null, pointRefund: null, currency: null, paymentMethod: null, sdkChannel: null, paymentStatus: null, callbackResult: null, type: null, originOrderNo: null, refunded: null, refundAmount: null, countryRegion: null }
export default {
  name: 'ChannelDataHuawei',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'huawei渠道数据', url: 'api/channelDataHuawei', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataHuawei }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataHuawei:add'],
        edit: ['admin', 'channelDataHuawei:edit'],
        del: ['admin', 'channelDataHuawei:del']
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
      crudChannelDataHuawei.sortData(query).then(res => {
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
