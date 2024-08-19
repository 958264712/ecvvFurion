<template>
	<div class="home-card-item">
		<h2 style="margin-bottom: 10px">基础信息配置</h2>
		<el-table :data="tableData" style="height: 100%" v-loading="loading" border tooltip-effect="light" row-key="id">
			<el-table-column label="序号" type="index" align="center" width="100" />
			<template v-for="(item, index) in TableList" :key="index">
				<el-table-column v-if="item.dataIndex === 'store'" :prop="item.dataIndex" show-overflow-tooltip :label="item.title_CN" align="center">
					<template #default="scope">
						{{ scope.row.store ? '已设置' : '未设置' }}
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.dataIndex" :prop="item.dataIndex" show-overflow-tooltip :label="item.title_CN" align="center" />
			</template>

			<el-table-column label="操作" align="center" fixed="right" width="180">
				<template #default="scope">
					<el-button size="small" text type="primary" @click="routerHref(scope.row.href)"> 设置 </el-button>
				</template>
			</el-table-column>
		</el-table>
        <el-dialog v-model="centerDialogVisible" title="提示" width="500" center draggable>
            <div class="center">
                <h4>欢迎使用业务集成系统</h4>
                <p>使用该系统需要配置基础信息后才可以正常使用</p>
            </div>
            <template #footer>
                <el-button type="primary" @click="centerDialogVisible = false"> 现在配置 </el-button>
            </template>
        </el-dialog>
	</div>
</template>

<script lang="ts" setup name="my_service">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const centerDialogVisible = ref(true);

const tableData = ref<any>([
	{
		setItem: '站点名称',
		remark: '用于命名各模块的数据名称',
		store: false,
		href: '/system/basicInfo/siteManagement',
	},
	{
		setItem: '上架平台',
		remark: '产品上架的平台，需要与商品实际上架的平台名称一致，以防数据导入本系统出现无统计等情况',
		store: false,
		href: '/system/basicInfo/listPlatform',
	},
	{
		setItem: '仓库名称',
		remark: '商品存放的仓库名称，需要与使用的库存管理系统内的仓库名称一致，以防数据导入本系统出现无统计等情况',
		store: false,
		href: '/system/basicInfo/warehouseName',
	},
	{
		setItem: '组织架构',
		remark: '公司内部的组织架构，可设置部门',
		store: false,
		href: '/system/org',
	},
	{
		setItem: '账号管理',
		remark: '公司内部的人员账号配置',
		store: false,
		href: '/system/user',
	},
	{
		setItem: '角色管理',
		remark: '公司内部人员的操作权限管理',
		store: false,
		href: '/system/role',
	},
]);
const TableList = ref<any>([
	{
		title_CN: '配置项',
		title_EN: 'Set Item',
		dataIndex: 'setItem',
	},
	{
		title_CN: '说明',
		title_EN: 'Remark',
		dataIndex: 'remark',
	},
	{
		title_CN: '状态',
		title_EN: 'Store',
		dataIndex: 'store',
	},
]);
const routerHref = (href: String) => {
	router.push(href);
};
</script>


<style lang="less" scoped>
.center {
	text-align: center;
	h4 {
		font-size: 18px;
		font-weight: 500;
		margin-bottom: 10px;
	}
}
</style>
