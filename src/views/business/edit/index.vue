<template>
	<div class="sys-menu-container">
		<!--  @wheel="handleMouseScroll" 使activeNames为2 收拢折叠面板 -->
		<el-card shadow="hover" :body-style="{ padding: '3px 0 0 3px' }" style="margin-bottom: 30px">
			<el-row v-if="id">
				<el-form-item>
					<el-button size="small" type="primary" icon="ele-Plus" :disabled="allCompiles"
						@click="OrderLockSwitch" style="margin-right: 20px"> {{ compile ? '退出编辑' : '编辑' }} </el-button>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" size="small" @click="exportBaoguan"> 导出报关件 </el-button>
						<el-button size="small" @click="exportYanhuo()"> 导出验货单 </el-button>
						<el-button type="primary" size="small" @click="exportBoxTag()"> 导出外箱标签 </el-button>
						<el-button type="primary" size="small" @click="exportPackingListNumber()"> 导出箱单号条形码 </el-button>
						<!--
<el-button type="primary" :loading="loading1" icon="ele-Plus" style="margin-left:20px;"> 导入补录信息
						</el-button>
						<el-link type="success"
							href="http://localhost:5005/upload/TableAddress/补录信息模板.xlsx">下载补录信息模板</el-link>
						-->
					</el-button-group>
				</el-form-item>
			</el-row>
			<el-row style="display: flex; justify-content: space-around">
				<el-form-item label="单据编号" required="true">
					<el-input :formatter="formatInput"
						:class="!collectionOrderInfo.documentNo && buttonmask ? 'avt' : ''"
						v-model="collectionOrderInfo.documentNo" clearable="" :disabled="!compile || true"
						placeholder="请输入单据编号" />
					<!-- <span v-if="!collectionOrderInfo.documentNo" class="error-message">单据编号不能为空！</span> -->
				</el-form-item>
				<el-form-item label="货代名称" required="true">
					<el-select @change="changefun" :formatter="formatInput"
						:class="!collectionOrderInfo.forwarderID && buttonmask ? 'avt' : ''"
						v-model="collectionOrderInfo.forwarderID" filterable clearable class="w100"
						:disabled="!compile">
						<el-option v-for="item in selectBox" :key="item.value" :label="item.label"
							:value="item.value" />
					</el-select>
					<!-- <span v-if="!collectionOrderInfo.forwarderID" class="error-message">贷代名称不能为空！</span> -->
				</el-form-item>
				<el-form-item label="目的地">
					<el-input v-model="collectionOrderInfo.destination" @input="showCurrency()" clearable=""
						:disabled="!compile" placeholder="请输入目的地" />
				</el-form-item>
				<el-form-item label="截仓日期">
					<el-date-picker v-model="collectionOrderInfo.cutOffDate" clearable="" type="date"
						:disabled="!compile" placeholder="请输入截仓日期" />
				</el-form-item>
			</el-row>
		</el-card>
		<el-collapse v-model="activeNames">
			<el-collapse-item name="1">
				<template #title>
					<div class="titleForm">展开</div>
				</template>
				<el-form :model="collectionOrderInfo" ref="queryForm" :inline="true" label-width="auto">
					<el-row>
						<el-col :span="8">
							<el-form-item label="收货人" prop="consigneeName" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.consigneeName" clearable=""
									placeholder="请输入收货人" />
							</el-form-item>
							<el-form-item label="美元汇率" style="width: 90%" required="true">
								<el-input :type="'number'" :formatter="formatInput"
									:class="!collectionOrderInfo.exchangeRateUSD && buttonmask ? 'avt' : ''"
									:disabled="!compile" v-model="collectionOrderInfo.exchangeRateUSD" clearable=""
									placeholder="请输入美元汇率" />
								<!-- <span v-if="!collectionOrderInfo.exchangeRateUSD" class="error-message">美元汇率不能为空！</span> -->
							</el-form-item>
							<el-form-item label="报关单号" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.customsDeclarationNo"
									clearable="" placeholder="请输入报关单号" />
							</el-form-item>
							<el-form-item label="状态" style="width: 90%">
								<el-select :disabled="!compile" v-model="collectionOrderInfo.state" filterable
									clearable>
									<el-option v-for="item in stateOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="交仓地址" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.deliveryAddress"
									clearable="" placeholder="请输入交仓地址" />
							</el-form-item>
							<el-form-item label="开船／起飞日期" style="width: 90%">
								<el-date-picker @change="actualArrivalDateChange" :disabled="!compile" v-model="collectionOrderInfo.actualArrivalDate"
									type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="国际物流支付方" style="width: 90%">
								<el-select :disabled="!compile"
									v-model="collectionOrderInfo.internationalLogisticsFeePayer" filterable clearable>
									<el-option v-for="item in payerOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="备注" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.notes" type="textarea"
									placeholder="请输入备注" />
							</el-form-item>
						</el-col>
						<el-col :span="8" style="">
							<el-form-item label="物流报价" style="width: 90%" required="true">
								<el-input :type="'number'" :formatter="formatInput"
									:class="!collectionOrderInfo.logisticsPrice && buttonmask ? 'avt' : ''"
									:disabled="!compile" v-model="collectionOrderInfo.logisticsPrice" clearable=""
									style="width: 23%" placeholder="请输入" />
								<el-select :formatter="formatInput"
									:class="!collectionOrderInfo.logisticsPriceCurrency && buttonmask ? 'avt' : ''"
									v-model="collectionOrderInfo.logisticsPriceCurrency" filterable clearable
									id="select" style="width: 36%" :disabled="!compile">
									<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label"
										:value="item.value" />
								</el-select>
								<!-- <div class="wuliu">
										<span v-if="!collectionOrderInfo.logisticsPrice || !collectionOrderInfo.logisticsPriceCurrency" class="error-message">物流报价不能为空！</span>
									</div> -->
							</el-form-item>
							<el-form-item label="是否报关"> <el-switch :disabled="!compile"
									v-model="collectionOrderInfo.neetCustoms" inline-prompt active-text="是"
									inactive-text="否" /><br /> </el-form-item>
							<br />
							<el-form-item label="运输方式" style="width: 90%" required="true">
								<el-select :class="!collectionOrderInfo.shippingMethod && buttonmask ? 'avt' : ''"
									v-model="collectionOrderInfo.shippingMethod" :disabled="!compile" filterable
									clearable>
									<el-option v-for="item in shippingMethodOptions" :key="item" :label="item"
										:value="item" />
								</el-select>
								<!-- <span v-if="!collectionOrderInfo.shippingMethod" class="error-message">运输方式不能为空！</span> -->
							</el-form-item>
							<el-form-item label="收件人" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.recipientName" clearable=""
									placeholder="请输入收件人" />
							</el-form-item>
							<el-form-item label="验货完成日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.departureDate"
									@change="departureDateChange" type="date" placeholder="请选择日期" />
							</el-form-item>
							<!-- <el-form-item label="送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.deliveryDate" type="date"
									placeholder="请选择日期" />
							</el-form-item> -->
							<el-form-item label="创建日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.orderCreatedDate"
									type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="附件" style="width: 90%">
								<el-upload v-model:file-list="fileList"
									action="http://192.168.1.81:5568/api/collectionOrderInfo/collectionUploadAttachment"
									:on-success="successfun" :on-error="errorfun" :multiple="true"
									:show-file-list="true" name="file" :before-remove="handleRemovefun"
									:disabled="!compile">
									<el-button :disabled="!compile" type="primary" :loading="loading1" icon="ele-Plus"
										style="margin-right: 20px"> 附件上传 </el-button>
								</el-upload>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="汇率" style="width: 90%" required="true">
								<el-input :type="'number'" :formatter="formatInput"
									:class="!collectionOrderInfo.exchangeRate && buttonmask ? 'avt' : ''"
									:disabled="!compile" v-model="collectionOrderInfo.exchangeRate" clearable=""
									placeholder="请输入" />
								<!-- <span v-if="!collectionOrderInfo.exchangeRate" class="error-message">汇率不能为空！</span> -->
							</el-form-item>
							<el-form-item label="报关费" style="width: 90%" required="true">
								<el-input :type="'number'" :formatter="formatInput"
									:class="!collectionOrderInfo.totalCustomsDeclarationFee && buttonmask ? 'avt' : ''"
									:disabled="!compile" v-model="collectionOrderInfo.totalCustomsDeclarationFee"
									clearable="" placeholder="请输入报关费" />
								<!-- <span v-if="!collectionOrderInfo.totalCustomsDeclarationFee" class="error-message">报关费不能为空！</span> -->
							</el-form-item>
							<el-form-item label="货代入仓号" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.inWareHouseNo" clearable=""
									placeholder="请输入货代入仓号" />
							</el-form-item>
							<el-form-item label="收件联系电话" style="width: 90%">
								<el-input :type="'number'" :disabled="!compile"
									v-model="collectionOrderInfo.recipientPhone" clearable="" placeholder="请输入收件联系电话" />
							</el-form-item>
							<el-form-item label="预计送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.estimatedArrivalDate"
									type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="实际送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.actualDeliveryDate"
									type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="物流预计到仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.estimatedDeliveryDate"
									type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="创建人" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.orderCreatedUser"
									clearable="" placeholder="请输入" />
							</el-form-item>
						</el-col>
						<div style="margin: 0 auto; position: relative">
							<el-button :disabled="!isCommit || !compile" type="primary" @click="commit()">提交</el-button>
							<el-button v-if="!isCommit" type="primary"
								style="positihandleselectchacon: absolute; left: -11px; background-color: rgba(0, 0, 0, 0); border: 0"
								@click="commitzz()">提交</el-button>
						</div>
					</el-row>
				</el-form>
			</el-collapse-item>
		</el-collapse>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px" v-show="id">
			<span>总箱数 : {{ sumResult.numberBoxes }} 总方数 : {{ sumResult.squareNumber }}(立方米) 报关产品 :
				{{ sumResult.customsClearanceProducts }}(个) 平均报关费 :
				{{ sumResult.averageCustomsBrokerageFee }}/个 总重量：{{ sumResult.totalGrossWeightKG}}KG</span>
			<el-table class="table-container" v-loading="state.loading" :data="collectionGoodsInfolist"
				:row-class-name="tableRowClassName" style="width: 100%; margin-top: 10px" ref="myTable"
				@selection-change="handleSelectionChange">
				<el-table-column fixed type="selection" width="20"></el-table-column>

				<el-table-column fixed label="操作" width="100" align="center">
					<template #default="scope">
						<el-button :disabled="!compile || allCompiles" size="small" text type="primary" ref="myButton"
							@click="disabledfun(scope)">{{ scope.row.rowCompile ? '保存' : '编辑' }}</el-button>
						<el-popover placement="top" width="200" :disabled="visible" trigger="click">
							<p>确定{{ scope.row.rowCompile ? '取消' : '删除' }}吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="
			visible = true;
		scope.row.rowCompile ? `${(scope.row.rowCompile = !scope.row.rowCompile)}` : '';
		">取消</el-button>
								<el-button type="primary" size="small" @click="examine(scope)">确定</el-button>
							</div>
							<template #reference>
								<el-button :disabled="!compile || allCompiles" size="small" text type="primary"
									@click="visible = false"> {{ scope.row.rowCompile ? '取消' : '删除' }} </el-button>
							</template>
						</el-popover>
					</template>
				</el-table-column>

				<el-table-column fixed prop="internalUniqueID" label="内部唯一识别码" :width="widths">
					<template #default="scope">
						<!-- <el-input v-if="allCompiles" v-model="scope.row.internalUniqueID" @focus="focuefuns(scope)" @blur="widths = 150"> </el-input> -->
						<el-autocomplete :formatter="formatInput" v-if="scope.row.rowCompile || allCompiles"
							v-model="scope.row.internalUniqueID" :fetch-suggestions="querySearchAsync"
							placeholder="请输入内容" @select="handleSelect(scope)" @focus="focuefun(scope)"
							@blur="blurfun(scope)">
							<template #default="{ item }">
								<template v-for="i in splitSearchTag[item.value]" v-show="i?.length > 0">
									<el-tag :color="i.color">
										<span style="color: #fff">{{ i.value }}</span>
									</el-tag>
								</template>
								{{ item.value }}
							</template>
						</el-autocomplete>
					</template>
				</el-table-column>
				<el-table-column fixed prop="warnTag" label="标签" width="120">
					<template #default="scope">
						<el-select multiple v-model="scope.row.warnTagList" class="m-2" placeholder="Select"
							v-if="scope.row.rowCompile || allCompiles" @change="WarnTagChange(scope.row, scope.$index)">
							<el-option v-for="item in warnTagList" :key="item.value" :label="item.label"
								:value="item.value">
								<div class="flex items-center">
									<el-tag :color="item.code" style="margin-right: 8px" size="small" />
									<span :style="{ color: item.code }">{{ item.value }}</span>
								</div>
							</el-option>
							<template #tag>
								<el-tag v-for="color in warnTagList" :key="color.value" :color="color.value" />
							</template>
						</el-select>
						<template v-else v-for="(item, key, index) in scope.row.warnTagList">
							<el-tag :color="IsTag(item)">
								<span style="color: #fff">{{ item }}</span>
							</el-tag>
						</template>
					</template>
				</el-table-column>
				<el-table-column fixed prop="internalProductName" label="内部品名" width="120">
					<template #default="scope">
						<!-- <span v-if="!(scope.row.rowCompile)">{{scope.row.internalProductName}}</span> -->
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.internalProductName"></el-input>
					</template>
				</el-table-column>
				<el-table-column fixed prop="boxNo" label="ECVV箱单号" width="120">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" placeholder="只能包含ECVV0123456789-相关内容"
							@input="inputBoxNo(scope.row)" @focus="focuefun(scope)"
							v-model="scope.row.boxNo"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="purchaser" label="采购员" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.purchaser"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="purchaseContractNo" label="采购合同号" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.purchaseContractNo"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="supplier" label="供应商" width="180">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @change="changeSupplier(scope.row)"
							@focus="focuefun(scope)" v-model="scope.row.supplier"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="brand" label="品牌" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.brand"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="productPic" label="产品图" width="60">
					<template #default="scope">
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.productPic"></el-input> -->
						<img :src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.internalUniqueID + '.jpg'"
							alt="" />
					</template>
				</el-table-column>
				<el-table-column prop="notes" label="备注" width="120" show-overflow-tooltip="">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.notes"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsName" label="报关品名" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.customsName"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsElements" label="报关要素" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.customsElements"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="enProductName" label="英文名称" width="120">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.enProductName"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="material" label="材质" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.material"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="use" label="用途" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.use"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsDeclarationModel" label="报关型号" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.customsDeclarationModel"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="color" label="颜色" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.color"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="specification" label="规格" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.specification"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="plannedShipmentQuantity" label="报关数量" width="70">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.plannedShipmentQuantity"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="cusUnit" label="报关单位" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.cusUnit"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="actualShipmentQuantity" label="集货数量" width="70">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.actualShipmentQuantity"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="dubaiWarehouseReceiptQuantity" label="迪拜仓库收货数量" width="120">
					<template #default="scope">
						<el-input :type="'number'" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.dubaiWarehouseReceiptQuantity"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="unit" label="集货单位" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.unit"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="unitInfo" label="补充说明" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.unitInfo"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="quantityInBoxes" label="装箱个数" width="70">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.quantityInBoxes"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="packBoxesQuantity" label="装箱数" width="60">
					<template #default="scope">
						<el-popover placement="top" width="200" v-if="scope.row.rowCompile || allCompiles"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" @input="weightKG(scope.row)"
									v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.packBoxesQuantity"
									@click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="weightKG(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.packBoxesQuantity" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="singleProductNetWeightKG" label="单个产品净重KG" width="110">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.singleProductNetWeightKG"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="singleProductLength" label="产品长(cm)" width="80">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.singleProductLength"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="singleProductWidth" label="产品宽(cm)" width="80">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.singleProductWidth"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="singleProductHeight" label="产品高(cm)" width="80">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.singleProductHeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="fclGrossWeightKG" label="整箱毛重KG" width="90">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.fclGrossWeightKG"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="boxLength" label="箱长(cm)" width="70">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.boxLength"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="boxWidth" label="箱宽(cm)" width="70">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.boxWidth"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="boxHeight" label="箱高(cm)" width="70">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.boxHeight"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="totalNetWeightKG" label="总净重KG" width="80">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile || allCompiles"
									v-model="scope.row.totalNetWeightKG" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="weightKG(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.totalNetWeightKG" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="totalGrossWeightKG" label="总毛重KG" width="80">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)" v-if="scope.row.rowCompile"
							v-model="scope.row.totalGrossWeightKG"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="totalSquaresM3" label="总方数m³" width="80">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile"
									v-model="scope.row.totalSquaresM3" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="weightKG(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.totalSquaresM3" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="volumeWeight" label="体积重" width="60">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" @input="weightKG(scope.row)" v-if="scope.row.rowCompile"
									v-model="scope.row.volumeWeight" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="weightKG(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.volumeWeight" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="shippingTime" label="入货代仓时间" width="130">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.shippingTime"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="includingTaxPurchasePrice" label="采购价含税(RMB)" width="120">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.includingTaxPurchasePrice"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="domesticLogisticsCost" label="国内物流费用(RMB/个)" width="140">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.domesticLogisticsCost"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="exportUnitPrice" label="出口单价(USD)" width="100">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile"
									v-model="scope.row.exportUnitPrice" @input="weightKG(scope.row)"
									@click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile" v-model="scope.row.exportUnitPrice" @input="weightKG(scope.row)" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="totalExportPrice" label="出口总价(USD)" width="100">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile || allCompiles"
									v-model="scope.row.totalExportPrice" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="weightKG(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.totalExportPrice" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="commodityInspectionFee" label="商检费(RMB)个" width="100">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)"
							v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)"
							v-model="scope.row.commodityInspectionFee"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsDeclarationFee" label="报关费个" width="80">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile || allCompiles"
									@focus="focuefun(scope)" v-model="scope.row.customsDeclarationFee"
									@click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.customsDeclarationFee" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="singleCusInternationalLogisticsFee" label="报关物流费用(RMB/个)" width="140">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile || allCompiles"
									v-model="scope.row.singleCusInternationalLogisticsFee"
									@click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.singleCusInternationalLogisticsFee" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="singleInternationalLogisticsFee"
					:label="'国际物流费用' + '(' + collectionLogisticsFee + '/个)'" width="140">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile || allCompiles"
									v-model="scope.row.singleInternationalLogisticsFee"
									@click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.singleInternationalLogisticsFee" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="totalInternationalLogisticsFee"
					:label="'国际物流费用总额' + '(' + collectionLogisticsFee + ')'" width="150">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200"
							:disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input :type="'number'" v-if="scope.row.rowCompile" @input="weightKG(scope.row)"
									v-model="scope.row.totalInternationalLogisticsFee"
									@click="visibleediit = false"></el-input>
							</template>
						</el-popover>

						<!-- <el-input v-if="scope.row.rowCompile" @input="weightKG(scope.row)" v-model="scope.row.totalInternationalLogisticsFee"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="incidentalPrice" label="杂费" width="60">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)" v-if="scope.row.rowCompile"
							@focus="focuefun(scope)" v-model="scope.row.incidentalPrice"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="fobSupplyPrice" :label="'FOB供货价' + '(' + fobCurrency + ')'" width="110">
					<template #default="scope">
						<el-input :type="'number'" @input="weightKG(scope.row)" v-if="scope.row.rowCompile"
							v-model="scope.row.fobSupplyPrice" @click="visibleediit = false"></el-input>
					</template>
				</el-table-column>

			</el-table>

			<el-row>
				<el-form-item>
					<el-button type="primary" size="small" icon="ele-Plus" @click="copy()" style="margin-right: 20px">
						复制
					</el-button>
				</el-form-item>
				<el-form-item v-show="compile">
					<el-button-group>
						<el-button type="primary" size="small" @click="bulkEditing()" :disabled="batch">
							{{ allCompiles ? '保存' : '批量编辑' }} </el-button>
						<el-button size="small" @click="newrow()"> 新增一行 </el-button>
						<el-button type="primary" size="small" @click="cut()"> 剪切 </el-button>
						<el-button size="small" @click="affix()"> 粘贴 </el-button>
						<el-button type="primary" size="small" @click="repricefun()"> 重新计价 </el-button>
						<el-button size="small" @click="deletion()"> 批量删除 </el-button>
					</el-button-group>
				</el-form-item>
			</el-row>
			<el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
				:total="tableParams.total" :page-sizes="[10, 20, 50, 100, 500, 1000]" small="" background=""
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</el-card>

		<!-- <EditMenu ref="editMenuRef" :title="state.editMenuTitle" :menuData="state.menuData" @handleQuery="handleQuery" /> -->
	</div>
</template>

<script lang="ts" setup name="compile">
import { onMounted, reactive, ref, toRefs, computed, watch, watchEffect, onBeforeUnmount, onActivated, onDeactivated, onUpdated, onBeforeUpdate } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { getAPI } from '/@/utils/axios-utils';
import { SysMenuApi } from '/@/api-services/api';
import { SysMenu } from '/@/api-services/models';
import service from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { da, tr } from 'element-plus/es/locale';
import { type } from 'os';
import type { UploadInstance } from 'element-plus';
import router from '/@/router';
import { log } from 'console';
import { getCollectionGoodsInfoCache } from '/@/api/modular/main/collections.ts';
import { SysCodeGenConfigApi, SysConstApi, SysDictDataApi, SysDictTypeApi, SysEnumApi } from '/@/api-services/api';
const state = reactive({
	loading: true,
	menuData: [] as Array<SysMenu>,
	queryParams: {
		title: undefined,
		type: undefined,
	},
	editMenuTitle: '',
});
let tableParams = ref<any>({
	page: 1,
	pageSize: 100,
	total: '',
});
let id = ref<any>();
let collectionOrderInfo = reactive<any>({});
let collectionGoodsInfolist = reactive<any>([]);
let compile = ref<boolean>(false);
let rowCompile = ref<boolean>(false);
let widths = ref<any>(120);
let buttonDisabled = ref<any>(false);
const myButton = ref(null);
let visible = ref(false);
let allCompiles = ref(false);
let loadAll = ref();
let restaurants = ref<any>();
let states = ref<any>('');
let timeout = ref<any>(null);
let countRow = ref<any>([]);
let selectDelete = ref<any>([]);
let selectedRows = ref<any>([]);
let warnTagList = ref<any>([]);
let selectedWarnTag = ref<any>([]);
const spliceWarnTag = ref<any>([]); //切割好的风险标签列表
const splitSearchTag = ref<any>({}); //切割好的内部识别码标签列表
let copyDate = ref<any>([]);
let activeNames = ref('2');
let selectBox = ref<any>();
let myTable = ref<any>();
const Editchace = ref<any>([]);
let page = ref<any>(1);
let sumResult = ref<any>({
	averageCustomsBrokerageFee: 0,
	customsClearanceProducts: 0,
	numberBoxes: 0,
	squareNumber: 0,
});
let visibleediit = ref(false);
const uploadRef = ref<UploadInstance>();
let shippingMethodOptions = ref(['海运', '空运', '快递', '小包']);
let stateOptions = ref(['集货', '截仓', '在途中', '已入仓']);
let payerOptions = ref(['国内支付', '迪拜支付']);
let currencyOptions = ref([
	{ label: 'RMB 人民币', value: 'RMB' },
	{ label: 'AED 迪拉姆', value: 'AED' },
	{ label: 'SAR 沙特里亚尔', value: 'SAR' },
	{ label: 'USD 美元', value: 'USD' },
	{ label: 'GBP 英镑', value: 'GBP' },
	{ label: 'EUR 欧元', value: 'EUR' },
	{ label: 'CAD 加拿大元', value: 'CAD' },
]);
let fileList = ref<any>([]);

// onActivated(() => {
// 	getAppPage();
// });
function handleMouseScroll(e: any) {
	activeNames.value = '2';
}
// 风险标签改变
const WarnTagChange = (data: any, index: number) => {
	selectedWarnTag.value = data.warnTag;
};
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
	if (collectionGoodsInfolist[rowIndex].warnTag) {
		if (collectionGoodsInfolist[rowIndex].warnTag.length > 0) {
			return 'warnTag';
		}
	}
	return '';
};

function querySearchAsync(queryString: any, cb: any) {
	let restaurant = restaurants.value;
	let results = queryString ? restaurant.filter(createStateFilter(queryString)) : restaurant;
	if (warnTagList.value?.length) {
		restaurant?.map((item) => {
			let list = [];
			let tagList = item.warnTag?.split(",")
			tagList?.map((it) => {
				warnTagList.value?.map((i) => {
					if (i.value === it) {
						let obj = {
							color: i.code,
							value: it,
						};
						list.push(obj);
					}
				});
			})
			splitSearchTag.value[item.value] = list;
		});

	}
	clearTimeout(timeout);
	timeout.value = setTimeout(() => {
		cb(results);
	}, 1000 * Math.random());
}
function createStateFilter(queryString: any): any {
	return (states: any) => {
		if (states.value != null) {
			return states.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
		}
		return false;
	};
}
//获取内部唯一识别码
function cacheLable() {
	service({
		url: '/api/collectionGoodsInfoCache/collectionGoodsInfoCacheLable',
		method: 'get',
	}).then((data) => {
		restaurants.value = data.data.result;
		// restaurants.value = restaurants.value.filter((item: any) => {
		// 	return item.key != null && item.value != null;
		// });
	});
}
//失去焦点触发
function blurfun(val: any) {
	widths.value = 120;
}
//内部唯一识别码获取焦点时触发
function focuefuns(val: any) {
	widths.value = 200;
	if (countRow.value.indexOf(val.row.id) == -1) {
		countRow.value.push(val.row.id);
	}
}
//获取焦点时触发
function focuefun(val: any) {
	if (countRow.value.indexOf(val.row.id) == -1) {
		countRow.value.push(val.row.id);
	}
}

// 对箱单号进行正则验证
const inputBoxNo = (e: any) => {
	collectionGoodsInfolist.map((item: any) => {
		if (item.id === e.id) {
			item.boxNo = e.boxNo.replace(/[^\d.|^ECV|-]/g, '');
		}
	});
};

function customsFees() {
	//报关费/个=报关费/产品总个数（所有行的总个数）
	if (collectionOrderInfo.neetCustoms) {
		collectionGoodsInfolist.forEach((row: any) => {
			if (collectionOrderInfo.totalCustomsDeclarationFee && sumResult.value.customsClearanceProducts) {
				row.customsDeclarationFee = roundToThreeDecimalPlaces(collectionOrderInfo.totalCustomsDeclarationFee / sumResult.value.customsClearanceProducts);
			}
		});
	} else {
		collectionGoodsInfolist.forEach((row: any) => {
			row.customsDeclarationFee = 0;
		});
	}
}
//按钮是否禁用
let batch = ref<any>(false);
function disabledfun(val: any): void {
	console.log(val.row.warnTag)
	if (val.row.rowCompile) {
		if (Array.isArray(val.row.warnTagList)) {
			val.row.warnTag = val.row.warnTagList.join();
		}
		if (!val.row.cusUnit) {
			ElMessage({
				type: 'error',
				message: '报关单位不能为空,保存失败！',
			});
			return;
		}

		service({
			url: '/api/collectionGoodsInfo/update',
			method: 'post',
			data: val.row,
		}).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '保存成功',
				});

				val.row.rowCompile = !val.row.rowCompile;
				batch.value = false;

				service({
					url: '/api/collectionGoodsInfo/CalcBoxfulprice',
					method: 'post',
					data: val.row.documentNo,
				}).then((data) => {
					if (data.data.type == 'success') {
						console.log('拼箱成功');
					}
				});
				getAppPage();
			} else {
				ElMessage({
					type: 'error',
					message: '保存失败',
				});
			}
		});
	} else {
		batch.value = true;
		if (val.row.warnTag) {
			val.row.warnTag = val.row.warnTag.split(',');
		}
		val.row.rowCompile = !val.row.rowCompile;
		const chace = Editchace.value.find((obj: any) => obj.id === val.row.id);
		if (chace == null) {
			Editchace.value.push(JSON.parse(JSON.stringify(val.row)));
		}
	}
}
//删除/取消按钮
function examine(val: any): void {
	visible.value = !visible.value;
	if (val.row.rowCompile) {
		val.row.rowCompile = !val.row.rowCompile;
		getAppPage();
	} else {
		service({
			url: `/api/collectionGoodsInfo/delete`,
			method: 'post',
			data: { id: val.row.id },
		}).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '删除成功',
				});
				getAppPage();
			} else {
				ElMessage({
					type: 'error',
					message: '删除失败',
				});
			}
		});
	}
}
////附件上传
let fileLists = ref<any>([]);
function successfun(data: any, res: any) {
	if (data.type == 'success') {
		fileLists.value.push({
			name: res.name,
			status: res.status,
			uid: res.uid,
			url: res.response.result,
		});
	}
	ElMessage({
		type: 'success',
		message: '上传成功',
	});
}
//删除附件
function handleRemovefun(file: any, rawFile: any) {
	if (collectionOrderInfo.fileList.some((ele: any) => ele.uid == file.uid)) {
		service({
			url: `/api/collectionOrderInfo/deleteCollectionAttachment`,
			method: 'get',
			params: {
				id: collectionOrderInfo.id,
				url: file.url,
				uid: file.uid,
			},
		}).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '删除附件成功',
				});
				fileLists.value.forEach((element: any, index: any) => {
					if (element.uid == file.uid) {
						fileLists.value.splice(index, 1);
					}
				});
				collectionOrderInfo.fileList = fileLists.value;
				getAppPage();
			} else {
				ElMessage({
					type: 'error',
					message: '删除附件失败',
				});
			}
		});
	} else {
		fileList.value = fileLists.value;
	}
}
// 请求数据
async function getAppPage() {
	if (id.value) {
		service({
			url: `/api/collectionOrderInfo/detail`,
			method: 'get',
			params: {
				id: id.value,
				goodsPage: tableParams.value.page,
				goodsPageSize: tableParams.value.pageSize,
			},
		}).then((data) => {
			if (data.data.type == 'success') {
				Object.assign(collectionOrderInfo, data.data.result.collectionOrderInfo);
				getsum();
				collectionGoodsInfolist.splice(0, collectionGoodsInfolist.length);
				data.data.result.collectionGoodsInfolist.items.forEach((element: any) => {
					if (element.warnTag != null && element.warnTag != "") {
						let tag = element.warnTag?.split(',');
						let list = [];
						if (tag?.length && warnTagList.value?.length) {
							tag?.map((item) => {
								list.push(item);
							});
						}
						element.warnTagList = list;
					}
					//spliceWarnTag.value[element.id] = { warn: list };
					collectionGoodsInfolist.push(element);
				});
				olddocumentNo = collectionOrderInfo.documentNo;
				collectionOrderInfo.fileList = data.data.result.fileList;
				fileList.value.splice(0, fileList.value.length);
				if (data.data.result.fileList) {
					data.data.result.fileList.forEach((element: any) => {
						fileList.value.push(element);
					});
				}
				fileLists.value = fileList.value;
				tableParams.value.page = data.data.result.collectionGoodsInfolist.page;
				tableParams.value.pageSize = data.data.result.collectionGoodsInfolist.pageSize;
				tableParams.value.total = data.data.result.collectionGoodsInfolist.total;
				collectionGoodsInfolist.forEach((element: any) => {
					element.rowCompile = false;
				});

				state.loading = false;
				showCurrency();
			}
		});
	}
	service({
		url: '/api/collectionGoodsInfo/returnSelectBox',
		method: 'get',
	}).then((data) => {
		selectBox.value = data.data.result;
	});
}
//获取总和数据
function getsum() {
	service({
		url: `/api/collectionOrderInfo/getSumResult/${collectionOrderInfo.documentNo}`,
		method: 'get',
		params: {
			documentNo: collectionOrderInfo.documentNo,
		},
	}).then((data) => {
		sumResult.value = data.data.result;
		customsFees();
	});
}
// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getAppPage();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	getAppPage();
};
//滚动条触底刷新
// let bottomingOut=debounce(function(e:any){
// 	if(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight<50){
// 			page.value++
// 			service({
// 			url: `/api/collectionOrderInfo/detail`,
// 			method: 'get',
// 			params: {
// 				id: id.value,
// 				goodsPage:page.value,
// 				goodsPageSize:10,
// 			},
// 		}).then((data) => {
// 			if (data.data.type == 'success') {

// 				data.data.result.collectionGoodsInfolist.items.forEach((element: any) => {
// 					collectionGoodsInfolist.push(element);
// 				});
// 				collectionGoodsInfolist.forEach((element: any) => {
// 					element.rowCompile = false;
// 				});
// 				state.loading = false;
// 				OrderLockSwitch();
// 			}
// 		});
// 	}
// },1000)
onActivated(async () => {
	var refreshID = Session.get('refresh');
	if (refreshID == collectionOrderInfo.documentNo) {
		if (Session.get('isRefresh')) {
			getAppPage();
			Session.set('refresh', null)
			Session.set('isRefresh', null)

		}

	}




})



onMounted(async () => {
	const route = useRoute();
	if (route.query.id) {
		id.value = route.query.id;
	} else {
		compile.value = true;
	}
	handleQuery();
	cacheLable();
	var res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('warn_tag');
	warnTagList.value = res.data.result;
	getAppPage();
});
//新增一行
function newrow() {
	const newData = {
		internalUniqueID: '',
		forwarderID: '',
		purchaser: '',
		purchaseContractNo: '',
		boxNo: '',
		supplier: '',
		brand: '',
		productPic: '',
		customsName: '',
		customsElements: '',
		internalProductName: '',
		customsDeclarationModel: '',
		color: '',
		specification: '',
		plannedShipmentQuantity: '',
		actualShipmentQuantity: '',
		dubaiWarehouseReceiptQuantity: '',
		unit: '',
		quantityInBoxes: '',
		packBoxesQuantity: '',
		singleProductNetWeightKG: '',
		singleProductLength: '',
		singleProductWidth: '',
		singleProductHeight: '',
		fclGrossWeightKG: '',
		boxLength: '',
		boxWidth: '',
		boxHeight: '',
		totalNetWeightKG: '',
		totalGrossWeightKG: '',
		totalSquaresM3: '',
		volumeWeight: '',
		shippingTime: '',
		includingTaxPurchasePrice: '',
		domesticLogisticsCost: '',
		exportUnitPrice: '',
		totalExportPrice: '',
		commodityInspectionFee: '',
		customsDeclarationFee: '',
		singleCusInternationalLogisticsFee: '',
		singleInternationalLogisticsFee: '',
		totalInternationalLogisticsFee: '',
		incidentalPrice: '',
		fobSupplyPrice: '',
		documentNo: collectionOrderInfo.documentNo,
	};
	service({
		url: '/api/collectionGoodsInfo/add',
		method: 'post',
		data: newData,
	}).then((data) => {
		if (data.data.type == 'success') {
			tableParams.value.page = Math.ceil(tableParams.value.total / tableParams.value.pageSize);
			ElMessage({
				type: 'success',
				message: '新增成功',
			});
			getAppPage();
			setTimeout(() => {
				myTable.value.setScrollTop(document.querySelector('.el-table__row').offsetHeight * collectionGoodsInfolist.length);
				collectionGoodsInfolist[collectionGoodsInfolist.length - 1].rowCompile = true;
			}, 500);
		} else {
			ElMessage({
				type: 'error',
				message: '新增失败',
			});
		}
	});
}
//检查后台是否被占用
let timer = ref<any>();
let olddocumentNo = '';
function OrderLockSwitch() {
	if (!compile.value) {
		service({
			url: `/api/collectionOrderInfo/orderLock/${olddocumentNo}`,
			method: 'get',
			data: {
				documentNo: olddocumentNo,
			},
		}).then((data) => {
			if (data.data.type == 'success') {
				if (data.data.result.isLock) {
					ElMessage({
						type: 'error',
						message: `${data.data.result.msg}`,
					});
				} else {
					compile.value = !compile.value;
					timer.value = setInterval(() => {
						service({
							url: `/api/collectionOrderInfo/updateLockTime/${olddocumentNo}`,
							method: 'get',
							data: {
								documentNo: olddocumentNo,
							},
						});
					}, 30000);
				}
			} else {
				ElMessage({
					type: 'error',
					message: '编辑功能失效，请稍后重试！',
				});
			}
		});
	} else {
		if (collectionGoodsInfolist.some((obj: any) => obj.rowCompile == true)) {
			ElMessage({
				type: 'error',
				message: `还有数据未保存`,
			});
		} else {
			compile.value = !compile.value;
			clearInterval(timer.value);
		}
	}
}
//组件销毁
onBeforeUnmount(() => {
	compile.value = !compile.value;
	clearInterval(timer.value);
}),
	function aa() { };
//批量编辑
function bulkEditing() {
	if (!allCompiles.value) {
		allCompiles.value = !allCompiles.value;
	} else {
		collectionGoodsInfolist.forEach((element: any) => {
			if (countRow.value.indexOf(element.id) != -1) {
				service({
					url: '/api/collectionGoodsInfo/update',
					method: 'post',
					data: element,
				}).then((data) => {
					if (data.data.type == 'success') {
						ElMessage({
							type: 'success',
							message: '保存成功',
						});
						getAppPage();
					} else {
						ElMessage({
							type: 'error',
							message: '保存失败',
						});
					}
				});
			}
		});
		allCompiles.value = !allCompiles.value;
		countRow.value.splice(0, countRow.value.length);
	}
}
//批量删除
function deletion() {
	ElMessageBox.confirm('确认删除选中数据码？', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		draggable: true,
	})
		.then(() => {
			service({
				url: '/api/collectionOrderInfo/batchDelete',
				method: 'post',
				data: selectedRows.value,
			}).then((data) => {
				if (data.data.type == 'success') {
					ElMessage({
						type: 'success',
						message: '删除成功',
					});
					getAppPage();
				} else {
					ElMessage({
						type: 'error',
						message: '删除失败',
					});
				}
			});
		})
		.catch(() => {
			ElMessage({
				type: 'error',
				message: '删除失败',
			});
		});
}
function roundToThreeDecimalPlaces(number: any) {
	const strNumber = number.toString();
	const decimalIndex = strNumber.indexOf('.');

	if (decimalIndex !== -1 && strNumber.length - decimalIndex > 4) {
		return parseFloat(number.toFixed(3));
	} else {
		return number;
	}
}
//更换供应商则清空采购价含税(RMB)、出口单价(USD)字段
function changeSupplier(row: any) {
	const chace = Editchace.value.find((obj: any) => obj.id === row.id);
	if (row.supplier == chace.supplier) {
		row.includingTaxPurchasePrice = chace.includingTaxPurchasePrice;
		row.exportUnitPrice = chace.exportUnitPrice;
		return;
	}
	row.includingTaxPurchasePrice = 0;
	row.exportUnitPrice = 0;
}

//计算价格
let weightKG = (row: any) => {
	//装箱数=实际出货数量/装箱个数
	if (row.actualShipmentQuantity && row.quantityInBoxes) {
		row.packBoxesQuantity = Math.ceil(Number(row.actualShipmentQuantity / row.quantityInBoxes));
	}
	//总毛重量=整箱毛重*装箱数
	if (row.fclGrossWeightKG && row.packBoxesQuantity) {
		row.totalGrossWeightKG = roundToThreeDecimalPlaces(Number((row.fclGrossWeightKG * row.packBoxesQuantity).toFixed(2)));
	}
	//总净重KG=单个净重*实际出货数量
	if (row.singleProductNetWeightKG && row.actualShipmentQuantity) roundToThreeDecimalPlaces((row.totalNetWeightKG = row.singleProductNetWeightKG * row.actualShipmentQuantity));
	//总净重KG与总毛重比较
	if (row.totalNetWeightKG > row.totalGrossWeightKG) {
		ElMessage.error(row.internalProductName + '：数据异常，总净重大于总毛重。');
	}
	//总方数（立方米）=装箱长*宽*高*总箱数/6000/167
	if (row.boxLength && row.boxWidth && row.boxHeight && row.packBoxesQuantity) {
		row.totalSquaresM3 = roundToThreeDecimalPlaces(Number((row.boxLength * row.boxWidth * row.boxHeight * row.packBoxesQuantity) / 6000 / 167));
		//体积重=装箱长*宽*高*总箱数/6000
		row.volumeWeight = roundToThreeDecimalPlaces(Number((row.boxLength * row.boxWidth * row.boxHeight * row.packBoxesQuantity) / 6000));
	}
	//报关费/个=报关费/产品总个数（所有行的总个数）
	if (collectionOrderInfo.neetCustoms) {
		if (collectionOrderInfo.totalCustomsDeclarationFee && sumResult.value.customsClearanceProducts) {
			row.customsDeclarationFee = roundToThreeDecimalPlaces(collectionOrderInfo.totalCustomsDeclarationFee / sumResult.value.customsClearanceProducts);
		}
	} else {
		row.customsDeclarationFee = 0;
	}
	//FOB供应价=(采购价含税(RMB)*1.1+国内物流费用(RMB/个)+商检费+杂费+报关费)/汇率
	if (row.includingTaxPurchasePrice && collectionOrderInfo.exchangeRate) {
		row.fobSupplyPrice = roundToThreeDecimalPlaces(
			(row.includingTaxPurchasePrice * 1.1 + Number(row.domesticLogisticsCost) + Number(row.commodityInspectionFee) + Number(row.incidentalPrice) + Number(row.customsDeclarationFee)) /
			collectionOrderInfo.exchangeRate
		);
	}
	//空运
	//总毛重和体积重 谁大用谁
	//国际物流费用总额= 物流报价*(总毛重KG||体积重KG)
	row.totalInternationalLogisticsFee =
		collectionOrderInfo.shippingMethod == '空运'
			? row.volumeWeight > row.totalGrossWeightKG
				? roundToThreeDecimalPlaces(collectionOrderInfo.logisticsPrice * row.volumeWeight)
				: roundToThreeDecimalPlaces(collectionOrderInfo.logisticsPrice * row.totalGrossWeightKG)
			: collectionOrderInfo.shippingMethod == '海运'
				? roundToThreeDecimalPlaces(collectionOrderInfo.logisticsPrice * row.totalSquaresM3)
				: '';
	//报关物流费用(个)（RMB)=国际物流费用总额/报关数量
	if (row.totalInternationalLogisticsFee && row.plannedShipmentQuantity) {
		row.singleCusInternationalLogisticsFee = roundToThreeDecimalPlaces(row.totalInternationalLogisticsFee / row.plannedShipmentQuantity);
	}

	//国际物流费用(个)（RMB)=国际物流费用总额/实际出货量
	if (row.totalInternationalLogisticsFee && row.actualShipmentQuantity) {
		row.singleInternationalLogisticsFee = roundToThreeDecimalPlaces(row.totalInternationalLogisticsFee / row.actualShipmentQuantity);
	}

	// //出口单价(USD)=（采购价*1.1+国内运费单个+报关运费单个）/美元汇率
	// // if (
	// // 	collectionOrderInfo.exchangeRateUSD &&
	// // 	Number(
	// // 		row.includingTaxPurchasePrice * 1.1 + Number(row.domesticLogisticsCost) &&
	// // 			Number(row.includingTaxPurchasePrice * 1.1 + Number(row.domesticLogisticsCost) + Number(row.singleCusInternationalLogisticsFee))
	// // 	)
	// // ) {
	// // }
	// row.exportUnitPrice =
	// 	collectionOrderInfo.internationalLogisticsFeePayer == '迪拜支付'
	// 		? (Number((row.includingTaxPurchasePrice * 1.1 + Number(row.domesticLogisticsCost)) / collectionOrderInfo.exchangeRateUSD)).toFixed(2)
	// 		: collectionOrderInfo.internationalLogisticsFeePayer == '国内支付'
	// 			? (
	// 				Number((row.includingTaxPurchasePrice * 1.1 + Number(row.domesticLogisticsCost) + Number(row.singleCusInternationalLogisticsFee)) / collectionOrderInfo.exchangeRateUSD)
	// 			).toFixed(2)
	// 			: '';
	//出口单价(USD)=（采购价*1.1+国内运费单个+报关运费单个）/美元汇率
	if (collectionOrderInfo.internationalLogisticsFeePayer == '国内支付') {
		row['exportUnitPrice'] = Number(
			((row['includingTaxPurchasePrice'] * 1.1 + Number(row['domesticLogisticsCost']) + Number(row['singleCusInternationalLogisticsFee'])) / collectionOrderInfo.exchangeRateUSD).toFixed(2)
		);
	}
	//出口单价(USD)=（采购价*1.1+国内运费单个）/美元汇率
	else if (collectionOrderInfo.internationalLogisticsFeePayer == '迪拜支付') {
		row['exportUnitPrice'] = Number(((row['includingTaxPurchasePrice'] * 1.1 + Number(row['domesticLogisticsCost'])) / collectionOrderInfo.exchangeRateUSD).toFixed(2));
	}
	else{
		ElMessage({
						type: 'error',
						message: '请补充【国际物流支付方】',
					});
	}

	//出口总价(USD)=出口单价*报关数量
	row.totalExportPrice = row.exportUnitPrice * row.plannedShipmentQuantity;
};

//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
}
//复制
function copy() {
	Session.set('selectedGoods', null);
	Session.set('iscut', null);
	copyDate.value.length = 0;
	if (selectedRows.value.length == 0) {
		ElMessage({
			type: 'info',
			message: '请选择数据',
		});
		return;
	}
	selectedRows.value.forEach((element: any) => {
		collectionGoodsInfolist.forEach((item: any) => {
			if (item.id == element) {
				copyDate.value.push(item);
			}
		});
	});

	Session.set('selectedGoods', copyDate.value);
	ElMessage({
		type: 'success',
		message: '复制成功',
	});
}
//剪切
function cut() {
	copyDate.value.length = 0;
	if (selectedRows.value.length == 0) {
		ElMessage({
			type: 'info',
			message: '请选择数据',
		});
		return;
	}
	selectedRows.value.forEach((element: any) => {
		collectionGoodsInfolist.forEach((item: any) => {
			if (item.id == element) {
				copyDate.value.push(item);
			}
		});
		Session.set('selectedGoods', copyDate.value);
		Session.set('iscut', selectedRows.value);
		Session.set('refresh', collectionOrderInfo.documentNo);
		Session.set('isRefresh', false);
		ElMessage({
			type: 'success',
			message: '剪切成功',
		});
	});
}
//粘贴
function affix() {
	let obj = Session.get('selectedGoods');
	if (!obj) {
		ElMessage({
			type: 'info',
			message: '请选择数据',
		});
		return;
	}
	let iscut = Session.get('iscut');
	if (Session.get('iscut')) {
		Session.set('isRefresh', true);
		if (obj.length == 1) {
			obj[0].documentNo = collectionOrderInfo.documentNo;
			obj[0].id = collectionOrderInfo.id;
			service({
				url: '/api/collectionGoodsInfo/add',
				method: 'post',
				data: obj[0],
			}).then((data) => {
				if (data.data.type == 'success') {
					tableParams.value.page = Math.ceil(tableParams.value.total / tableParams.value.pageSize);
					ElMessage({
						type: 'success',
						message: '粘贴成功',
					});

					service({
						url: '/api/collectionOrderInfo/batchDelete',
						method: 'post',
						data: iscut,
					}).then((data) => {
						if (data.data.type == 'success') {
							ElMessage({
								type: 'success',
								message: '剪切板内容已清空',
							});
							Session.set('selectedGoods', null);
							Session.set('iscut', null);

							getAppPage();
						}
					});

					getAppPage().then(() => {
						myTable.value.setScrollTop(document.querySelector('.el-table__row').offsetHeight * (collectionGoodsInfolist.length + 1));
					});
				} else {
					ElMessage({
						type: 'error',
						message: '粘贴失败',
					});
				}
			});
		}
		if (obj.length > 1) {
			obj.forEach((element: any) => {
				element.documentNo = collectionOrderInfo.documentNo;
				element.id = collectionOrderInfo.id;
				service({
					url: '/api/collectionGoodsInfo/add',
					method: 'post',
					data: element,
				}).then((data) => {
					if (data.data.type == 'success') {
						tableParams.value.page = Math.ceil(tableParams.value.total / tableParams.value.pageSize);
						ElMessage({
							type: 'success',
							message: '粘贴成功',
						});

						getAppPage().then(() => {
							myTable.value.setScrollTop(document.querySelector('.el-table__row').offsetHeight * (collectionGoodsInfolist.length + 1));
						});
					} else {
						ElMessage({
							type: 'error',
							message: '粘贴失败',
						});
						return;
					}
				});
				collectionGoodsInfolist.push(element);
			});

			service({
				url: '/api/collectionOrderInfo/batchDelete',
				method: 'post',
				data: iscut,
			}).then((data) => {
				if (data.data.type == 'success') {
					ElMessage({
						type: 'success',
						message: '剪切板内容已清空',
					});
				}
			});
			Session.set('selectedGoods', null);
			Session.set('iscut', null);
		}
	} else {
		if (obj.length == 1) {
			obj[0].documentNo = collectionOrderInfo.documentNo;
			obj[0].id = collectionOrderInfo.id;
			service({
				url: '/api/collectionGoodsInfo/add',
				method: 'post',
				data: obj[0],
			}).then((data) => {
				if (data.data.type == 'success') {
					tableParams.value.page = Math.ceil(tableParams.value.total / tableParams.value.pageSize);
					ElMessage({
						type: 'success',
						message: '粘贴成功,剪切板内容已清空',
					});

					Session.set('selectedGoods', null);
					Session.set('iscut', null);
					getAppPage().then(() => {
						myTable.value.setScrollTop(document.querySelector('.el-table__row').offsetHeight * (collectionGoodsInfolist.length + 1));
					});
				} else {
					ElMessage({
						type: 'error',
						message: '粘贴失败',
					});
				}
			});
		}
		if (obj.length > 1) {
			obj.forEach((element: any) => {
				element.documentNo = collectionOrderInfo.documentNo;
				element.id = collectionOrderInfo.id;
				service({
					url: '/api/collectionGoodsInfo/add',
					method: 'post',
					data: element,
				}).then((data) => {
					if (data.data.type == 'success') {
						tableParams.value.page = Math.ceil(tableParams.value.total / tableParams.value.pageSize);
						ElMessage({
							type: 'success',
							message: '粘贴成功',
						});
						Session.set('selectedGoods', null);
						Session.set('iscut', null);
						getAppPage().then(() => {
							myTable.value.setScrollTop(document.querySelector('.el-table__row').offsetHeight * (collectionGoodsInfolist.length + 1));
						});
					} else {
						ElMessage({
							type: 'error',
							message: '粘贴失败',
						});
						return;
					}
				});
				collectionGoodsInfolist.push(element);
			});
			ElMessage({
				type: 'success',
				message: '剪切板内容已清空',
			});
		}
	}
}

//下载文件
function downloadfile(res) {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
	var result = patt.exec(contentDisposition);
	var filename = result[1];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURI(filename.replace(reg, '$1')); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
}
//判断标签是否存在于集合中
function IsTag(tag: any) {
	const element = warnTagList.value.find(item => item.value === tag);
	if (element) {
		return element.code;
	}
	return "#DE2910";
}
//根据内部唯一识别码填充数据
function handleSelect(val: any) {
	getCollectionGoodsInfoCache({ internalUniqueID: val.row.internalUniqueID }).then((data: any) => {
		if (data.data.type == 'success') {
			for (let i in val.row) {
				if (i == 'rowCompile' || i == 'documentNo' || i == 'id' || i == 'boxNo') {
				} else if (i == 'warnTagList') {
					if (data.data.result.warnTag != null && data.data.result.warnTag != "") {
						let list = [];
						let tag = data.data.result.warnTag?.split(',');
						tag?.map((item) => {
							list.push(item);
						});
						val.row[i] = list;
					}
				} else {
					val.row[i] = data.data.result[i];
				}
			}
			const chace = Editchace.value.find(obj => obj.id === val.row.id);
			if (chace) {
				Editchace.value[Editchace.value.findIndex(obj => obj.id === val.row.id)] = JSON.parse(JSON.stringify(val.row));
			} else {
				Editchace.value.push(JSON.parse(JSON.stringify(val.row)));
			}
		}
	});
}
//导出报关件
function exportBaoguan() {
	service({
		url: `/api/collectionOrderInfo/export/${collectionOrderInfo.documentNo}`,
		method: 'get',
		data: { documentNo: collectionOrderInfo.documentNo },
		responseType: 'blob',
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
				getAppPage();
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
}
//导出验货单
function exportYanhuo() {
	service({
		url: `/api/collectionOrderInfo/exportYanhuo/${collectionOrderInfo.documentNo}`,
		method: 'get',
		data: { documentNo: collectionOrderInfo.documentNo },
		responseType: 'blob',
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出成功',
				});
				getAppPage();
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
}
//导出外箱标签
function exportBoxTag() {
	service({
		url: `/api/collectionOrderInfo/exportWord/${collectionOrderInfo.documentNo}/${selectedRows.value.toString() ? selectedRows.value.toString() : collectionGoodsInfolist[0].id}`,
		method: 'get',
		data: { documentNo: collectionOrderInfo.documentNo, goodsID: selectedRows.value.toString() },
		responseType: 'blob',
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出外箱标签成功',
				});
				getAppPage();
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
}
//导出箱单号条形码
function exportPackingListNumber() {
	service({
		url: `/api/collectionOrderInfo/ExportPackingListNumber/${collectionOrderInfo.documentNo}`,
		method: 'get',
		data: { documentNo: collectionOrderInfo.documentNo },
		responseType: 'blob',
	})
		.then((data) => {
			downloadfile(data);
			if (data.statusText == 'OK') {
				ElNotification({
					title: '系统提示',
					message: '导出成功',
					type: 'success',
				});
				ElMessage({
					type: 'success',
					message: '导出箱单号条形码成功',
				});
				getAppPage();
			}
		})
		.catch((arr) => {
			ElNotification({
				title: '系统提示',
				message: '下载错误：获取文件流错误',
				type: 'error',
			});
			ElMessage({
				type: 'error',
				message: '导出失败',
			});
		});
}
let isCommit = computed(function com() {
	showCurrency();
	if (!collectionOrderInfo.documentNo && !(collectionOrderInfo.documentNo === 0)) {
		return false;
	} else if (!collectionOrderInfo.forwarderID && !(collectionOrderInfo.forwarderID === 0)) {
		return false;
	} else if (!collectionOrderInfo.logisticsPrice && !(collectionOrderInfo.logisticsPrice === 0)) {
		return false;
	} else if (!collectionOrderInfo.logisticsPriceCurrency && !(collectionOrderInfo.logisticsPriceCurrency === 0)) {
		return false;
	} else if (!collectionOrderInfo.totalCustomsDeclarationFee && !(collectionOrderInfo.totalCustomsDeclarationFee === 0)) {
		return false;
	} else if (!collectionOrderInfo.exchangeRate && !(collectionOrderInfo.exchangeRate === 0)) {
		return false;
	} else if (!collectionOrderInfo.exchangeRateUSD && !(collectionOrderInfo.exchangeRateUSD === 0)) {
		return false;
	} else if (!collectionOrderInfo.exchangeRate && !(collectionOrderInfo.exchangeRate === 0)) {
		return false;
	} else {
		return true;
	}
});
//提交
function commit() {
	collectionOrderInfo.fileList = fileLists.value;
	if (id.value) {
		service({
			url: '/api/collectionOrderInfo/update',
			method: 'post',
			data: collectionOrderInfo,
		}).then((data) => {
			if (data.data.type == 'success') {
				ElMessage({
					type: 'success',
					message: '更新成功',
				});
				activeNames.value = '2';
				getAppPage();
			} else {
				ElMessage({
					type: 'error',
					message: '更新失败',
				});
			}
		});
	} else {
		for (let i in collectionOrderInfo) {
			if (collectionOrderInfo[i] == null) {
				collectionOrderInfo[i] = '';
			}
		}
		service({
			url: '/api/collectionOrderInfo/add',
			method: 'post',
			data: collectionOrderInfo,
		}).then((data) => {
			if (data.data.type == 'success') {
				router.push({ path: '/business/edit/edit?id', query: { id: data.data.result.id, name: '集货单详情编辑页面' } });
			} else {
				ElMessage({
					type: 'error',
					message: '添加失败',
				});
			}
		});
	}
}
//提交按钮遮罩
let buttonmask = ref<any>(false);
function commitzz() {
	buttonmask.value = true;
	ElMessage({
		type: 'warning',
		message: '标 * 号的是必填项哦',
	});
}
//总箱数
let numberBoxes = computed(() => {
	let Sum = 0;
	collectionGoodsInfolist.forEach((element: any) => {
		Sum += element.packBoxesQuantity;
	});
	return Sum;
});
//总方数
let squareNumber = computed(() => {
	let Sum = 0;
	collectionGoodsInfolist.forEach((element: any) => {
		Sum += element.totalSquaresM3;
	});
	return Sum.toFixed(3);
});
//报关产品
let customsClearanceProducts = computed(() => {
	let Sum = 0;
	collectionGoodsInfolist.forEach((element: any) => {
		Sum += element.actualShipmentQuantity;
	});
	return Sum;
});
//平均报关费
let averageCustomsBrokerageFee = computed(() => {
	let Sum = 0;
	let mSum = 0;
	collectionGoodsInfolist.forEach((element: any) => {
		Sum += element.actualShipmentQuantity;
	});
	return (collectionOrderInfo.totalCustomsDeclarationFee / Sum).toFixed(3);
});
//重新计价
function repricefun() {
	collectionGoodsInfolist.forEach((element: any) => {
		weightKG(element);
		service({
			url: '/api/collectionGoodsInfo/update',
			method: 'post',
			data: element,
		});
	});

	ElMessage({
		type: 'success',
		message: '计算完成',
	});
}
//限制用户输入空
function formatInput(value: any, type: any) {
	return value.replace(/\s+/g, '');
}
let collectionLogisticsFee = ref<any>();
let internationalLogisticsFee = ref<any>();
let fobCurrency = ref<any>('AED/SAR');
function showCurrency() {
	collectionLogisticsFee.value = collectionOrderInfo.logisticsPriceCurrency;
	if (!collectionLogisticsFee.value) {
		collectionLogisticsFee.value = 'RMB';
	}
	internationalLogisticsFee.value = collectionOrderInfo.destination;
	if (internationalLogisticsFee.value) {
		fobCurrency.value = 'AED/SAR';
		fobCurrency.value = internationalLogisticsFee.value.search('迪拜') >= 0 ? 'AED' : fobCurrency.value;
		fobCurrency.value = internationalLogisticsFee.value.search('沙特') >= 0 ? 'SAR' : fobCurrency.value;
	}
}
// 查询操作
const handleQuery = async () => {
	state.loading = true;
	var res = await getAPI(SysMenuApi).apiSysMenuListGet(state.queryParams.title, state.queryParams.type);
	state.menuData = res.data.result ?? [];
	state.loading = false;
};

// 重置操作
const resetQuery = () => {
	state.queryParams.title = undefined;
	state.queryParams.type = undefined;
	handleQuery();
};

// 打开新增页面
const openAddMenu = () => {
	state.editMenuTitle = '添加菜单';
};

// 打开编辑页面
const openEditMenu = (row: any) => {
	state.editMenuTitle = '编辑菜单';
};
//货代名称
function changefun(val: any) {
	service({
		url: '/collectionForwarderBaseInfo/getForwarderInfo',
		method: 'get',
		data: { id: val },
	}).then((data) => {
		if (data.data.type == 'success') {
			for (let i in data.data.result) {
				if (i == 'recipientName') {
					collectionOrderInfo[i] = data.data.result[i];
				}
				if (i == 'recipientPhone') {
					collectionOrderInfo[i] = data.data.result[i];
				}
				if (i == 'deliveryAddress') {
					collectionOrderInfo[i] = data.data.result[i];
				}
				if (i == 'notes') {
					collectionOrderInfo[i] = data.data.result[i];
				}
			}
		}
	});
}
//出发日期改变获得预计到仓日期
function departureDateChange(val: any) {
	if (collectionOrderInfo.shippingMethod) {
		var addDay =
			collectionOrderInfo.shippingMethod == '海运'
				? collectionOrderInfo.destination == '迪拜'
					? 33
					: 42
				: collectionOrderInfo.shippingMethod == '空运'
					? collectionOrderInfo.destination == '迪拜'
						? 9
						: 13
					: 0;
		if (addDay) {
			var date1 = new Date(val);
			new Date(date1.setDate(date1.getDate() + addDay)).toLocaleDateString();
			collectionOrderInfo.estimatedDeliveryDate = date1;
		}
	}
}
//起飞开船日期改变获得预计送仓日期
function actualArrivalDateChange(val: any) {
	if (collectionOrderInfo.shippingMethod) {
		var addDay =
			collectionOrderInfo.shippingMethod == '海运'
				? collectionOrderInfo.destination == '迪拜'
					? 35
					: 40
				: collectionOrderInfo.shippingMethod == '空运'
					? collectionOrderInfo.destination == '迪拜'
						? 6
						: 7
					: 0;
		if (addDay) {
			var date1 = new Date(val);
			new Date(date1.setDate(date1.getDate() + addDay)).toLocaleDateString();
			collectionOrderInfo.estimatedArrivalDate = date1;
		}
	}
}


</script>

<style scoped lang="less">
.titleForm {
	width: 100px;
	transform: translate(50%);
	color: red;
}

:deep(.el-collapse-item__arrow) {
	// display: none !important;
	margin: 0 8px;
}

.error-message {
	color: red;
	font-size: 12px;
	position: absolute;
	top: 30px;
	margin-left: 10px;
}

.wuliu {
	position: absolute;

	top: 40px;
	width: 200px;
}

:deep(.el-collapse-item__header) {
	justify-content: center;
}

:deep(.el-collapse-item__wrap) {
	padding-top: 20px;
}

:deep(.el-collapse-item) {
	width: 101%;
}

:deep(.el-collapse) {
	margin-top: 72px;

	position: absolute;
	z-index: 1000;
	width: 99%;
	padding-right: 20px;
	color: red;
}

:deep(.el-input__wrapper) {
	width: 100%;
}

.avt {
	// border-color:#DE2910 ;
	box-shadow: 0 0 0 1px #de2910;
}

:deep(.el-table__cell) {
	padding: 0;
}

:deep(.el-table--small .cell) {
	padding: 0 1px;
}

:deep(.el-table__body-wrapper) {
	&::-webkit-scrollbar {
		height: 6px;
		width: 6px;
	}
}

:deep(.layout-container-view .el-scrollbar__view) {
	height: 101%;
}

:deep(.el-select .el-input) {
	width: 100%;
}
</style>
<style>
.warnTag {
	--el-table-tr-bg-color: var(--el-color-danger-light-9);
}

tr.warnTag td.el-table-fixed-column--left {
	background: var(--el-color-danger-light-9);
}
</style>
