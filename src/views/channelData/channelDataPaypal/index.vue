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
          <el-form-item label="上传表ID" prop="uploadId">
            <el-input v-model="form.uploadId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="渠道月份" prop="uploadTime">
            <el-input v-model="form.uploadTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="form.infoData" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="form.infoTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="时区">
            <el-input v-model="form.timeZone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="币种">
            <el-input v-model="form.currency" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="总额">
            <el-input v-model="form.grossAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="费用">
            <el-input v-model="form.cost" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="净额">
            <el-input v-model="form.netAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="发件人邮箱地址">
            <el-input v-model="form.addEmail" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收件人邮箱地址">
            <el-input v-model="form.recEmail" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="交易号">
            <el-input v-model="form.tranNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="form.shipAddr" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址状态">
            <el-input v-model="form.addrStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品名称">
            <el-input v-model="form.itemName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品号">
            <el-input v-model="form.itemNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运费和手续费金额">
            <el-input v-model="form.comAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="保险金额">
            <el-input v-model="form.insuredAmount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="营业税">
            <el-input v-model="form.businessTax" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="选项 1 名称">
            <el-input v-model="form.opt1Name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="选项 1 值">
            <el-input v-model="form.opt1Value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="选项 2 名称">
            <el-input v-model="form.opt2Name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="选项 2 值">
            <el-input v-model="form.opt2Value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="竞拍网站">
            <el-input v-model="form.auctionSite" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="买家号">
            <el-input v-model="form.buyerNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="物品URL">
            <el-input v-model="form.itemUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="成交日期">
            <el-input v-model="form.fixtureDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参考交易号">
            <el-input v-model="form.reftranNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单号">
            <el-input v-model="form.billNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="自定义号码">
            <el-input v-model="form.customNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.quantity" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="收据号">
            <el-input v-model="form.receiptNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="余额">
            <el-input v-model="form.balance" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址第1行">
            <el-input v-model="form.addressOne" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址第2行/区/临近地区">
            <el-input v-model="form.addressTwo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="城镇/城市">
            <el-input v-model="form.city" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省/市/自治区/直辖市/特别行政区">
            <el-input v-model="form.province" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮政编码">
            <el-input v-model="form.postalCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国家/地区">
            <el-input v-model="form.state" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系电话号码">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="主题">
            <el-input v-model="form.theme" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="优惠券">
            <el-input v-model="form.discountCoupon" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="特别优惠">
            <el-input v-model="form.specilOffer" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="积分卡号">
            <el-input v-model="form.rewardNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="授权审核状态">
            <el-input v-model="form.authStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="保障资格">
            <el-input v-model="form.cuarantee" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="国家/地区代码">
            <el-input v-model="form.stateCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="引起余额变动">
            <el-input v-model="form.balanceChange" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="注释1">
            <el-input v-model="form.note1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="注释2">
            <el-input v-model="form.note2" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单号">
            <el-input v-model="form.accountNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="form.orderNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="客户参考号">
            <el-input v-model="form.custrefNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Payflow交易号（PNREF）">
            <el-input v-model="form.payflowTranNum" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @sort-change="sortData" @selection-change="crud.selectionChangeHandler">
        <el-table-column prop="uploadId" label="上传表ID" />
        <el-table-column prop="uploadTime" label="渠道月份" />
        <el-table-column prop="passport" :sortable="'custom'" label="用户唯一标识" />
        <el-table-column prop="gameCode" :sortable="'custom'" label="游戏唯一标识" />
        <el-table-column prop="lpOrderId" :sortable="'custom'" label="lunplay交易订单号" />
        <el-table-column prop="lpoint" :sortable="'custom'" label="商品项lp点数" />
        <el-table-column prop="moneyUsd" :sortable="'custom'" label="商品项美金" />
        <el-table-column prop="infoData" label="日期" />
        <el-table-column prop="infoTime" label="时间" />
        <el-table-column prop="timeZone" label="时区" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="currency" label="币种" />
        <el-table-column prop="grossAmount" label="总额" />
        <el-table-column prop="cost" label="费用" />
        <el-table-column prop="netAmount" label="净额" />
        <el-table-column prop="addEmail" label="发件人邮箱地址" />
        <el-table-column prop="recEmail" label="收件人邮箱地址" />
        <el-table-column prop="tranNum" label="交易号" />
        <el-table-column prop="shipAddr" label="收货地址" />
        <el-table-column prop="addrStatus" label="地址状态" />
        <el-table-column prop="itemName" label="物品名称" />
        <el-table-column prop="itemNum" label="物品号" />
        <el-table-column prop="comAmount" label="运费和手续费金额" />
        <el-table-column prop="insuredAmount" label="保险金额" />
        <el-table-column prop="businessTax" label="营业税" />
        <el-table-column prop="opt1Name" label="选项 1 名称" />
        <el-table-column prop="opt1Value" label="选项 1 值" />
        <el-table-column prop="opt2Name" label="选项 2 名称" />
        <el-table-column prop="opt2Value" label="选项 2 值" />
        <el-table-column prop="auctionSite" label="竞拍网站" />
        <el-table-column prop="buyerNo" label="买家号" />
        <el-table-column prop="itemUrl" label="物品URL" />
        <el-table-column prop="fixtureDate" label="成交日期" />
        <el-table-column prop="reftranNum" label="参考交易号" />
        <el-table-column prop="billNum" label="账单号" />
        <el-table-column prop="customNum" label="自定义号码" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="receiptNum" label="收据号" />
        <el-table-column prop="balance" label="余额" />
        <el-table-column prop="addressOne" label="地址第1行" />
        <el-table-column prop="addressTwo" label="地址第2行/区/临近地区" />
        <el-table-column prop="city" label="城镇/城市" />
        <el-table-column prop="province" label="省/市/自治区/直辖市/特别行政区" />
        <el-table-column prop="postalCode" label="邮政编码" />
        <el-table-column prop="state" label="国家/地区" />
        <el-table-column prop="phone" label="联系电话号码" />
        <el-table-column prop="theme" label="主题" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="discountCoupon" label="优惠券" />
        <el-table-column prop="specilOffer" label="特别优惠" />
        <el-table-column prop="rewardNum" label="积分卡号" />
        <el-table-column prop="authStatus" label="授权审核状态" />
        <el-table-column prop="cuarantee" label="保障资格" />
        <el-table-column prop="stateCode" label="国家/地区代码" />
        <el-table-column prop="balanceChange" label="引起余额变动" />
        <el-table-column prop="note1" label="注释1" />
        <el-table-column prop="note2" label="注释2" />
        <el-table-column prop="accountNum" label="账单号" />
        <el-table-column prop="orderNum" label="订单号" />
        <el-table-column prop="custrefNum" label="客户参考号" />
        <el-table-column prop="payflowTranNum" label="Payflow交易号（PNREF）" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataPaypal from '@/api/channelData/channelDataPaypal'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, infoData: null, infoTime: null, timeZone: null, name: null, type: null, status: null, currency: null, grossAmount: null, cost: null, netAmount: null, addEmail: null, recEmail: null, tranNum: null, shipAddr: null, addrStatus: null, itemName: null, itemNum: null, comAmount: null, insuredAmount: null, businessTax: null, opt1Name: null, opt1Value: null, opt2Name: null, opt2Value: null, auctionSite: null, buyerNo: null, itemUrl: null, fixtureDate: null, reftranNum: null, billNum: null, customNum: null, quantity: null, receiptNum: null, balance: null, addressOne: null, addressTwo: null, city: null, province: null, postalCode: null, state: null, phone: null, theme: null, remark: null, discountCoupon: null, specilOffer: null, rewardNum: null, authStatus: null, cuarantee: null, stateCode: null, balanceChange: null, note1: null, note2: null, accountNum: null, orderNum: null, custrefNum: null, payflowTranNum: null }
export default {
  name: 'ChannelDataPaypal',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'paypal渠道数据', url: 'api/channelDataPaypal', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataPaypal }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataPaypal:add'],
        edit: ['admin', 'channelDataPaypal:edit'],
        del: ['admin', 'channelDataPaypal:del']
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
      crudChannelDataPaypal.sortData(query).then(res => {
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
