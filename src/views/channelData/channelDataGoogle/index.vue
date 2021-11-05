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
          <el-form-item label="上传表ID" prop="uploadId">
            <el-input v-model="form.uploadId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="渠道月份" prop="uploadTime">
            <el-input v-model="form.uploadTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据状态">
            <el-input v-model="form.dataStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Transaction Date">
            <el-input v-model="form.transDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Transaction Time">
            <el-input v-model="form.transTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Tax Type">
            <el-input v-model="form.taxType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Transaction Type">
            <el-input v-model="form.transType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Refund Type">
            <el-input v-model="form.refundType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Product Title">
            <el-input v-model="form.productTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Product id">
            <el-input v-model="form.productId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Product Type">
            <el-input v-model="form.productType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Sku Id">
            <el-input v-model="form.skuId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Hardware">
            <el-input v-model="form.hardware" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Buyer Country">
            <el-input v-model="form.buyerCountry" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Buyer State">
            <el-input v-model="form.buyerState" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Buyer Postal Code">
            <el-input v-model="form.buyerPosc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Buyer Currency">
            <el-input v-model="form.buyerCurrency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Amount (Buyer Currency)">
            <el-input v-model="form.bcAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Currency Conversion Rate">
            <el-input v-model="form.currConveRate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Merchant Currency">
            <el-input v-model="form.merCurrency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Amount (Merchant Currency)">
            <el-input v-model="form.merAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Base Plan ID">
            <el-input v-model="form.basePlanId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Offer ID">
            <el-input v-model="form.offerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户唯一标识">
            <el-input v-model="form.passport" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="游戏唯一标识">
            <el-input v-model="form.gameCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="lunplay交易订单号">
            <el-input v-model="form.lpOrderId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品项lp点数">
            <el-input v-model="form.lpoint" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品项美金">
            <el-input v-model="form.moneyUsd" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @sort-change="sortData" @selection-change="crud.selectionChangeHandler">
        <el-table-column prop="passport" :sortable="'custom'" label="用户唯一标识" />
        <el-table-column prop="gameCode" :sortable="'custom'" label="游戏唯一标识" />
        <el-table-column prop="lpOrderId" :sortable="'custom'" label="lunplay交易订单号" />
        <el-table-column prop="lpoint" :sortable="'custom'" label="商品项lp点数" />
        <el-table-column prop="moneyUsd" :sortable="'custom'" label="商品项美金" />
        <el-table-column prop="uploadTime" label="渠道月份" />
        <el-table-column prop="dataStatus" label="数据状态">
          <template slot-scope="scope">
            {{ dict.label.data_status[scope.row.dataStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="transDate" label="Transaction Date" />
        <el-table-column prop="transTime" label="Transaction Time" />
        <el-table-column prop="taxType" label="Tax Type" />
        <el-table-column prop="transType" label="Transaction Type" />
        <el-table-column prop="refundType" label="Refund Type" />
        <el-table-column prop="productTitle" label="Product Title" />
        <el-table-column prop="productId" label="Product id" />
        <el-table-column prop="productType" label="Product Type" />
        <el-table-column prop="skuId" label="Sku Id" />
        <el-table-column prop="hardware" label="Hardware" />
        <el-table-column prop="buyerCountry" label="Buyer Country" />
        <el-table-column prop="buyerState" label="Buyer State" />
        <el-table-column prop="buyerPosc" label="Buyer Postal Code" />
        <el-table-column prop="buyerCurrency" label="Buyer Currency" />
        <el-table-column prop="bcAmount" label="Amount (Buyer Currency)" />
        <el-table-column prop="currConveRate" label="Currency Conversion Rate" />
        <el-table-column prop="merCurrency" label="Merchant Currency" />
        <el-table-column prop="merAmount" label="Amount (Merchant Currency)" />
        <el-table-column prop="basePlanId" label="Base Plan ID" />
        <el-table-column prop="offerId" label="Offer ID" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataGoogle from '@/api/channelData/channelDataGoogle'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, description: null, transDate: null, transTime: null, taxType: null, transType: null, refundType: null, productTitle: null, productId: null, productType: null, skuId: null, hardware: null, buyerCountry: null, buyerState: null, buyerPosc: null, buyerCurrency: null, bcAmount: null, currConveRate: null, merCurrency: null, merAmount: null, basePlanId: null, offerId: null, passport: null, gameCode: null, lpOrderId: null, lpoint: null, moneyUsd: null }
export default {
  name: 'ChannelDataGoogle',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'Google渠道数据', url: 'api/channelDataGoogle', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataGoogle }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataGoogle:add'],
        edit: ['admin', 'channelDataGoogle:edit'],
        del: ['admin', 'channelDataGoogle:del']
      },
      rules: {
        uploadId: [
          { required: true, message: '上传表ID不能为空', trigger: 'blur' }
        ],
        uploadTime: [
          { required: true, message: '渠道月份不能为空', trigger: 'blur' }
        ]
      },
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
      crudChannelDataGoogle.sortData(query).then(res => {
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
