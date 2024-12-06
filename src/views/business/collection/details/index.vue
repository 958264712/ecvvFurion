<template>
	<div class="sys-menu-container" @wheel="handleMouseScroll">
		<el-form :model="collectionOrderInfo" ref="queryForm" :inline="true" label-width="auto">
			<el-card shadow="hover" :body-style="{ paddingBottom: '0' }" style="margin-bottom: 10px">
				<el-row v-if="id">
					<el-form-item>
						<el-button size="small" type="primary" icon="ele-Plus" :disabled="allCompiles" @click="OrderLockSwitch" style="margin-right: 20px">
							{{ compile ? '退出编辑' : '编辑' }}
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button-group>
							<el-button type="primary" size="small" icon="ele-Search" @click="exportBaoguan"> 导出报关件 </el-button>
							<el-button icon="ele-Refresh" size="small" @click="exportYanhuo()"> 导出验货单 </el-button>
							<el-button type="primary" size="small" icon="ele-Search" @click="exportBoxTag()"> 导出外箱标签 </el-button>
						</el-button-group>
					</el-form-item>
				</el-row>
				<el-row style="display: flex; justify-content: space-around">
					<el-form-item label="单据编号" prop="documentNo" :rules="[{ required: true, message: '单据编号不能为空', trigger: 'blur' }]">
						<el-input :formatter="formatInput" v-model="collectionOrderInfo.documentNo" clearable="" :disabled="!compile" placeholder="请输入单据编号" />
					</el-form-item>
					<el-form-item label="货代名称" prop="forwarderID" :rules="[{ required: true, message: '货代名称不能为空', trigger: 'blur' }]">
						<el-select @change="changefun" :formatter="formatInput" v-model="collectionOrderInfo.forwarderID" filterable clearable class="w100" :disabled="!compile">
							<el-option v-for="item in selectBox" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="目的地">
						<el-select v-model="collectionOrderInfo.destination" filterable @change="showCurrency()" clearable :disabled="!compile" placeholder="请输入目的地">
							<el-option v-for="item in destinationList" :label="item.value" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="截仓日期">
						<el-date-picker v-model="collectionOrderInfo.cutOffDate" clearable="" type="date" :disabled="!compile" placeholder="请输入截仓日期" />
					</el-form-item>
				</el-row>
			</el-card>
			<el-collapse v-model="activeNames" accordion style="">
				<el-collapse-item name="1">
					<template #title>
						<div class="titleForm">展开</div>
					</template>
					<el-row>
						<el-col :span="8">
							<div class="grid-content ep-bg-purple" />
							<el-form-item label="收货平台(店铺)" prop="consigneeName" style="width: 90%">
								<el-select :disabled="!compile" v-model="collectionOrderInfo.consigneeName" placeholder="请选择" filterable clearable>
									<el-option v-for="item in platformStoreOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="美元汇率" style="width: 90%" prop="exchangeRateUSD" :rules="[{ required: true, message: '美元汇率不能为空', trigger: 'blur' }]">
								<el-input :type="'number'" :formatter="formatInput" :disabled="!compile" v-model="collectionOrderInfo.exchangeRateUSD" clearable="" placeholder="请输入美元汇率" />
							</el-form-item>
							<el-form-item label="报关单号" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.customsDeclarationNo" clearable="" placeholder="请输入报关单号" />
							</el-form-item>
							<el-form-item label="状态" style="width: 90%">
								<el-select :disabled="!compile" v-model="collectionOrderInfo.state" filterable clearable>
									<el-option v-for="item in stateOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="交仓地址" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.deliveryAddress" clearable="" placeholder="请输入交仓地址" />
							</el-form-item>
							<el-form-item label="开船／起飞日期" style="width: 90%">
								<el-date-picker @change="actualArrivalDateChange" :disabled="!compile" v-model="collectionOrderInfo.actualArrivalDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="国际物流支付方" prop="internationalLogisticsFeePayer" style="width: 90%" :rules="[{ required: true, message: '国际物流支付方不能为空', trigger: 'blur' }]">
								<el-select :disabled="!compile" v-model="collectionOrderInfo.internationalLogisticsFeePayer" clearable>
									<el-option v-for="item in payerOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8" style="">
							<div class="grid-content ep-bg-purple" />
							<el-form-item label="物流报价" style="width: 90%" prop="logisticsPrice" :rules="[{ required: true, message: '物流报价不能为空', trigger: 'blur' }]">
								<el-row style="width: 100%">
									<el-col :xs="16" :sm="16" :md="16" :xl="16">
										<el-input :type="'number'" :formatter="formatInput" :disabled="!compile" v-model="collectionOrderInfo.logisticsPrice" clearable="" style="width: 100%" placeholder="请输入" />
									</el-col>
									<el-col :xs="8" :sm="8" :md="8" :xl="8">
										<el-select :formatter="formatInput" v-model="collectionOrderInfo.logisticsPriceCurrency" filterable clearable style="width: 100%" :disabled="!compile">
											<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value" />
										</el-select>
									</el-col>
								</el-row>
							</el-form-item>
							<el-form-item label="是否报关"> <el-switch :disabled="!compile" v-model="collectionOrderInfo.NeetCustoms" inline-prompt active-text="是" inactive-text="否" /><br /> </el-form-item>
							<br />
							<el-form-item label="运输方式" style="width: 90%" prop="shippingMethod" :rules="[{ required: true, message: '运输方式不能为空', trigger: 'blur' }]">
								<el-select v-model="collectionOrderInfo.shippingMethod" :disabled="!compile" filterable clearable>
									<el-option v-for="item in shippingMethodOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="收件人" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.recipientName" clearable="" placeholder="请输入收件人" />
							</el-form-item>
							<el-form-item label="验货完成日期" style="width: 90%">
								<el-date-picker @change="departureDateChange" :disabled="!compile" v-model="collectionOrderInfo.departureDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="附件" style="width: 90%">
								<el-upload
									v-model:file-list="fileList"
									action="http://192.168.1.81:5568/api/collectionOrderInfo/collectionUploadAttachment"
									:on-success="successfun"
									:on-error="errorfun"
									:multiple="true"
									:show-file-list="true"
									name="file"
									:before-remove="handleRemovefun"
									:disabled="!compile"
								>
									<el-button :disabled="!compile" type="primary" :loading="loading1" icon="ele-Plus" style="margin-right: 20px"> 附件上传 </el-button>
								</el-upload>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<div class="grid-content ep-bg-purple" />
							<el-form-item label="汇率" style="width: 90%" prop="exchangeRate" :rules="[{ required: true, message: '汇率不能为空', trigger: 'blur' }]">
								<el-input :type="'number'" :formatter="formatInput" :disabled="!compile" v-model="collectionOrderInfo.exchangeRate" clearable="" placeholder="请输入" />
							</el-form-item>
							<el-form-item label="报关费" style="width: 90%" prop="totalCustomsDeclarationFee" :rules="[{ required: true, message: '报关费不能为空', trigger: 'blur' }]">
								<el-input :type="'number'" :formatter="formatInput" :disabled="!compile" v-model="collectionOrderInfo.totalCustomsDeclarationFee" clearable="" placeholder="请输入报关费" />
							</el-form-item>
							<el-form-item label="货代入仓号" style="width: 90%">
								<el-input :disabled="!compile" v-model="collectionOrderInfo.inWareHouseNo" clearable="" placeholder="请输入货代入仓号" />
							</el-form-item>
							<el-form-item label="收件联系电话" style="width: 90%">
								<el-input :type="'number'" :disabled="!compile" v-model="collectionOrderInfo.recipientPhone" clearable="" placeholder="请输入收件联系电话" />
							</el-form-item>
							<el-form-item label="预计送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.estimatedArrivalDate" type="date" placeholder="请选择日期" />
							</el-form-item>
							<el-form-item label="实际送仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.actualDeliveryDate" type="date" placeholder="请选择日期" @change="actualDeliveryDateChange" />
							</el-form-item>
							<el-form-item label="物流预计到仓日期" style="width: 90%">
								<el-date-picker :disabled="!compile" v-model="collectionOrderInfo.estimatedDeliveryDate" type="date" placeholder="请选择日期" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-form-item label="备注" style="width: 97%">
							<el-input :disabled="!compile" v-model="collectionOrderInfo.notes" type="textarea" placeholder="请输入备注" />
						</el-form-item>
					</el-row>
					<el-row>
						<div style="margin: 0 auto; position: relative">
							<el-button :disabled="!compile" type="primary" @click="commit()">提交</el-button>
						</div>
					</el-row>
				</el-collapse-item>
			</el-collapse>
		</el-form>
	</div>
</template>

<script lang="ts" setup name="compile">
import { onMounted, reactive, ref, computed, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { getAPI } from '/@/utils/axios-utils';
import { SysMenuApi, SysDictDataApi } from '/@/api-services/api';
import { SysMenu } from '/@/api-services/models';
import { platformStoreGetList } from '/@/api/modular/main/platformStoreInfo.ts';
import service from '/@/utils/request';
import mittBus from '/@/utils/mitt';
// 定义变量
const route = useRoute();
//关闭当前页面
const closeCurrentTagsView = () => {
	mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

const state = reactive({
	loading: true,
	menuData: [] as Array<SysMenu>,
	queryParams: {
		title: undefined,
		type: undefined,
	},
	editMenuTitle: '',
});
const id = ref<any>();
const queryForm = ref();
const collectionOrderInfo = reactive<any>({ state: '集货' });
const compile = ref<boolean>(false);
const allCompiles = ref(false);
const destinationList = ref<any>([]);
const platformStoreOptions = ref<any>([]);
const activeNames = ref('1');
const selectBox = ref<any>();

const shippingMethodOptions = ref(['海运', '空运', '快递', '小包','海运(KG计费)']);
const stateOptions = ref(['集货', '截仓', '在途中', '已入仓']);
const payerOptions = ref(['国内支付', '迪拜支付']);
const currencyOptions = ref([
	{ label: 'RMB 人民币', value: 'RMB' },
	{ label: 'AED 迪拉姆', value: 'AED' },
	{ label: 'SAR 沙特里亚尔', value: 'SAR' },
	{ label: 'USD 美元', value: 'USD' },
	{ label: 'GBP 英镑', value: 'GBP' },
	{ label: 'EUR 欧元', value: 'EUR' },
	{ label: 'CAD 加拿大元', value: 'CAD' },
]);
const fileList = ref<any>([]);
function handleMouseScroll(e: any) {
	activeNames.value = '2';
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
				handleQuery();
			} else {
				ElMessage({
					type: 'info',
					message: '删除附件失败',
				});
			}
		});
	} else {
		fileList.value = fileLists.value;
	}
}
onMounted(async () => {
	const route = useRoute();
	if (route.query.id) {
		id.value = route.query.id;
	} else {
		compile.value = true;
	}
	const results = await platformStoreGetList();
	results.data.result?.map((res) => {
		platformStoreOptions.value.push(res);
	});

	const res = await getAPI(SysDictDataApi).apiSysDictDataDataListCodeGet('destination');
	destinationList.value = res.data.result;
	handleQuery();
	service({
		url: '/api/collectionGoodsInfo/returnSelectBox',
		method: 'get',
	}).then((data) => {
		selectBox.value = data.data.result;
	});
});
//检查后台是否被占用
let timer = ref<any>();
//组件销毁
onBeforeUnmount(() => {
	compile.value = !compile.value;
	clearInterval(timer.value);
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
					handleQuery();
				} else {
					ElMessage({
						type: 'info',
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
					ElMessage({
						type: 'info',
						message: '新增成功',
					});
					//关闭当前页
					closeCurrentTagsView();
					// router.push({ path: '/business/edit/edit?id', query: { id: data.data.result.id, name: '集货单详情编辑页面' } });
				} else {
					ElMessage({
						type: 'info',
						message: '新增失败',
					});
				}
			});
		}
	});
};
//限制用户输入空
const formatInput = (value: any, type: any) => {
	return value.replace(/\s+/g, '');
};
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
	collectionOrderInfo.state = '在途中';
	var date2 = new Date(val);
	new Date(date2.setDate(date2.getDate() + 5)).toLocaleDateString();
	collectionOrderInfo.actualArrivalDate = date2;
}
const actualDeliveryDateChange = () => {
	collectionOrderInfo.state = '已入仓';
};
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
	transform: translate(50%);
}

:deep(.el-collapse-item__arrow) {
	// display: none !important;
	margin: 0 auto;
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

// :deep(.el-collapse-item__header){
// 	width: 100%;
// 	transform: translate(-20px);

// }
:deep(.el-collapse-item) {
	width: 101%;
}

:deep(.el-collapse) {
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
	border-radius: 4px;
}

:deep(.el-select .el-input),
:deep(.el-select),
:deep(.el-form--inline .el-input) {
	width: 100%;
}
</style>
