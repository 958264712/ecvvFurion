<template>
	<div class="sys-menu-container">
		<!--  @wheel="handleMouseScroll" 使activeNames为2 收拢折叠面板 -->
		<el-card shadow="hover" :body-style="{ padding: '3px 0 0 3px' }" style="margin-bottom: 30px">
			<el-row v-if="id">
				<el-form-item>
					<el-button v-if="collectionOrderInfo.customsDeclarationNo" size="small" type="primary" @click="deblockingBox" v-auth="'edit:deblocking'">解锁 </el-button>
					<el-button size="small" type="primary" icon="ele-Plus" :disabled="allCompiles" @click="OrderLockSwitch" style="margin-right: 20px"> {{ compile ? '退出编辑' : '编辑' }} </el-button>
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
					<el-input
						:formatter="formatInput"
						:class="!collectionOrderInfo.documentNo && buttonmask ? 'avt' : ''"
						v-model="collectionOrderInfo.documentNo"
						clearable=""
						:disabled="!compile || true"
						placeholder="请输入单据编号"
					/>
				</el-form-item>
				<el-form-item label="货代名称" prop="forwarderID" required="true">
					<el-select
						@change="changefun"
						:formatter="formatInput"
						:class="!collectionOrderInfo.forwarderID && buttonmask ? 'avt' : ''"
						v-model="collectionOrderInfo.forwarderID"
						filterable
						clearable
						class="w100"
						:disabled="state.hasCusNo || !compile"
					>
						<el-option v-for="item in selectBox" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="目的地">
					<el-input v-model="collectionOrderInfo.destination" @input="showCurrency()" clearable="" :disabled="state.hasCusNo || !compile" placeholder="请输入目的地" />
				</el-form-item>
				<el-form-item label="截仓日期">
					<el-date-picker v-model="collectionOrderInfo.cutOffDate" clearable="" type="date" :disabled="state.hasCusNo || !compile" placeholder="请输入截仓日期" />
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
							<el-form-item label="收货平台(店铺)" prop="consigneeName" style="width: 90%">
								<el-select :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.consigneeName" placeholder="请选择" filterable clearable>
									<el-option v-for="item in platformStoreOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="美元汇率" style="width: 90%" prop="exchangeRateUSD" required="true">
								<el-input
									type="number"
									:formatter="formatInput"
									@change="repricefun"
									:class="!collectionOrderInfo.exchangeRateUSD && buttonmask ? 'avt' : ''"
									:disabled="state.hasCusNo || !compile"
									v-model="collectionOrderInfo.exchangeRateUSD"
									clearable=""
									placeholder="请输入美元汇率"
								/>
							</el-form-item>
							<el-form-item label="报关单号" style="width: 90%">
								<el-input :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.customsDeclarationNo" clearable="" placeholder="请输入报关单号" />
							</el-form-item>
							<el-form-item label="状态" style="width: 90%">
								<el-select :disabled="!compile" v-model="collectionOrderInfo.state" filterable clearable>
									<el-option v-for="item in stateOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="交仓地址" style="width: 90%">
								<el-input :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.deliveryAddress" clearable="" placeholder="请输入交仓地址" />
							</el-form-item>
							<el-form-item label="开船／起飞日期" style="width: 90%">
								<el-date-picker @change="actualArrivalDateChange" :disabled="!compile" v-model="collectionOrderInfo.actualArrivalDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="国际物流支付方" style="width: 90%" prop="internationalLogisticsFeePayer" :rules="[{ required: true, message: '国际物流支付方不能为空', trigger: 'blur' }]">
								<el-select :disabled="state.hasCusNo || !compile" @change="repricefun" v-model="collectionOrderInfo.internationalLogisticsFeePayer" filterable clearable>
									<el-option v-for="item in payerOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="备注" style="width: 90%">
								<el-input :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.notes" type="textarea" placeholder="请输入备注" />
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="物流报价" style="width: 90%" prop="logisticsPrice" required="true">
								<el-row style="width: 100%">
									<el-col :xs="16" :sm="16" :md="16" :xl="16">
										<el-input
											type="number"
											:formatter="formatInput"
											@change="repricefun"
											:class="!collectionOrderInfo.logisticsPrice && buttonmask ? 'avt' : ''"
											:disabled="state.hasCusNo || !compile"
											v-model="collectionOrderInfo.logisticsPrice"
											clearable=""
											style="width: 100%"
											placeholder="请输入"
										/>
									</el-col>
									<el-col :xs="8" :sm="8" :md="8" :xl="8">
										<el-select
											:formatter="formatInput"
											:class="!collectionOrderInfo.logisticsPriceCurrency && buttonmask ? 'avt' : ''"
											v-model="collectionOrderInfo.logisticsPriceCurrency"
											filterable
											clearable
											id="select"
											style="width: 100%"
											:disabled="state.hasCusNo || !compile"
										>
											<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
										</el-select>
									</el-col>
								</el-row>
							</el-form-item>
							<el-form-item label="是否报关">
								<el-switch :disabled="state.hasCusNo || !compile" @change="repricefun" v-model="collectionOrderInfo.neetCustoms" inline-prompt active-text="是" inactive-text="否" /><br />
							</el-form-item>
							<br />
							<el-form-item label="运输方式" style="width: 90%" prop="shippingMethod" required="true">
								<el-select
									:class="!collectionOrderInfo.shippingMethod && buttonmask ? 'avt' : ''"
									@change="repricefun"
									v-model="collectionOrderInfo.shippingMethod"
									:disabled="state.hasCusNo || !compile"
									filterable
									clearable
								>
									<el-option v-for="item in shippingMethodOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="收件人" style="width: 90%">
								<el-input :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.recipientName" clearable="" placeholder="请输入收件人" />
							</el-form-item>
							<el-form-item label="验货完成日期" style="width: 90%">
								<el-date-picker :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.departureDate" @change="departureDateChange" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="创建日期" style="width: 90%">
								<el-date-picker :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.orderCreatedDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="附件" style="width: 90%">
								<el-upload
									v-model:file-list="fileList"
									action="http://192.168.1.81:5568/api/collectionOrderInfo/collectionUploadAttachment"
									:on-success="successfun"
									:multiple="true"
									:show-file-list="true"
									name="file"
									:before-remove="handleRemovefun"
									:disabled="state.hasCusNo || !compile"
								>
									<el-button :disabled="state.hasCusNo || !compile" type="primary" :loading="loading1" icon="ele-Plus" style="margin-right: 20px"> 附件上传 </el-button>
								</el-upload>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="汇率" style="width: 90%" prop="exchangeRate" required="true">
								<el-input
									type="number"
									:formatter="formatInput"
									:class="!collectionOrderInfo.exchangeRate && buttonmask ? 'avt' : ''"
									:disabled="state.hasCusNo || !compile"
									v-model="collectionOrderInfo.exchangeRate"
									clearable=""
									placeholder="请输入"
								/>
							</el-form-item>
							<el-form-item label="报关费" style="width: 90%" prop="totalCustomsDeclarationFee" required="true">
								<el-input
									type="number"
									:formatter="formatInput"
									:class="!collectionOrderInfo.totalCustomsDeclarationFee && buttonmask ? 'avt' : ''"
									:disabled="state.hasCusNo || !compile"
									v-model="collectionOrderInfo.totalCustomsDeclarationFee"
									clearable=""
									placeholder="请输入报关费"
								/>
							</el-form-item>
							<el-form-item label="货代入仓号" style="width: 90%">
								<el-input :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.inWareHouseNo" clearable="" placeholder="请输入货代入仓号" />
							</el-form-item>
							<el-form-item label="收件联系电话" style="width: 90%">
								<el-input type="number" :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.recipientPhone" clearable="" placeholder="请输入收件联系电话" />
							</el-form-item>
							<el-form-item label="预计送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.estimatedArrivalDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="实际送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.actualDeliveryDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="物流预计到仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.estimatedDeliveryDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="创建人" style="width: 90%">
								<el-input :disabled="state.hasCusNo || !compile" v-model="collectionOrderInfo.orderCreatedUser" clearable="" placeholder="请输入" />
							</el-form-item>
						</el-col>
						<div style="margin: 0 auto; position: relative">
							<el-button :disabled="!compile" type="primary" @click="commit">提交</el-button>
							<el-button v-if="!isCommit" type="primary" style="position: absolute; left: -11px; background-color: rgba(0, 0, 0, 0); border: 0" @click="commitzz()">提交</el-button>
						</div>
					</el-row>
				</el-form>
			</el-collapse-item>
		</el-collapse>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px" v-show="id">
			<div style="display: flex; justify-content: space-between">
				<span
					>总箱数 : {{ sumResult.numberBoxes }} 总方数 : {{ sumResult.squareNumber }}(立方米) 报关产品 : {{ sumResult.customsClearanceProducts }}(个) 平均报关费 :
					{{ sumResult.averageCustomsBrokerageFee }}/个 总重量：{{ sumResult.totalGrossWeightKG }}KG</span
				>
				<el-button style="width: 150px" :loading="loading3" type="primary" @click="openimportDialog">导入商品报关规格</el-button>
			</div>
			<el-table
				class="table-container"
				v-loading="state.loading"
				:data="collectionGoodsInfolist"
				:row-class-name="tableRowClassName"
				style="width: 100%; margin-top: 10px"
				ref="myTable"
				@selection-change="handleSelectionChange"
			>
				<el-table-column fixed type="selection" width="20"></el-table-column>

				<el-table-column fixed label="操作" width="100" align="center">
					<template #default="scope">
						<el-button :disabled="state.hasCusNo || !compile || allCompiles" size="small" text type="primary" ref="myButton" @click="disabledfun(scope)">{{
							scope.row.rowCompile ? '保存' : '编辑'
						}}</el-button>
						<el-popover placement="top" width="200" :disabled="visible" trigger="click">
							<p>确定{{ scope.row.rowCompile ? '取消' : '删除' }}吗？</p>
							<div style="text-align: right; margin: 0">
								<el-button
									size="small"
									type="text"
									@click="
										visible = true;
										scope.row.rowCompile ? `${(scope.row.rowCompile = !scope.row.rowCompile)}` : '';
									"
									>取消</el-button
								>
								<el-button type="primary" size="small" @click="examine(scope)">确定</el-button>
							</div>
							<template #reference>
								<el-button :disabled="!compile || state.hasCusNo || allCompiles" size="small" text type="primary" @click="visible = false"> {{ scope.row.rowCompile ? '取消' : '删除' }} </el-button>
							</template>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column fixed type="index" label="序号" width="65" align="center" />
				<el-table-column fixed prop="internalUniqueID" label="内部唯一识别码" :width="widths">
					<template #default="scope">
						<!-- <el-input v-if="allCompiles" v-model="scope.row.internalUniqueID" @focus="focuefuns(scope)" @blur="widths = 150"> </el-input> -->
						<el-autocomplete
							:formatter="formatInput"
							v-if="scope.row.rowCompile || allCompiles"
							v-model="scope.row.internalUniqueID"
							:fetch-suggestions="querySearchAsync"
							placeholder="请输入内容"
							@select="handleSelect(scope)"
							@focus="focuefun(scope)"
							@blur="blurfun(scope)"
						>
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
						<el-select multiple v-model="scope.row.warnTagList" class="m-2" placeholder="Select" v-if="scope.row.rowCompile || allCompiles" @change="WarnTagChange(scope.row, scope.$index)">
							<el-option v-for="item in warnTagList" :key="item.value" :label="item.label" :value="item.value">
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
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.internalProductName"></el-input>
					</template>
				</el-table-column>
				<el-table-column fixed prop="boxNo" label="ECVV箱单号" width="120">
					<template #default="scope">
						<el-input
							v-if="scope.row.rowCompile || allCompiles"
							placeholder="只能包含ECVV0123456789-相关内容"
							@input="inputBoxNo(scope.row)"
							@focus="focuefun(scope)"
							v-model="scope.row.boxNo"
						></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="purchaser" label="采购员" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.purchaser"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="purchaseContractNo" label="采购合同号" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.purchaseContractNo"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="supplier" label="供应商" width="180">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @change="changeSupplier(scope.row)" @focus="focuefun(scope)" v-model="scope.row.supplier"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="brand" label="品牌" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.brand"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="productPic" label="产品图" width="60">
					<template #default="scope">
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.productPic"></el-input> -->
						<img :src="'https://raw.githubusercontent.com/okbuynow/OKPIC/main/50x50/' + scope.row.internalUniqueID + '.jpg'" alt="" />
					</template>
				</el-table-column>
				<el-table-column prop="notes" label="备注" width="120" show-overflow-tooltip="">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.notes"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsName" label="报关品名" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.customsName"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsElements" label="报关要素" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.customsElements"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="enProductName" label="英文名称" width="120">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.enProductName"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="material" label="材质" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.material"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="use" label="用途" width="100">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.use"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsDeclarationModel" label="报关型号" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.customsDeclarationModel"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="color" label="颜色" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.color"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="specification" label="规格" width="60">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.specification"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="plannedShipmentQuantity" label="报关数量" width="70">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.plannedShipmentQuantity"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="cusUnit" label="报关单位" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.cusUnit"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="actualShipmentQuantity" label="集货数量" width="70">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.actualShipmentQuantity"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="unit" label="集货单位" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.unit"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="unitInfo" label="补充说明" width="70">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.unitInfo"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="quantityInBoxes" label="装箱个数" width="70">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.quantityInBoxes"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="packBoxesQuantity" label="装箱数" width="60">
					<template #default="scope">
						<el-popover placement="top" width="200" v-if="scope.row.rowCompile || allCompiles" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.packBoxesQuantity" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.packBoxesQuantity" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="singleProductNetWeightKG" label="单个产品净重KG" width="110">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.singleProductNetWeightKG"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="singleProductLength" label="产品长(cm)" width="80">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.singleProductLength"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="singleProductWidth" label="产品宽(cm)" width="80">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.singleProductWidth"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="singleProductHeight" label="产品高(cm)" width="80">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.singleProductHeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="fclGrossWeightKG" label="整箱毛重KG" width="90">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.fclGrossWeightKG"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="boxLength" label="箱长(cm)" width="70">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.boxLength"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="boxWidth" label="箱宽(cm)" width="70">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.boxWidth"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="boxHeight" label="箱高(cm)" width="70">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.boxHeight"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="totalNetWeightKG" label="总净重KG" width="80">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.totalNetWeightKG" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.totalNetWeightKG" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="totalGrossWeightKG" label="总毛重KG" width="80">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.totalGrossWeightKG"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="totalSquaresM3" label="总方数m³" width="80">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile" v-model="scope.row.totalSquaresM3" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="pricefun(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.totalSquaresM3" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="volumeWeight" label="体积重" width="60">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.volumeWeight" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="pricefun(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.volumeWeight" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<!-- <el-table-column prop="shippingTime" label="入货代仓时间" width="130">
					<template #default="scope">
						<el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.shippingTime"></el-input>
					</template>
				</el-table-column> -->
				<el-table-column prop="includingTaxPurchasePrice" label="集货采购价含税(RMB)" width="130">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.includingTaxPurchasePrice"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="cusPurchasePrice" label="报关采购价含税(RMB)" width="130">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.cusPurchasePrice"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="domesticLogisticsCost" label="国内物流费用(RMB/个)" width="140">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.domesticLogisticsCost"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="exportUnitPrice" label="出口单价(USD)" width="100">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile" v-model="scope.row.exportUnitPrice" @input="pricefun(scope.row)" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile" v-model="scope.row.exportUnitPrice" @input="pricefun(scope.row)" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="totalExportPrice" label="出口总价(USD)" width="100">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.totalExportPrice" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.totalExportPrice" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="commodityInspectionFee" label="商检费(RMB)个" width="100">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.commodityInspectionFee"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="customsDeclarationFee" label="报关费个" width="80">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.customsDeclarationFee" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" @focus="focuefun(scope)" v-model="scope.row.customsDeclarationFee" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="singleCusInternationalLogisticsFee" label="报关物流费用(RMB/个)" width="140">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.singleCusInternationalLogisticsFee" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.singleCusInternationalLogisticsFee" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="singleInternationalLogisticsFee" :label="'国际物流费用' + '(' + collectionLogisticsFee + '/个)'" width="140">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.singleInternationalLogisticsFee" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>
						<!-- <el-input v-if="scope.row.rowCompile || allCompiles" v-model="scope.row.singleInternationalLogisticsFee" @click="visibleediit = false"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="totalInternationalLogisticsFee" :label="'国际物流费用总额' + '(' + collectionLogisticsFee + ')'" width="150">
					<template #default="scope">
						<el-popover placement="top" v-if="scope.row.rowCompile || allCompiles" width="200" :disabled="visibleediit" trigger="click">
							<p>此处由计算得出结果不建议直接修改！</p>
							<div style="text-align: right; margin: 0">
								<el-button size="small" type="text" @click="visibleediit = true">确定</el-button>
							</div>
							<template #reference>
								<el-input type="number" v-if="scope.row.rowCompile" @input="pricefun(scope.row)" v-model="scope.row.totalInternationalLogisticsFee" @click="visibleediit = false"></el-input>
							</template>
						</el-popover>

						<!-- <el-input v-if="scope.row.rowCompile" @input="pricefun(scope.row)" v-model="scope.row.totalInternationalLogisticsFee"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column prop="incidentalPrice" label="杂费" width="60">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile" @focus="focuefun(scope)" v-model="scope.row.incidentalPrice"></el-input>
					</template>
				</el-table-column>

				<el-table-column prop="fobSupplyPrice" :label="'FOB供货价' + '(' + fobCurrency + ')'" width="110">
					<template #default="scope">
						<el-input type="number" @input="pricefun(scope.row)" v-if="scope.row.rowCompile" v-model="scope.row.fobSupplyPrice" @click="visibleediit = false"></el-input>
					</template>
				</el-table-column>
			</el-table>
			<el-row>
				<el-form-item>
					<el-button type="primary" size="small" icon="ele-Plus" @click="copy()" style="margin-right: 20px"> 复制 </el-button>
				</el-form-item>
				<el-form-item v-show="compile && !state.hasCusNo">
					<el-button-group>
						<el-button type="primary" size="small" @click="bulkEditing()" :disabled="batch"> {{ allCompiles ? '保存' : '批量编辑' }} </el-button>
						<el-button size="small" @click="newrow()"> 新增一行 </el-button>
						<el-button type="primary" size="small" @click="cut()"> 剪切 </el-button>
						<el-button size="small" @click="affix()"> 粘贴 </el-button>
						<el-button type="primary" size="small" @click="repricefun(1)"> 重新计价 </el-button>
						<!--<el-button size="small" @click="deletion()"> 批量删除 </el-button>-->
					</el-button-group>
				</el-form-item>
			</el-row>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</el-card>
		<importDialog
			ref="importDialogRef"
			:ifExcelBol="true"
			:errorData="errorData"
			:excelName="excelName"
			:exportUrl="'/api/collectionOrderInfo/exportError/'"
			:tableAddress="tableAddress"
			:area="area"
			:url="url"
			@reloadTable="getAppPage"
		/>
		<deblockingDialog ref="deblockingDialogRef" :title="deblockingDialogTitle" @reloadTable="getAppPage" />
		<!-- <EditMenu ref="editMenuRef" :title="state.editMenuTitle" :menuData="state.menuData" @handleQuery="handleQuery" /> -->
	</div>
</template>

<script lang="ts" setup name="compile">
import { onMounted, reactive, ref, toRefs, computed, watch, watchEffect, onBeforeUnmount, onActivated, onDeactivated, onUpdated, onBeforeUpdate } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { useRoute } from 'vue-router';
import { getAPI } from '/@/utils/axios-utils';
import { SysMenuApi } from '/@/api-services/api';
import { SysMenu } from '/@/api-services/models';
import service from '/@/utils/request';
import { Session } from '/@/utils/storage';
import type { UploadInstance } from 'element-plus';
import router from '/@/router';
import importDialog from '/@/components/newImportDialog/index.vue';
import { getCollectionGoodsInfoCache } from '/@/api/modular/main/collections.ts';
import { platformStoreGetList } from '/@/api/modular/main/platformStoreInfo.ts';
import { SysDictDataApi } from '/@/api-services/api';
import deblockingDialog from '/@/views/business/collection/collections/component/deblockingDialog.vue';

const state = reactive({
	loading: true,
	menuData: [] as Array<SysMenu>,
	queryParams: {
		title: undefined,
		type: undefined,
	},
	editMenuTitle: '',
	hasCusNo: undefined,
});
let tableParams = ref<any>({
	page: 1,
	pageSize: 200,
	total: '',
});
let id = ref<any>();
const queryForm = ref();
const deblockingDialogRef = ref();
const deblockingDialogTitle = ref('');

let collectionOrderInfo = reactive<any>({});
let collectionGoodsInfolist = reactive<any>([]);
const platformStoreOptions = ref<any>([]);
let compile = ref<boolean>(false);
let loading1 = ref<boolean>(false);
let rowCompile = ref<boolean>(false);
let widths = ref<any>(120);
const notResetPrice = ref(false);
const myButton = ref(null);
let visible = ref(false);
let allCompiles = ref(false);
let restaurants = ref<any>();
let states = ref<any>('');
let timeout = ref<any>(null);
let countRow = ref<any>([]);
let selectedRows = ref<any>([]);
let warnTagList = ref<any>([]);
let selectedWarnTag = ref<any>([]);
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

const importDialogRef = ref();
const excelName = ref('商品报关规格数据');
const url = ref('');
const tableAddress = ref('');
const area = ref('CN');
const loading3 = ref(false);
const errorData = ref<any>([
	{
		prop: 'documentNo',
		label: 'PRO号',
	},
	{
		prop: 'boxLength',
		label: '箱长（CM）',
	},
	{
		prop: 'boxWidth',
		label: '箱宽（CM）',
	},
]);
let visibleediit = ref(false);
const uploadRef = ref<UploadInstance>();
let shippingMethodOptions = ref(['海运', '空运', '快递', '小包','海运(KG计费)']);
let stateOptions = ref(['集货', '截仓', '在途中','部分入仓', '已入仓']);
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

// 重新计价判断是否为空对象
const resetPriceObj = ref<any>({
	internalUniqueID: '内部唯一识别码',
	internalProductName: '内部品名',
	boxNo: 'ECVV箱单号',
	purchaseContractNo: '采购合同号',
	supplier: '供应商',
	customsName: '报关品名',
	material: '材质',
	use: '用途',
	plannedShipmentQuantity: '报关数量',
	cusUnit: '报关单位',
	actualShipmentQuantity: '集货数量',
	unit: '集货单位',
	quantityInBoxes: '装箱个数',
	packBoxesQuantity: '装箱数',
	singleProductNetWeightKG: '单个产品净重KG',
	singleProductLength: '产品长(cm)',
	singleProductWidth: '产品宽(cm)',
	singleProductHeight: '产品高(cm)',
	fclGrossWeightKG: '整箱毛重KG',
	boxLength: '箱长(cm)',
	boxWidth: '箱宽(cm)',
	boxHeight: '箱高(cm)',
	includingTaxPurchasePrice: '采购价含税(RMB)',
});

const openimportDialog = () => {
	loading3.value = true;
	url.value = (import.meta.env.VITE_API_URL as any) + `/api/collectionOrderInfo/importProductSpecifications/` + id.value;
	tableAddress.value = (import.meta.env.VITE_API_URL as any) + '/upload/TableAddress/商品报关规格数据-模版.xls';
	importDialogRef.value.openDialog();
	loading3.value = false;
};

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
		restaurant?.map((item: any) => {
			let list: any = [];
			let tagList = item.warnTag?.split(',');
			tagList?.map((it: any) => {
				warnTagList.value?.map((i: any) => {
					if (i.value === it) {
						let obj = {
							color: i.code,
							value: it,
						};
						list.push(obj);
					}
				});
			});
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
	console.log(val.row.warnTag);
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
const successfun = (data: any, res: any) => {
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
};
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
					if (element.warnTag != null && element.warnTag != '') {
						let tag = element.warnTag?.split(',');
						let list: any = [];
						if (tag?.length && warnTagList.value?.length) {
							tag?.map((item: any) => {
								list.push(item);
							});
						}
						element.warnTagList = list;
					}
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
				state.hasCusNo = data.data.result.hasCusNo;
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

onActivated(async () => {
	var refreshID = Session.get('refresh');
	if (refreshID == collectionOrderInfo.documentNo) {
		if (Session.get('isRefresh')) {
			getAppPage();
			Session.set('refresh', null);
			Session.set('isRefresh', null);
		}
	}
});

onMounted(async () => {
	const route = useRoute();
	if (route.query.id) {
		id.value = route.query.id;
	} else {
		compile.value = true;
	}
	const results = await platformStoreGetList();
	results.data.result.map((res: any) => {
		platformStoreOptions.value.push(res);
	});

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
		cusPurchasePrice: '',
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
			const row = (document.querySelector('.el-table__row') as HTMLElement)?.offsetHeight;
			setTimeout(() => {
				myTable.value.setScrollTop(row * collectionGoodsInfolist.length);
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
// 打开编辑状态，并且判断后台是否被占用
const OrderLockSwitch = () => {
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
					if (state.hasCusNo) {
						ElMessage({
							type: 'warning',
							message: '已生成报关单，仅支持修改集货状态和时间',
						});
					} else {
					}
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
};
//组件销毁
onBeforeUnmount(() => {
	compile.value = !compile.value;
	clearInterval(timer.value);
}),
	function aa() {};
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
	row.cusPurchasePrice = 0;
	row.exportUnitPrice = 0;
}
// 重新计价功能按钮新增必填字段验证及提示
const resetPriceFun = (row: any, index: number) => {
	let text = `第${index + 1}行，`;
	let list = [];
	let num = 0;
	notResetPrice.value = true;
	if (row?.internalProductName !== null) {
		text += `${row?.internalProductName}，`;
	}
	for (let key in resetPriceObj.value) {
		if (row[key] === null) {
			list.push(`${resetPriceObj.value[key]}不能为空`);
			num++;
		}
	}
	if (row?.totalNetWeightKG > row?.totalGrossWeightKG) {
		num++;
		list.push('总净重大于总毛重');
	}
	if (num > 0) {
		ElMessage.error(text + list.join('、') + '。');
	}
};
//计算价格
let pricefun = (row: any, index = 0) => {
	//装箱数=实际出货数量/装箱个数
	if (row.actualShipmentQuantity && row.quantityInBoxes) {
		row.packBoxesQuantity = Math.ceil(Number(row.actualShipmentQuantity / row.quantityInBoxes));
	}
	//总毛重量=整箱毛重*装箱数
	if (row.fclGrossWeightKG && row.packBoxesQuantity) {
		row.totalGrossWeightKG = roundToThreeDecimalPlaces(Number((row.fclGrossWeightKG * row.packBoxesQuantity).toFixed(2)));
	}
	//总净重KG=单个净重*实际出货数量
	if (row.singleProductNetWeightKG && row.actualShipmentQuantity) roundToThreeDecimalPlaces(Number((row.totalNetWeightKG = row.singleProductNetWeightKG * row.actualShipmentQuantity)).toFixed(3));
	//总净重KG与总毛重比较
	if (row.totalNetWeightKG > row.totalGrossWeightKG && !notResetPrice.value) {
		ElMessage.error('第' + (index + 1) + '行，' + row.internalProductName + '，总净重大于总毛重。');
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
	//FOB供应价=(IncludingTaxPurchasePrice含税(RMB)*1.1+(国内物流费用RMB/个)+商检费+杂费+报关费)/汇率
	if (row.includingTaxPurchasePrice && collectionOrderInfo.exchangeRate) {
		row.fobSupplyPrice = roundToThreeDecimalPlaces(
			(row.includingTaxPurchasePrice * 1.1 + Number(row.domesticLogisticsCost) + Number(row.commodityInspectionFee) + Number(row.incidentalPrice) + Number(row.customsDeclarationFee)) /
				collectionOrderInfo.exchangeRate
		);
	}
	//报关采购单价(RMB)=（集货采购单价*集货数量/报关数量）+（国内物流费用RMB/个*集货数量/报关数量）
	if (row.plannedShipmentQuantity) {
		//集货数量和报关数量一样时，集货采购单价就是（报关采购单价+国内物流费用(RMB/个)）
		row.cusPurchasePrice = Number(row.includingTaxPurchasePrice) + Number(row.domesticLogisticsCost);
		if (row.actualShipmentQuantity != row.plannedShipmentQuantity) {
			row.cusPurchasePrice =
				(row.actualShipmentQuantity * row.includingTaxPurchasePrice) / row.plannedShipmentQuantity + (Number(row.domesticLogisticsCost) * row.actualShipmentQuantity) / row.plannedShipmentQuantity;
		}
	}
	//空运
	//总毛重和体积重 谁大用谁
	//国际物流费用总额= 物流报价*(总毛重KG||体积重KG)
	//海运
	//国际物流费用总额= 物流报价*(总方数)
	row.totalInternationalLogisticsFee =
		((collectionOrderInfo.shippingMethod == '空运')||collectionOrderInfo.shippingMethod == '海运(KG计费)')
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

	//中东	//【迪拜支付】出口单价(USD)=（报关采购价含税(RMB)*1.1）/美元汇率
	//中东	//【国内支付】出口单价(USD)=（报关采购价含税(RMB)*1.1+报关费/个(RMB)+国际物流运费/报关数量）/美元汇率
	//美国//【国内支付】：出口单价(USD)=（报关采购价含税(RMB)+报关费/个(RMB)+国际物流运费/报关数量）/美元汇率
	if (collectionOrderInfo.internationalLogisticsFeePayer == '迪拜支付') {
		row['exportUnitPrice'] = Number(((row['cusPurchasePrice'] * 1.1) / collectionOrderInfo.exchangeRateUSD).toFixed(2));
	}
	if (collectionOrderInfo.internationalLogisticsFeePayer == '国内支付') {
		row['exportUnitPrice'] = Number(((row['cusPurchasePrice'] * 1.1+Number(row.customsDeclarationFee)+ row.singleInternationalLogisticsFee) / collectionOrderInfo.exchangeRateUSD).toFixed(2));
	}

	if (collectionOrderInfo.destination == "美国"&&collectionOrderInfo.internationalLogisticsFeePayer == '国内支付') {
		//【国内支付】：出口单价(USD)=（报关采购价含税(RMB)+报关费/个(RMB)+国际物流运费/报关数量）/美元汇率
		row['exportUnitPrice']=Number(((row['cusPurchasePrice']  +Number(row.customsDeclarationFee)+ Number(row['singleInternationalLogisticsFee'])) / collectionOrderInfo.exchangeRateUSD).toFixed(2));
	} 
	//出口总价(USD)=出口单价*报关数量
	row.totalExportPrice = row.exportUnitPrice * row.plannedShipmentQuantity;
	notResetPrice.value = false;
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
const affix = () => {
	let obj = Session.get('selectedGoods');
	const row = (document.querySelector('.el-table__row') as HTMLElement)?.offsetHeight;
	if (!obj) {
		ElMessage({
			type: 'info',
			message: '请选择数据',
		});
		return;
	}
	let iscut = Session.get('iscut');
	Session.set('isRefresh', true);
	if (obj.length > 0) {
		//粘贴前修改集货单号
		obj.forEach((element: any) => {
			element.documentNo = collectionOrderInfo.documentNo;
		});
		service({
			url: '/api/collectionGoodsInfo/addList',
			method: 'post',
			data: obj,
		}).then((data) => {
			if (data.data.type == 'success') {
				tableParams.value.page = Math.ceil(tableParams.value.total / tableParams.value.pageSize);
				ElMessage({
					type: 'success',
					message: '粘贴成功',
				});
				if (iscut) {
					//如果是剪切，删除原集货单商品
					service({
						url: '/api/collectionOrderInfo/batchDelete',
						method: 'post',
						data: iscut,
					}).then((data) => {
						if (data.data.type == 'success') {
							ElMessage({
								type: 'success',
								message: '原集货单剪切商品已删除',
							});
							getAppPage().then(() => {
								if (row) {
									myTable.value.setScrollTop(row * (collectionGoodsInfolist.length + 1));
								}
							});
						}
					});
				} else {
					getAppPage().then(() => {
						if (row) {
							myTable.value.setScrollTop(row * (collectionGoodsInfolist.length + 1));
						}
					});
				}
				Session.set('selectedGoods', null);
				Session.set('iscut', null);
				ElMessage({
					type: 'success',
					message: '剪切板内容已清空',
				});
			} else {
				ElMessage({
					type: 'error',
					message: '粘贴失败',
				});
				return;
			}
		});
	}
};

//下载文件
function downloadfile(res: any) {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
	var result = patt.exec(contentDisposition);
	var filename = result?.[1];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURI(filename?.replace(reg, '$1') || ''); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
}
//判断标签是否存在于集合中
function IsTag(tag: any) {
	const element = warnTagList.value.find((item: any) => item.value === tag);
	if (element) {
		return element.code;
	}
	return '#DE2910';
}
//根据内部唯一识别码填充数据
function handleSelect(val: any) {
	getCollectionGoodsInfoCache({ internalUniqueID: val.row.internalUniqueID }).then((data: any) => {
		if (data.data.type == 'success') {
			for (let i in val.row) {
				if (i == 'rowCompile' || i == 'documentNo' || i == 'id' || i == 'boxNo' || i == 'ShippingTime') {
				} else if (i == 'warnTagList') {
					if (data.data.result.warnTag != null && data.data.result.warnTag != '') {
						let list: any = [];
						let tag = data.data.result.warnTag?.split(',');
						tag?.map((item: any) => {
							list.push(item);
						});
						val.row[i] = list;
					}
				} else {
					val.row[i] = data.data.result[i];
				}
			}
			const chace = Editchace.value.find((obj: any) => obj.id === val.row.id);
			if (chace) {
				Editchace.value[Editchace.value.findIndex((obj: any) => obj.id === val.row.id)] = JSON.parse(JSON.stringify(val.row));
			} else {
				Editchace.value.push(JSON.parse(JSON.stringify(val.row)));
			}
		}
	});
}
//解锁集货单
const deblockingBox = () => {
	deblockingDialogTitle.value = `解锁集货单（${collectionOrderInfo.documentNo}）`;
	deblockingDialogRef.value.openDialog(collectionOrderInfo);
};
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
const commit = () => {
	collectionOrderInfo.fileList = fileLists.value;
	queryForm.value.validate(async (valid: boolean) => {
		if (!valid) return;
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
	});
};
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
const repricefun = (type = 0) => {
	if (collectionGoodsInfolist == null || collectionGoodsInfolist.length == 0) {
		return;
	}
	collectionGoodsInfolist.forEach((element: any, index: number) => {
		if (type === 1) {
			resetPriceFun(element, index);
		}
		pricefun(element, index);
	});
	service({
		url: '/api/collectionGoodsInfo/updatelist',
		method: 'post',
		data: collectionGoodsInfolist,
	}).then((data) => {
		if (data.data.type == 'success') {
			ElMessage({ type: 'success', message: '计算完成' });
		}
	});
};
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
//验货完成日期改变获得预计到仓日期
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
	transform: translate(0%);
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
:deep(.el-select .el-input),
:deep(.el-select),
:deep(.el-form--inline .el-input) {
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
