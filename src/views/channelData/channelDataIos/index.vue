<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
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
        v-model="query.gameCode"
        clearable
        placeholder="gameCode"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="crud.toQuery"
      />

      <el-input
        v-model="query.accountNum"
        clearable
        placeholder="开发者账号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="crud.toQuery"
      />
      <rrOperation :crud="crud" />
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="上传时间，格式yyyy-MM" prop="uploadTime">
            <el-input v-model="form.uploadTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据状态 0 有效 1 无效 默认有效，当存在重复数据时旧数据都无效">
            <el-select v-model="form.dataStatus" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.data_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Provider">
            <el-input v-model="form.provider" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Provider Country">
            <el-input v-model="form.proCountry" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="SKU">
            <el-input v-model="form.sku" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Developer">
            <el-input v-model="form.developer" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Version">
            <el-input v-model="form.version" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Product Type Identifier">
            <el-input v-model="form.proTypeIdent" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Units">
            <el-input v-model="form.units" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Developer Proceeds">
            <el-input v-model="form.devProceeds" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Begin Date">
            <el-input v-model="form.beginDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="End Date">
            <el-input v-model="form.endDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Customer Currency">
            <el-input v-model="form.cusCur" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Country Code">
            <el-input v-model="form.countryCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Currency of Proceeds">
            <el-input v-model="form.curOfPro" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Apple Identifier">
            <el-input v-model="form.appleIdent" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Customer Price">
            <el-input v-model="form.cusPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Promo Code">
            <el-input v-model="form.promoCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Parent Identifier">
            <el-input v-model="form.parentIdent" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Subscription">
            <el-input v-model="form.subscription" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Period">
            <el-input v-model="form.period" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Category">
            <el-input v-model="form.category" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="CMB">
            <el-input v-model="form.cmb" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Device">
            <el-input v-model="form.device" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Supported Platforms">
            <el-input v-model="form.supPlat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Proceeds Reason">
            <el-input v-model="form.proceReason" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Preserved Pricing">
            <el-input v-model="form.presPric" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Client">
            <el-input v-model="form.client" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Order Type">
            <el-input v-model="form.orderType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="游戏唯一标识">
            <el-input v-model="form.gameCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开发者账号">
            <el-input v-model="form.accountNum" style="width: 370px;" />
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
      <el-table ref="table" v-loading="crud.loading" border :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="gameCode" :sortable="'custom'" label="游戏唯一标识" />
        <el-table-column align="center" prop="accountNum" :sortable="'custom'" label="开发者账号" />
        <el-table-column align="center" prop="lpoint" :sortable="'custom'" label="商品项lp点数" />
        <el-table-column align="center" prop="moneyUsd" :sortable="'custom'" label="商品项美金" />
        <el-table-column align="center" prop="uploadTime" label="渠道月份" />
        <el-table-column align="center" prop="dataStatus" label="数据状态">
          <template slot-scope="scope">
            {{ dict.label.data_status[scope.row.dataStatus] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="provider" label="Provider" />
        <el-table-column align="center" prop="proCountry" label="Provider Country" />
        <el-table-column align="center" prop="sku" label="SKU" />
        <el-table-column align="center" prop="developer" label="Developer" />
        <el-table-column align="center" prop="title" label="Title" />
        <el-table-column align="center" prop="version" label="Version" />
        <el-table-column align="center" prop="proTypeIdent" label="Product Type Identifier" />
        <el-table-column align="center" prop="units" label="Units" />
        <el-table-column align="center" prop="devProceeds" label="Developer Proceeds" />
        <el-table-column align="center" prop="beginDate" label="Begin Date" />
        <el-table-column align="center" prop="endDate" label="End Date" />
        <el-table-column align="center" prop="cusCur" label="Customer Currency" />
        <el-table-column align="center" prop="countryCode" label="Country Code" />
        <el-table-column align="center" prop="curOfPro" label="Currency of Proceeds" />
        <el-table-column align="center" prop="appleIdent" label="Apple Identifier" />
        <el-table-column align="center" prop="cusPrice" label="Customer Price" />
        <el-table-column align="center" prop="promoCode" label="Promo Code" />
        <el-table-column align="center" prop="parentIdent" label="Parent Identifier" />
        <el-table-column align="center" prop="subscription" label="Subscription" />
        <el-table-column align="center" prop="period" label="Period" />
        <el-table-column align="center" prop="category" label="Category" />
        <el-table-column align="center" prop="cmb" label="CMB" />
        <el-table-column align="center" prop="device" label="Device" />
        <el-table-column align="center" prop="supPlat" label="Supported Platforms" />
        <el-table-column align="center" prop="proceReason" label="Proceeds Reason" />
        <el-table-column align="center" prop="presPric" label="Preserved Pricing" />
        <el-table-column align="center" prop="client" label="Client" />
        <el-table-column align="center" prop="orderType" label="Order Type" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudChannelDataIos from '@/api/channelData/channelDataIos'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, uploadId: null, uploadTime: null, dataStatus: null, provider: null, proCountry: null, sku: null, developer: null, title: null, version: null, proTypeIdent: null, units: null, devProceeds: null, beginDate: null, endDate: null, cusCur: null, countryCode: null, curOfPro: null, appleIdent: null, cusPrice: null, promoCode: null, parentIdent: null, subscription: null, period: null, category: null, cmb: null, device: null, supPlat: null, proceReason: null, presPric: null, client: null, orderType: null, gameCode: null, accountNum: null, lpoint: null, moneyUsd: null }
export default {
  name: 'ChannelDataIos',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['data_status'],
  cruds() {
    return CRUD({ title: 'IOS渠道数据', url: 'api/channelDataIos', idField: 'id', sort: 'id,desc', crudMethod: { ...crudChannelDataIos }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'channelDataIos:add'],
        edit: ['admin', 'channelDataIos:edit'],
        del: ['admin', 'channelDataIos:del']
      },
      rules: {
        uploadId: [
          { required: true, message: '上传表ID不能为空', trigger: 'blur' }
        ],
        uploadTime: [
          { required: true, message: '上传时间，格式yyyy-MM不能为空', trigger: 'blur' }
        ]
      },
      statusArr: null
    }
  },
  created() {
    this.statusArr = this.dict.data_status
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
      crudChannelDataIos.sortData(query).then(res => {
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
