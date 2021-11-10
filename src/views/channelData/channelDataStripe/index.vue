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
        <el-input
          v-model="query.passport"
          clearable
          placeholder="passport"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.lpOrderId"
          clearable
          placeholder="lp订单号"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.gameCode"
          clearable
          placeholder="gameCode"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
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
          <el-form-item label="id">
            <el-input v-model="form.stripeId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="description">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="seller_message">
            <el-input v-model="form.sellerMessage" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="created">
            <el-input v-model="form.created" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="amount">
            <el-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="amount_refunded">
            <el-input v-model="form.amountRefunded" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="currency">
            <el-input v-model="form.currency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="converted_amount">
            <el-input v-model="form.convertedAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="converted_amount_refunded">
            <el-input v-model="form.convertedAmountRefunded" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="fee">
            <el-input v-model="form.fee" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="tax">
            <el-input v-model="form.tax" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="converted_currency">
            <el-input v-model="form.convertedCurrency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="mode">
            <el-input v-model="form.mode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="status">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="statement_descriptor">
            <el-input v-model="form.statementDescriptor" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="customer_id">
            <el-input v-model="form.customerId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="customer_description">
            <el-input v-model="form.customerDescription" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="customer_email">
            <el-input v-model="form.customerEmail" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="captured">
            <el-input v-model="form.captured" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_id">
            <el-input v-model="form.cardId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_last4">
            <el-input v-model="form.cardLast4" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_brand">
            <el-input v-model="form.cardBrand" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_funding">
            <el-input v-model="form.cardFunding" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_exp_month">
            <el-input v-model="form.cardExpMonth" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_exp_year">
            <el-input v-model="form.cardExpYear" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_name">
            <el-input v-model="form.cardName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_address_line1">
            <el-input v-model="form.cardAddressLine1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_address_line2">
            <el-input v-model="form.cardAddressLine2" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_address_city">
            <el-input v-model="form.cardAddressCity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_address_state">
            <el-input v-model="form.cardAddressState" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_address_country">
            <el-input v-model="form.cardAddressCountry" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_address_zip">
            <el-input v-model="form.cardAddressZip" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_issue_country">
            <el-input v-model="form.cardIssueCountry" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_fingerprint">
            <el-input v-model="form.cardFingerprint" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_cvc_status">
            <el-input v-model="form.cardCvcStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_avs_zip_status">
            <el-input v-model="form.cardAvsZipStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_avs_line1_status">
            <el-input v-model="form.cardAvsLine1Status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="card_tokenization_method">
            <el-input v-model="form.cardTokenizationMethod" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="shipping_address_line1">
            <el-input v-model="form.shippingAddressLine1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="shipping_address_line2">
            <el-input v-model="form.shippingAddressLine2" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="shipping_address_city">
            <el-input v-model="form.shippingAddressCity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="shipping_address_state">
            <el-input v-model="form.shippingAddressState" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="shipping_address_country">
            <el-input v-model="form.shippingAddressCountry" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="shipping_address_postal_code">
            <el-input v-model="form.shippingAddressPostalCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="disputed_amount">
            <el-input v-model="form.disputedAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="dispute_status">
            <el-input v-model="form.disputeStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="dispute_reason">
            <el-input v-model="form.disputeReason" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="dispute_date">
            <el-input v-model="form.disputeDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="dispute_evidence_due">
            <el-input v-model="form.disputeEvidenceDue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="invoice_id">
            <el-input v-model="form.invoiceId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="invoice_number">
            <el-input v-model="form.invoiceNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="payment_source_type">
            <el-input v-model="form.paymentSourceType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="destination">
            <el-input v-model="form.destination" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="transfer">
            <el-input v-model="form.transfer" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="transfer_group">
            <el-input v-model="form.transferGroup" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="payment_intent_id">
            <el-input v-model="form.paymentIntentId" style="width: 370px;" />
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
        <el-table-column prop="stripeId" label="id" />
        <el-table-column prop="description" label="description" />
        <el-table-column prop="sellerMessage" label="seller_message" />
        <el-table-column prop="created" label="created" />
        <el-table-column prop="amount" label="amount" />
        <el-table-column prop="amountRefunded" label="amount_refunded" />
        <el-table-column prop="currency" label="currency" />
        <el-table-column prop="convertedAmount" label="converted_amount" />
        <el-table-column prop="convertedAmountRefunded" label="converted_amount_refunded" />
        <el-table-column prop="fee" label="fee" />
        <el-table-column prop="tax" label="tax" />
        <el-table-column prop="convertedCurrency" label="converted_currency" />
        <el-table-column prop="mode" label="mode" />
        <el-table-column prop="status" label="status" />
        <el-table-column prop="statementDescriptor" label="statement_descriptor" />
        <el-table-column prop="customerId" label="customer_id" />
        <el-table-column prop="customerDescription" label="customer_description" />
        <el-table-column prop="customerEmail" label="customer_email" />
        <el-table-column prop="captured" label="captured" />
        <el-table-column prop="cardId" label="card_id" />
        <el-table-column prop="cardLast4" label="card_last4" />
        <el-table-column prop="cardBrand" label="card_brand" />
        <el-table-column prop="cardFunding" label="card_funding" />
        <el-table-column prop="cardExpMonth" label="card_exp_month" />
        <el-table-column prop="cardExpYear" label="card_exp_year" />
        <el-table-column prop="cardName" label="card_name" />
        <el-table-column prop="cardAddressLine1" label="card_address_line1" />
        <el-table-column prop="cardAddressLine2" label="card_address_line2" />
        <el-table-column prop="cardAddressCity" label="card_address_city" />
        <el-table-column prop="cardAddressState" label="card_address_state" />
        <el-table-column prop="cardAddressCountry" label="card_address_country" />
        <el-table-column prop="cardAddressZip" label="card_address_zip" />
        <el-table-column prop="cardIssueCountry" label="card_issue_country" />
        <el-table-column prop="cardFingerprint" label="card_fingerprint" />
        <el-table-column prop="cardCvcStatus" label="card_cvc_status" />
        <el-table-column prop="cardAvsZipStatus" label="card_avs_zip_status" />
        <el-table-column prop="cardAvsLine1Status" label="card_avs_line1_status" />
        <el-table-column prop="cardTokenizationMethod" label="card_tokenization_method" />
        <el-table-column prop="shippingAddressLine1" label="shipping_address_line1" />
        <el-table-column prop="shippingAddressLine2" label="shipping_address_line2" />
        <el-table-column prop="shippingAddressCity" label="shipping_address_city" />
        <el-table-column prop="shippingAddressState" label="shipping_address_state" />
        <el-table-column prop="shippingAddressCountry" label="shipping_address_country" />
        <el-table-column prop="shippingAddressPostalCode" label="shipping_address_postal_code" />
        <el-table-column prop="disputedAmount" label="disputed_amount" />
        <el-table-column prop="disputeStatus" label="dispute_status" />
        <el-table-column prop="disputeReason" label="dispute_reason" />
        <el-table-column prop="disputeDate" label="dispute_date" />
        <el-table-column prop="disputeEvidenceDue" label="dispute_evidence_due" />
        <el-table-column prop="invoiceId" label="invoice_id" />
        <el-table-column prop="invoiceNumber" label="invoice_number" />
        <el-table-column prop="paymentSourceType" label="payment_source_type" />
        <el-table-column prop="destination" label="destination" />
        <el-table-column prop="transfer" label="transfer" />
        <el-table-column prop="transferGroup" label="transfer_group" />
        <el-table-column prop="paymentIntentId" label="payment_intent_id" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataStripe from '@/api/channelData/channelDataStripe'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, stripeId: null, description: null, sellerMessage: null, created: null, amount: null, amountRefunded: null, currency: null, convertedAmount: null, convertedAmountRefunded: null, fee: null, tax: null, convertedCurrency: null, mode: null, status: null, statementDescriptor: null, customerId: null, customerDescription: null, customerEmail: null, captured: null, cardId: null, cardLast4: null, cardBrand: null, cardFunding: null, cardExpMonth: null, cardExpYear: null, cardName: null, cardAddressLine1: null, cardAddressLine2: null, cardAddressCity: null, cardAddressState: null, cardAddressCountry: null, cardAddressZip: null, cardIssueCountry: null, cardFingerprint: null, cardCvcStatus: null, cardAvsZipStatus: null, cardAvsLine1Status: null, cardTokenizationMethod: null, shippingAddressLine1: null, shippingAddressLine2: null, shippingAddressCity: null, shippingAddressState: null, shippingAddressCountry: null, shippingAddressPostalCode: null, disputedAmount: null, disputeStatus: null, disputeReason: null, disputeDate: null, disputeEvidenceDue: null, invoiceId: null, invoiceNumber: null, paymentSourceType: null, destination: null, transfer: null, transferGroup: null, paymentIntentId: null }
export default {
  name: 'ChannelDataStripe',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'stripe渠道数据', url: 'api/channelDataStripe', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataStripe }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataStripe:add'],
        edit: ['admin', 'channelDataStripe:edit'],
        del: ['admin', 'channelDataStripe:del']
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
      crudChannelDataStripe.sortData(query).then(res => {
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
