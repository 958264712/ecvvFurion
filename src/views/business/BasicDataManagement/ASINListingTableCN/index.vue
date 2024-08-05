<template>
	<div class="aSINBasicDatel-container">
		<el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
			<el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="ASIN">
					<el-popover :visible="visibleTextarea2" placement="bottom" :width="250">
						<el-scrollbar height="150px" style="border: 1px solid var(--el-border-color)">
							<el-input
								v-model="queryParams.asinTextArea"
								style="width: 215px"
								:autosize="{ minRows: 1, maxRows: 200 }"
								type="textarea"
								:placeholder="area == 'CN' ? '可输入多个ASIN精确查询，每行一个，最多支持200个' : 'Multiple ASINs can be entered forprecise queries,one per line, with amaximum support of 200'"
							/>
						</el-scrollbar>
						<div style="text-align: right; margin-top: 20px">
							<span style="float: left">{{ queryParams.aSINList?.length ?? 0 }}/200</span>
							<el-button
								type="info"
								@click="
									() => {
										queryParams.asinTextArea = '';
										aSIN = '';
									}
								"
								>{{ area == 'CN' ? '重置' : 'Reset' }}</el-button
							>
							<el-button type="primary" @click="handleConfirm()">{{ area == 'CN' ? '确定' : 'Confirm' }}</el-button>
						</div>
						<template #reference>
							<el-input v-model="aSIN" clearable="" :placeholder="area == 'CN' ? '请输入,点击展开可输多个' : 'Please input, click to expand to input multiple'" @clear="clearAsin">
								<template #suffix>
									<el-icon class="el-input__icon">
										<ArrowDownBold @click="visibleTextarea2 = !visibleTextarea2" v-if="!visibleTextarea2" />
										<ArrowUpBold @click="visibleTextarea2 = !visibleTextarea2" v-else />
									</el-icon>
								</template>
							</el-input>
						</template>
					</el-popover>
					<!-- <el-input v-model="queryParams.aSIN" clearable=""
						:placeholder="area == 'CN' ? '请输入ASIN' : 'Please enter ASIN'" /> -->
				</el-form-item>
				<el-form-item :label="area == 'CN' ? '店铺SKU' : 'StoreSKU'">
					<el-input v-model="queryParams.storeSKU" clearable="" :placeholder="area == 'CN' ? '请输入店铺SKU' : 'Please enter StoreSKU'" />
				</el-form-item>
				<el-form-item :label="area == 'CN' ? 'ERP-SKU' : 'ERP-SKU'">
					<el-input v-model="queryParams.erpSku" clearable="" :placeholder="area == 'CN' ? '请输入ERP-SKU' : 'Please enter ERPSKU'" />
				</el-form-item>
				<el-form-item :label="area == 'CN' ? '中文NAME' : 'GoodsName'">
					<el-input v-model="queryParams.goodsName" clearable="" :placeholder="area == 'CN' ? '请输入中文NAME' : 'Please enter GoodsName'" />
				</el-form-item>
				<el-form-item :label="area == 'CN' ? '是否下架' : 'List/Unlist'">
					<el-select v-model="queryParams.list_Unlist" :placeholder="area == 'CN' ? '请选择' : 'Please select'" clearable>
						<el-option label="List" value="List"></el-option>
						<el-option label="Unlist" value="Unlist"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="area == 'CN' ? '上架平台' : 'Platform'">
					<el-select v-model="queryParams.addASINAccount" :placeholder="area == 'CN' ? '请选择' : 'Please select'" clearable>
						<el-option label="UAE-SC" value="UAE-SC"></el-option>
						<el-option label="UAE-SHOWAY" value="UAE-SHOWAY"></el-option>
						<el-option label="SA-DDP AE" value="SA-DDP AE"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="area == 'CN' ? '负责人' : 'Creator'">
					<el-input v-model="queryParams.Creator" clearable="" :placeholder="area == 'CN' ? '请输入负责人' : 'Please enter Creator'" />
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="ele-Search" @click="handleQuery">{{ area == 'CN' ? '查询' : 'Search' }} </el-button>
						<el-button
							icon="ele-Refresh"
							@click="
								() => {
									aSIN = '';
									queryParams.asinTextArea = '';
									queryParams = {};
									handleQuery();
								}
							"
						>
							{{ area == 'CN' ? '重置' : 'Reset' }}
						</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="full-table" shadow="hover" style="margin-top: 8px">
			<div class="settingf">
				<el-button type="primary" icon="ele-Plus" @click="openAddASINBasicData">{{ area == 'CN' ? '新增' : 'Add' }} </el-button>
				<!-- <el-upload style="margin-left: 20px; display: inline" :on-change="Imports" :multiple="false" action="#"
					:show-file-list="false" :auto-upload="false" name="file"> -->
				<el-button :loading="loading3" type="primary" @click="openimportDialog">Import ASIN Listing Table</el-button>
				<!-- </el-upload> -->
				<!-- <el-upload style="margin-left: 20px; display: inline;" :on-change="ImportsUAE" :multiple="false" action="#"
					:show-file-list="false" :auto-upload="false" name="file">
					<el-button :loading="loading3" type="primary">Import ASIN Listing Table UAE</el-button>
				</el-upload> -->
				<div style="margin-left: 20px; display: inline" class="flex flex-wrap items-center">
					<el-dropdown>
						<el-button type="primary" :loading="Exportloading">
							{{ area == 'CN' ? '导出' : 'Export' }}
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="AllExport">{{ area == 'CN' ? '导出所有' : 'Export All' }}</el-dropdown-item>
								<el-dropdown-item :disabled="disabledSelected" @click="SelectedExport">{{ area == 'CN' ? '导出选中' : 'Export Selected' }}</el-dropdown-item>
								<!-- <el-dropdown-item  @click="Exportemptycreator">{{ area == 'CN' ? '导出空创建人' : 'Export empty creator' }}</el-dropdown-item> 暂时不使用-->
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>

				<!-- <div class="setting">
					<el-button v-if="IsEdit" type="primary" icon="ele-Document" :loading="loading"
						@click="update">保存</el-button>
				</div> -->
			</div>
			<div style="margin-top: 5px; display: flex; justify-content: space-between">
				<el-button-group>
					<el-button
						style="width: 80px; height: 27px"
						:class="{ buttonBackground: area == 'CN' }"
						v-if="IsAdmin || area == 'CN'"
						@click="
							area = 'CN';
							switchLanguage();
						"
						>CN</el-button
					>
					<el-button
						style="width: 80px; height: 27px"
						:class="{ buttonBackground: area == 'LOCAL' }"
						v-if="IsAdmin || area == 'LOCAL'"
						@click="
							area = 'LOCAL';
							switchLanguage();
						"
						>LOCAL</el-button
					>
					<!-- <el-button style="width: 80px;height: 27px;" :class="{ 'buttonBackground': area == 'UAE' }"
						v-if="IsAdmin || area == 'UAE'" @click="area = 'UAE'; switchLanguage()">UAE Sourcing</el-button>
					<el-button style="width: 80px;height: 27px;" :class="{ 'buttonBackground': area == 'SA' }"
						v-if="IsAdmin || area == 'SA'" @click="area = 'SA'; switchLanguage()">SA Sourcing</el-button> -->
				</el-button-group>
				<tabDragColum :data="TableData" :name="`TableData`" :area="area" @handleData="handleData" @handleRemarkData="handleRemarkData"/>
			</div>
			<el-table ref="scrollContainer" :data="tableData" size="lagre" style="width: 100%" v-loading="loading" tooltip-effect="light" @selection-change="handleSelectionChange" row-key="id" border="">
				<el-table-column width="140" align="center" fixed="left" show-overflow-tooltip="">
					<template #header>
						<el-button style="background-color: transparent; border: none; color: #df1515">操作</el-button>
					</template>
					<template #default="scope">
						<el-tooltip class="box-item" effect="dark" content="复制" placement="bottom">
							<el-button icon="ele-CopyDocument" size="small" text="" type="primary" @click="CopyAdd(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip class="box-item" effect="dark" content="新增" placement="bottom">
							<el-button icon="ele-CirclePlus" size="small" text="" type="primary" @click="AddRow()"></el-button>
						</el-tooltip>

						<el-tooltip class="box-item" effect="dark" content="保存" placement="bottom">
							<el-button v-if="scope.row.IsEdit" icon="ele-Document" size="small" text="" type="primary" @click="update()"></el-button>
						</el-tooltip>

						<el-tooltip class="box-item" effect="dark" content="编辑" placement="bottom">
							<el-button v-if="!scope.row.IsEdit" icon="ele-Edit" size="small" text="" type="primary" @click="openEdit(scope.row)"></el-button>
						</el-tooltip>

						<el-tooltip class="box-item" effect="dark" content="删除" placement="bottom">
							<el-button icon="ele-Delete" size="small" text="" type="primary" @click="delASINBasicData(scope.row)"> </el-button>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column type="selection" width="40" />
				<template v-for="(item, index) in TableData" :key="index">
					<el-table-column
						v-if="item.dataIndex == 'asin' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="150"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input :class="{ 'sku-input': scope.row.IsASIN }" v-if="scope.row.IsEdit" type="text" v-model="scope.row.asin" clearable="" @keyup.enter.native="keyDown" @blur="validateASIN" />
								<div v-else>{{ scope.row.asin }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'storeSKU' && item.checked"
						:fixed="item.fixed"
						width="160"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input :class="{ 'sku-input': scope.row.IsstoreSKU }" v-if="scope.row.IsEdit" type="text" v-model="scope.row.storeSKU" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.storeSKU }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'erpSku' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="160"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input :class="{ 'sku-input': scope.row.IserpSku }" v-if="scope.row.IsEdit" type="text" v-model="scope.row.erpSku" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.erpSku }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'goodsName' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="150"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<div>{{ scope.row.goodsName }}</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'singleOrderQTY' && item.checked"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						:fixed="item.fixed"
						width="135"
						v-show="item.checked"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input :class="{ 'sku-input': scope.row.IsSingleOrderQTY }" v-if="scope.row.IsEdit" type="text" v-model="scope.row.singleOrderQTY" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.singleOrderQTY }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'specsUnit' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="100"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.specsUnit" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.specsUnit }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'brand' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="100"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.brand" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.brand }}</div>
							</div>
						</template>
					</el-table-column>

					<el-table-column
						v-else-if="item.dataIndex == 'ean' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="150"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input :class="{ 'sku-input': scope.row.IsEAN }" v-if="scope.row.IsEdit" type="text" v-model="scope.row.ean" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.ean }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'addASINAccount' && item.checked"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						:fixed="item.fixed"
						v-show="item.checked"
						width="120"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-select :disabled="!scope.row.IsEdit" v-model="scope.row.addASINAccount" @blur="validateASINAccount" :placeholder="area == 'CN' ? '请选择' : 'Please select'" clearable>
									<el-option label="UAE-SC" value="UAE-SC"></el-option>
									<el-option label="UAE-SHOWAY" value="UAE-SHOWAY"></el-option>
									<el-option label="SA-DDP AE" value="SA-DDP AE"></el-option>
								</el-select>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'list_Unlist' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="100"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-select :disabled="!scope.row.IsEdit" v-model="scope.row.list_Unlist" :placeholder="area == 'CN' ? '请选择' : 'Please select'" clearable>
									<el-option label="List" value="List"></el-option>
									<el-option label="Unlist" value="Unlist"></el-option>
								</el-select>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'remove_Reason' && item.checked"
						:prop="item.dataIndex"
						:fixed="item.fixed"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						v-show="item.checked"
						width="200"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.remove_Reason" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.remove_Reason }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'createTime' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						width="120"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-date-picker v-if="scope.row.IsEdit" v-model="scope.row.createTime" type="date" placeholder="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.createTime }}</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'creator' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope" @dblclick="openEdit(scope.row)">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.creator" clearable="" @keyup.enter.native="keyDown" />
							<!-- <div>
								注释为无需修改  <div>{{ scope.row.creator }}</div>
							</div> -->
						</template>
					</el-table-column>
					<el-table-column
						v-else-if="item.dataIndex == 'remark' && item.checked"
						:fixed="item.fixed"
						:prop="item.dataIndex"
						:label="area == 'CN' ? item.titleCN : item.titleEN"
						align="center"
						show-overflow-tooltip=""
					>
						<template #header>
							<el-tooltip effect="dark" placement="bottom" v-if="item.remark">
								<div style="display: flex; align-items: center; justify-content: center">
									{{ area == 'CN' ? item.titleCN : item.titleEN }}
									<QuestionFilled width="14" style="color: #ccc" v-show="item.remark" />
								</div>
								<template #content>
									<div v-html="item.desc"></div>
								</template>
							</el-tooltip>
							<div v-else>{{ area == 'CN' ? item.titleCN : item.titleEN }}</div>
						</template>
						<template #default="scope">
							<!-- @dblclick="openEdit(scope.row)" 暂时不使用 -->
							<div>
								<el-input v-if="scope.row.IsEdit" type="text" v-model="scope.row.remark" clearable="" @keyup.enter.native="keyDown" />
								<div v-else>{{ scope.row.remark }}</div>
							</div>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[50, 100, 500, 1000]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
			<importDialog ref="importDialogRef" :excelName="excelName" :tableAddress="tableAddress" :area="area" :url="url" @reloadTable="handleQuery" />
		</el-card>
	</div>
</template>

<script lang="ts" setup name="ASINListingTableCN">
import { ref, watch } from 'vue';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { auth } from '/@/utils/authFunction';
//import { formatDate } from '/@/utils/formatTime';
import { SAINListingTablePage, Save, ImportCN, ImportUAE, Delete, Update, GetUserRole } from '/@/api/modular/main/SAINListingTable.ts';
import axios from 'axios';
import { ArrowDownBold, ArrowUpBold, QuestionFilled } from '@element-plus/icons-vue';
import router from '/@/router';
import other from '/@/utils/other.ts';
import tabDragColum from '/@/components/tabDragColum/index.vue';
import importDialog from './component/importDialog.vue';
import { clearEmptyDataByAny } from '/@/utils/constHelper';
import regexhelper from '/@/utils/regexHelper';
import { el } from 'element-plus/es/locale';

const { clearCharactersByRegex } = regexhelper();
const Exportloading = ref(false);
const editDialogRef = ref();
const loading = ref(false);
const loading3 = ref(false);
const disabledSelected = ref(true);

const importDialogRef = ref();
const excelName = ref('');
const url = ref('');
const tableAddress = ref('');

const isWatch = ref(true);

const tableData = ref<any>([]);
const selectedRows = ref<any>([]);
const addData = ref<any>([]);
const IsEdit = ref<any>(false);
const IsAdmin = ref<any>(false);
const visibleTextarea2 = ref(false);
const aSIN = ref('');
const queryParams = ref<AsinParamsType>({});
const area = ref<any>('CN');
const tableParams = ref({
	page: 1,
	pageSize: 50,
	total: 0,
	Site: area.value,
});
const TableData = ref<any>([
	{
		titleCN: 'ASIN',
		titleEN: 'ASIN',
		dataIndex: 'asin',
		checked: true,
		fixed: false,
		remark: false,
		desc: '',
	},
	{
		titleCN: '店铺SKU',
		titleEN: 'StoreSKU',
		checked: true,
		fixed: false,
		dataIndex: 'storeSKU',
		remark: false,
		desc: '',
	},
	{
		titleCN: 'ERP-SKU',
		titleEN: 'ERP-SKU',
		checked: true,
		fixed: false,
		dataIndex: 'erpSku',
		remark: false,
		desc: '',
	},
	{
		titleCN: '中文NAME',
		titleEN: 'GoodsName',
		checked: true,
		fixed: false,
		dataIndex: 'goodsName',
		remark: false,
		desc: '',
	},

	{
		titleCN: '发货数量',
		titleEN: 'SingleOrderQTY',
		checked: true,
		fixed: false,
		dataIndex: 'singleOrderQTY',
		remark: false,
		desc: '',
	},
	{
		titleCN: '包装规格',
		titleEN: 'SpecsUnit',
		checked: true,
		fixed: false,
		dataIndex: 'specsUnit',
		remark: false,
		desc: '',
	},
	{
		titleCN: '品牌',
		titleEN: 'Brand',
		checked: true,
		fixed: false,
		dataIndex: 'brand',
		remark: false,
		desc: '',
	},
	{
		titleCN: 'EAN编码',
		titleEN: 'EAN-13',
		checked: true,
		fixed: false,
		dataIndex: 'ean',
		remark: false,
		desc: '',
	},
	{
		titleCN: '是否下架',
		titleEN: 'List/Unlist',
		checked: true,
		fixed: false,
		dataIndex: 'list_Unlist',
		remark: false,
		desc: '',
	},
	{
		titleCN: '下架原因',
		titleEN: 'Complaint/Remove Reason',
		checked: true,
		fixed: false,
		dataIndex: 'remove_Reason',
		remark: false,
		desc: '',
	},
	{
		titleCN: '上架平台',
		titleEN: 'Platform',
		checked: true,
		fixed: false,
		dataIndex: 'addASINAccount',
		remark: false,
		desc: '',
	},
	{
		titleCN: '上传日期',
		titleEN: 'Released Date',
		checked: true,
		fixed: false,
		dataIndex: 'createTime',
		remark: false,
		desc: '',
	},
	{
		titleCN: '负责人',
		titleEN: 'Creator',
		checked: true,
		fixed: false,
		dataIndex: 'creator',
		remark: false,
		desc: '',
	},
	{
		titleCN: '备注',
		titleEN: 'Remark',
		checked: true,
		fixed: false,
		dataIndex: 'remark',
		remark: false,
		desc: '',
	},
	{
		checked: true,
		fixed: false,
		titleCN: '操作',
		titleEN: 'Operation',
		dataIndex: '',
		remark: false,
		desc: '',
	},
]);
const Getarea = () => {
	GetUserRole().then((res) => {
		if (res.data.result != null) {
			IsAdmin.value = false;
			area.value = res.data.result;
			handleQuery();
		} else {
			IsAdmin.value = true;
			handleQuery();
		}
	});
};
const switchLanguage = () => {
	aSIN.value = '';
	queryParams.value = {};
	handleQuery();
};

const handleData = (list: any) => {
	if (list?.length) {
		list.map((item, index) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].checked = item.checked;
				TableData.value[index].fixed = item.fixed;
			}
		});
	}
};
const handleRemarkData = (list: any) => {
	if (list?.length) {
		list.map((item, index) => {
			if (item.dataIndex === TableData.value[index].dataIndex) {
				TableData.value[index].desc = item.desc;
				TableData.value[index].remark = item.remark;
			}
		});
	}
};
const clearAsin = () => {
	aSIN.value = '';
	queryParams.value.asinTextArea = '';
	queryParams.value.aSINList = null;
};
// 查询操作
const handleQuery = async () => {
	loading.value = true;
	tableParams.value.Site = area.value;

	//if (queryParams.value.aSINList?.length > 0) {
	// queryParams.value.asinTextArea = '';
	//queryParams.value.aSIN = '';
	//} else {
	//queryParams.value.aSIN = aSIN.value;
	//queryParams.value.aSINList = null;
	//}

	var res = await SAINListingTablePage(Object.assign(queryParams.value, tableParams.value));
	tableData.value = res.data.result?.items ?? [];
	tableData.value.forEach((element: any) => {
		tableData.value.IsEdit = false;
	});
	IsEdit.value = false;
	tableParams.value.total = res.data.result?.total;
	loading.value = false;
};

// 打开新增页面
const openAddASINBasicData = () => {
	router.push({
		path: '/business/BasicDataManagement/ASINListingTableCN/ASINListingTableCNAdd',
		query: {
			area: area.value,
		},
	});
	// editASINBasicDataTitle.value = '添加ASIN上架表数据';
	// editDialogRef.value.openDialog({});
};

// 改变页面容量
const handleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	handleQuery();
};
const handleConfirm = () => {
	let str_array = [];
	if (queryParams.value.asinTextArea?.length) {
		str_array = clearCharactersByRegex(queryParams.value.asinTextArea + '');
		let arr = clearEmptyDataByAny(str_array);
		aSIN.value = arr + '';
	}
	visibleTextarea2.value = false;
	// handleQuery()
};
// function Imports(file: any) {
// 	loading3.value = true;
// 	const formData = new FormData();
// 	formData.append('file', file.raw);
// 	formData.append('Site', area.value);
// 	if (area.value == 'CN') {

// 		axios
// 			.post((import.meta.env.VITE_API_URL as any) + `/api/aSINListingTable/importCN/` + area.value, formData)
// 			.then((res) => {
// 				if (res.data.code == 200) {
// 					ElMessage.success('Import succeeded');
// 					handleQuery();
// 					loading3.value = false;
// 				} else {
// 					ElMessage.error(res.message); // + res.message
// 					loading3.value = false;
// 				}

// 			});
// 		// ImportCN(formData).then((res: any) => {
// 		// 	if (res.data.code == 200) {
// 		// 		ElMessage.success('Import succeeded');
// 		// 		handleQuery();
// 		// 		loading3.value = false;
// 		// 	} else {
// 		// 		ElMessage.error(res.message); // + res.message
// 		// 		loading3.value = false;
// 		// 	}
// 		// });
// 	} else {
// 		axios
// 			.post((import.meta.env.VITE_API_URL as any) + `/api/aSINListingTable/importUAE/` + area.value, formData)
// 			.then((res) => {
// 				if (res.data.code == 200) {
// 					ElMessage.success('Import succeeded');
// 					handleQuery();
// 					loading3.value = false;
// 				} else {
// 					ElMessage.error(res.message); // + res.message
// 					loading3.value = false;
// 				}

// 			});
// 	}

// }
//选中的数据
function handleSelectionChange(val: any) {
	selectedRows.value.splice(0, selectedRows.value.length);
	val.forEach((element: any) => {
		selectedRows.value.push(element.id);
	});
	if (selectedRows.value.length > 0) {
		disabledSelected.value = false;
	} else {
		disabledSelected.value = true;
	}
}
function AllExport() {
	Exportloading.value = true;
	const formData = {
		type: 1,
		Site: area.value,
	};
	if (queryParams.value.aSINList?.length > 0) {
		// queryParams.value.asinTextArea = '';
		queryParams.value.aSIN = '';
	} else {
		queryParams.value.aSIN = aSIN.value;
		queryParams.value.aSINList = null;
	}
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/aSINListingTable/export`, Object.assign(queryParams.value, tableParams.value, formData), {
			responseType: 'blob', // 将响应解析为二进制数据
		})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
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
			}
			Exportloading.value = false;
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
			Exportloading.value = false;
		});
}
function SelectedExport() {
	Exportloading.value = true;
	const formData = {
		type: 0,
		Id: selectedRows.value,
		Site: area.value,
	};
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/aSINListingTable/export`, formData, {
			responseType: 'blob', // 将响应解析为二进制数据
		})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
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
			}
			Exportloading.value = false;
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
			Exportloading.value = false;
		});
}
function Exportemptycreator() {
	Exportloading.value = true;
	const formData = {
		type: 1,
		Site: area.value,
		IsTheCreatorEmpty: true,
	};
	axios
		.post((import.meta.env.VITE_API_URL as any) + `/api/aSINListingTable/export`, formData, {
			responseType: 'blob', // 将响应解析为二进制数据
		})
		// service({
		// 	url: `/api/inventoryManagement/Export`,
		// 	method: 'post',
		// 	data: formData,
		// 	responseType: 'blob',
		// })
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
			}
			Exportloading.value = false;
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
			Exportloading.value = false;
		});
}
const downloadfile = (res: any) => {
	var blob = new Blob([res.data], {
		type: 'application/octet-stream;charset=UTF-8',
	});
	var contentDisposition = res.headers['content-disposition'];
	var patt = new RegExp("filename\\*=(UTF-8['']*[''])([^';]+)(?:.*)");
	//decodeURIComponent()
	var result = patt.exec(contentDisposition);
	var filename = result[2];
	var downloadElement = document.createElement('a');
	var href = window.URL.createObjectURL(blob); // 创建下载的链接
	var reg = /^["](.*)["]$/g;
	downloadElement.style.display = 'none';
	downloadElement.href = href;
	downloadElement.download = decodeURIComponent(filename.replace(reg, '$1')); // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	window.URL.revokeObjectURL(href);
};

const scrollContainer = ref();
function CopyAdd(row: any) {
	if (IsEdit.value) return;
	tableData.value.unshift({
		id: 0,
		asin: '',
		storeSKU: '',
		goodsName: row.goodsName,
		erpSku: row.erpSku,
		singleOrderQTY: '',
		specsUnit: row.specsUnit,
		brand: '',
		ean: '',
		addASINAccount: '',
		list_Unlist: row.list_Unlist,
		remove_Reason: '',
		createTime: '',
		creator: row.creator,
		IsEdit: true,
	});
	IsEdit.value = true;
	setTimeout(() => {
		let table = scrollContainer.value.layout.table.refs;
		// 获取表格滚动元素
		let tableScrollEle = table.bodyWrapper.firstElementChild.firstElementChild;
		// 设置表格滚动的位置
		tableScrollEle.scrollTop = 0;
	}, 100);
}
function AddRow() {
	if (IsEdit.value) return;
	tableData.value.unshift({
		id: 0,
		asin: '',
		storeSKU: '',
		goodsName: '',
		erpSku: '',
		singleOrderQTY: '',
		specsUnit: '',
		brand: '',
		ean: '',
		addASINAccount: '',
		list_Unlist: '',
		remove_Reason: '',
		createTime: '',
		creator: '',
		IsEdit: true,
	});
	IsEdit.value = true;
	setTimeout(() => {
		let table = scrollContainer.value.layout.table.refs;
		// 获取表格滚动元素
		let tableScrollEle = table.bodyWrapper.firstElementChild.firstElementChild;
		// 设置表格滚动的位置
		tableScrollEle.scrollTop = 0;
	}, 100);
}
//打开编辑
const openEdit = (row: any) => {
	if (!IsEdit.value) {
		row.IsEdit = true;
		IsEdit.value = true;
	}
};

// 删除
const delASINBasicData = (row: any) => {
	ElMessageBox.confirm(area.value == 'CN' ? `确定要删除吗?` : 'Are you sure you want to delete it?', area.value == 'CN' ? '提示' : 'prompt', {
		confirmButtonText: area.value == 'CN' ? '确定' : 'YES',
		cancelButtonText: area.value == 'CN' ? '取消' : 'Cancel',
		type: 'warning',
	})
		.then(async () => {
			if (row.id === 0) {
				const selectedIndex = tableData.value.findIndex((item) => item.id === row.id);
				tableData.value.splice(selectedIndex, 1);
				IsEdit.value = false;
			} else {
				await Delete(row);
				handleQuery();
			}
			ElMessage.success(area.value == 'CN' ? '删除成功' : 'Delete successful');
		})
		.catch(() => {});
};

const keyDown = (e: any) => {
	if (e.keyCode == 13 || e.keyCode == 100) {
		update();
	}
};
function update() {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	objectWithIsEditTrue.Site = area.value;
	objectWithIsEditTrue.singleOrderQTY = objectWithIsEditTrue.singleOrderQTY.trim();
	if (validateASIN() && validateStoreSKU() && validateSingleOrderQTY() && validateErpSku() && validateASINAccount()) {
		if (objectWithIsEditTrue.id === 0) {
			addData.value = [];
			addData.value.push(objectWithIsEditTrue);
			Save(addData.value).then((res) => {
				if (res.data.result < 0) {
					ElMessage.success(area.value == 'CN' ? '添加成功' : 'Added successfully');
					tableData.value.find((obj: any) => obj.IsEdit === true).IsEdit = false;
					IsEdit.value = false;
					handleQuery();
				} else {
					tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = true;
					tableData.value.find((obj: any) => obj.IsEdit === true).IsstoreSKU = true;
					tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = true;
					tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = true;
					ElMessage.error(area.value == 'CN' ? '该数据已存在' : 'Change data already exists');
				}
			});
		} else {
			Update(objectWithIsEditTrue).then((res) => {
				ElMessage.success(area.value == 'CN' ? '修改成功' : 'Update successfully');
				tableData.value.find((obj: any) => obj.IsEdit === true).IsEdit = false;
				IsEdit.value = false;
			});
		}
	}
}

const openimportDialog = () => {
	loading3.value = true;
	url.value = (import.meta.env.VITE_API_URL as any) + `/api/aSINListingTable/import/` + area.value;
	excelName.value = area.value === 'CN' ? '产品上架记录表-CN' : '产品上架记录表-LOCAL';
	tableAddress.value =
		area.value === 'CN'
			? (import.meta.env.VITE_API_URL as any) + '/upload/TableAddress/产品上架记录表-CN.xlsx'
			: (import.meta.env.VITE_API_URL as any) + '/upload/TableAddress/产品上架记录表-LOCAL.xlsx';
	importDialogRef.value.openDialog();
	loading3.value = false;
};

const validateASIN = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	const reg = /^[A-Za-z0-9]{10}$/;
	if (reg.test(objectWithIsEditTrue.asin)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = true;
		ElMessage.error(area.value == 'CN' ? 'ASIN请输入10位数的字母或者数字，并且不包含空格' : 'ASIN, please enter a 10 digit letter or number without spaces');
	}
	return false;
};
const validateASINAccount = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.addASINAccount.trim() != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsASIN = true;
		ElMessage.error(area.value == 'CN' ? '上架平台不能为空' : 'The platform cannot be empty');
	}
	return false;
};
const validateStoreSKU = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.storeSKU != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsstoreSKU = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsstoreSKU = true;
		ElMessage.error(area.value == 'CN' ? 'storeSKU不能为空' : 'StoreSKU cannot be empty');
		return false;
	}
};
const validateSingleOrderQTY = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.singleOrderQTY.trim() != '' && !isNaN(objectWithIsEditTrue.singleOrderQTY)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = false;
		return true;
	} else if (isNaN(objectWithIsEditTrue.singleOrderQTY)) {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = true;
		ElMessage.error('singleOrderQTY只能输入数字');
		return false;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsSingleOrderQTY = true;
		ElMessage.error(area.value == 'CN' ? 'singleOrderQTY不能为空' : 'SingleOrderQTY cannot be empty');
		return false;
	}
};
const validateErpSku = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.erpSku != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IserpSku = true;
		ElMessage.error(area.value == 'CN' ? 'erpSku不能为空' : 'ErpSku cannot be empty');
		return false;
	}
};
const validateEan = () => {
	const objectWithIsEditTrue = tableData.value.find((obj: any) => obj.IsEdit === true);
	if (objectWithIsEditTrue.ean != '') {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsEAN = false;
		return true;
	} else {
		tableData.value.find((obj: any) => obj.IsEdit === true).IsEAN = true;
		ElMessage.error(area.value == 'CN' ? 'EAN编码不能为空' : 'EAN-13 cannot be empty');
		return false;
	}
};
Getarea();
watch(
	() => aSIN.value,
	() => {
		if (isWatch.value) {
			isWatch.value = false;
			let str_array = clearCharactersByRegex(aSIN.value + '');
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				//if (arr[0] !== undefined) {
				queryParams.value.aSINList = arr;
				queryParams.value.asinTextArea = arr;
				//} else {
				//queryParams.value.aSINList = null;
				//}
			} else {
				queryParams.value.aSINList = null;
				queryParams.value.asinTextArea = '';
			}
		} else {
			isWatch.value = true;
		}
	}
);

watch(
	() => queryParams.value.asinTextArea,
	() => {
		if (isWatch.value && queryParams.value.asinTextArea !== undefined) {
			isWatch.value = false;
			let str_array = clearCharactersByRegex(queryParams.value.asinTextArea + '');
			let arr = clearEmptyDataByAny(str_array);
			if (arr?.length > 0) {
				//if (arr[0] !== undefined) {
				queryParams.value.aSINList = arr;
				aSIN.value = arr;
				//} else {
				//queryParams.value.aSINList = null;
				//}
			} else {
				queryParams.value.aSINList = null;
				aSIN.value = '';
			}
		} else {
			isWatch.value = true;
		}
	}
);
</script>

<style lang="less" scoped>
.settingf {
	position: relative;

	.importDiv {
		position: absolute;
		left: 0;
	}

	.setting {
		display: inline;
		position: absolute;
		right: 30px;
	}

	.custom {
		position: relative;
	}
}

.custom-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
	}
}

.sku-input {
	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 1px #de2910 inset;
	}
}

.buttonBackground {
	background-color: #e76957;
	box-shadow: 0 0 0 1px #e76957 inset;
	color: white;
}

:deep(.el-tooltip) {
	padding: 0;
}

/deep/ .el-table td.el-table__cell div {
	overflow: hidden;
}

/deep/ .el-textarea__inner {
	box-shadow: initial;
	padding:5px;
	margin: 0;
	height: 142px !important;
}
</style>
