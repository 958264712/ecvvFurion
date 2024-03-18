<script lang="ts" setup >
import request from '/@/utils/request';
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRoute } from 'vue-router'
//import { formatDate } from '/@/utils/formatTime';
import { deleteECVVHomeProductTypeInfo, updateProductTypeInfo,addECVVHomeProductTypeInfo,batchDeleteECVVHomeProductTypeInfo } from '/@/api/modular/main/eCVVHomeTaxonomicInfo';
const loading = ref(false);
const tableData = ref<any>([]);
const proInfoAddList = ref<any>([]);
const selectedRowKeys = ref<any>([]);
const queryParams = ref<any>({});
const editingKey1 = ref<string>('');
const tableParams = ref({
    Page: 1,
    PageSize: 10,
    total: 0,
});
const route = useRoute()

// 查询操作
const handleQuery = async () => {
    loading.value = true;
    request({
        url: `/api/eCVVHomeProductTypeInfo/productList/${route.query.id}`,
        method: 'GET',
    }).then(res => {
        tableData.value = res.data.result?.proInfo ?? []
        queryParams.value = res.data.result?.tncInfo ?? []
    })

    loading.value = false;
};
const edit = (row: any) => {
    row.productEnable = false
}
const cancel = (row: any) => {
    row.productEnable = true
}
const apply = async (row: any) => {
    editingKey1.value = ''
    row.productEnable = true
    await updateProductTypeInfo(row).then(res => {
        if (res.data.type === 'success') {
            ElMessage.success('保存成功')
            handleQuery()
        } else {
            ElMessage.error('保存失败')
        }
    })
}
// 删除
const delInfo = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            await deleteECVVHomeProductTypeInfo({id:row.id});
            handleQuery();
            ElMessage.success("删除成功");
        })
        .catch(() => { });
};
// add 
const add = async () =>{
    proInfoAddList.value = []
    const newData = {
        productTitle: '',
        productDescription: '',
        productRemark: '',
        productHerf: '',
        productSrc: '',
        productEnable: true,
        productOrder: '',
        tncInfoId:route.query.id
      }
     await addECVVHomeProductTypeInfo(newData).then(res =>{
        if (res.data.type === 'success') {
            ElMessage.success('新增成功')
            handleQuery()
        } else {
            ElMessage.error('新增失败')
        }
      })
}
const delmanyList = () => {
    ElMessageBox.confirm(
    `您确定要删除这${selectedRowKeys.value.length}条数据吗？`,
    'Danger',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    batchDeleteECVVHomeProductTypeInfo(selectedRowKeys.value).then(res => {
      if (res.data.type === 'success') {
        ElMessage.success('删除成功')
        selectedRowKeys.value = []
        handleQuery()
      } else {
        ElMessage.error('删除失败')
      }
    })
  })
}
// 获取keys
const selectChange = (selection: any) => {
  selectedRowKeys.value = []
  selection.map((item: any) => {
    selectedRowKeys.value.push(item.id)
  })
}

handleQuery();
</script>

<template>
    <div class="eCVVHomeTaxonomicInfo-container">
        <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-form-item label="类别名称">
                    <el-input v-model="queryParams.tncName" clearable="" disabled placeholder="请输入类别名称" />
                </el-form-item>
                <el-form-item label="类别标题">
                    <el-input v-model="queryParams.tncTitle" clearable="" disabled placeholder="请输入类别标题" />
                </el-form-item>
                <el-form-item label="类别描述">
                    <el-input v-model="queryParams.tncTitle" clearable="" disabled placeholder="请输入类别描述" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="queryParams.tncTitle" clearable="" placeholder="请输入备注" disabled />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="full-table" shadow="hover" style="margin-top: 8px">
            <div style="margin-bottom: 20px;">
                <el-button type="primary" icon="ele-Plus" @click="add"> 新增一行
                </el-button>
                <el-button type="primary" icon="ele-Delete" @click="delmanyList"> 批量删除
                </el-button>
            </div>
            <el-table :data="tableData" size="large" style="width: 100%" v-loading="loading" tooltip-effect="light"
                row-key="id" border=""  @selection-change="(selection: any) => selectChange(selection)">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="productName" label="商品名称" align="center" sortable show-overflow-tooltip="">
                    <template #default="scope">
                        <el-input v-model="scope.row.productName" :disabled="scope.row.productEnable" />
                    </template>
                </el-table-column>
                <el-table-column prop="productTitle" label="商品描述" align="center" sortable show-overflow-tooltip="">
                    <template #default="scope">
                        <el-input v-model="scope.row.productTitle" :disabled="scope.row.productEnable" />
                    </template>
                </el-table-column>
                <el-table-column prop="productHref" label="商品超链接" align="center" sortable show-overflow-tooltip="">
                    <template #default="scope">
                        <el-input v-model="scope.row.productHref" :disabled="scope.row.productEnable" />
                    </template>
                </el-table-column>
                <el-table-column prop="productSrc" label="商品图片" align="center" sortable show-overflow-tooltip="">
                    <template #default="scope">
                        <el-image style="width: 40px; height: 50px" :src="scope.row.productSrc" />
                    </template>
                </el-table-column>
                <el-table-column prop="productRemark" label="商品备注" align="center" sortable show-overflow-tooltip="">
                    <template #default="scope">
                        <el-input v-model="scope.row.productRemark" :disabled="scope.row.productEnable" />
                    </template>
                </el-table-column>
                <el-table-column prop="productOrder" label="排序" align="center" show-overflow-tooltip="">
                    <template #default="scope">
                        <el-input v-model="scope.row.productOrder" :disabled="scope.row.productEnable" />
                    </template>
                </el-table-column>
                <el-table-column prop="productEnable" label="是否启用" align="center" show-overflow-tooltip="">
                    <template #default="scope">
                        <el-tag v-if="scope.row.productEnable"> True </el-tag>
                        <el-tag type="danger" v-else=""> False </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="">
                    <template #default="scope">
                        <template v-if="scope.row.productEnable">
                            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="edit(scope.row)"> 编辑
                            </el-button>
                            <el-popconfirm title="确定删除吗?" @confirm="delInfo(scope.row)">
                                <template #reference>
                                    <el-button icon="ele-Delete" size="small" text="" type="primary">
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                        <template v-else>
                            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="apply(scope.row)"> 保存
                            </el-button>
                            <el-popconfirm title="确定取消吗?" @confirm="cancel(scope.row)">
                                <template #reference>
                                    <el-button icon="ele-Delete" size="small" text="" type="primary">
                                        取消
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>


