<script setup lang="ts">
import { ref } from 'vue';
import { getExpectedDeliveryList } from '/@/api/modular/main/collections'
import router from '/@/router';

const loading = ref(false);
const tableData = ref<any>([]);

const handleQuery = async () => {
    loading.value = true;
    var res = await getExpectedDeliveryList();
    tableData.value = res.data.result ?? [];
    loading.value = false;
};

// 点击跳转到相应表单页
const examine = (val?: any): void => {
    if (!val) {
        router.push({ path: '/business/collection/details?id' });
    } else {
        let name = val.row.ForwarderName + val.row.ShippingMethod + '(' + val.row.IscustomsDeclaration + ')';
        router.push({ path: '/business/edit/edit?id', query: { id: val.row.Id, name } });
    }
}
handleQuery()
</script>
<template>
    <el-table :data="tableData" height="350" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        border="">
        <el-table-column type="index" label="序号" width="40" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="DocumentNo" label="单据编号" align="center" sortable show-overflow-tooltip="">
            <template #default="scope">
                <el-button size="small" text type="primary" @click="examine(scope)"> {{ scope.row.DocumentNo }}
                </el-button>
            </template>
        </el-table-column>
        <el-table-column prop="InWareHouseNo" label="货代入仓号" align="center" sortable width="105"
            show-overflow-tooltip="" />
        <el-table-column prop="Destination" label="目的地" align="center" sortable show-overflow-tooltip="" />

        <el-table-column prop="ShippingMethod" label="运输方式" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="DepartureDate" label="验货完成日期" align="center" sortable show-overflow-tooltip="" />
        <el-table-column prop="EstimatedDeliveryDate" label="预计到仓" align="center" sortable show-overflow-tooltip="" />
    </el-table>
</template>