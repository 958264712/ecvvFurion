<script setup lang="ts" name="createcode">
import request from '/@/utils/request';
import { ref } from "vue";

const codelist = ref('')
const ruleFormRef = ref();
const ruleForm = ref < any > ({});
const rules = ref({
    Tag: [{ required: true, }],
    Code: [{ required: true, }]
})
const imgbase64list = ref([])
const tag = ref('')
const img = ref<any>({})

const handleCreate = () => {
    imgbase64list.value = []
    var codeArr = codelist.value.split('\n')
    codeArr.forEach(element => {
        img.value.codeStr = element
    })
    codeArr.forEach(element => {
        request({
            url: '/api/collectionOrderInfo/createCode/' + element + '/' + tag.value,
            method: 'get'
        }).then(res => {
            if(res.data.result){
                img.value.codebase64 = 'data:image/jpeg;base64,' + res.data.result
                imgbase64list.value.push(img.value)
            }
        })
    })
} 
</script>

<template>
    <div>
        <el-form :rules="rules" :model="ruleForm" ref="ruleFormRef" label-width="120px">
            <el-row>
                <el-col :md="18" :sm="18">
                    <el-form-item label="Tag:">
                        <el-input clearable="" v-model="tag" placeholder="请输入条形码TAG" />
                    </el-form-item>
                </el-col>
                <el-col :md="18" :sm="18">
                    <el-form-item label="Code:">
                        <el-input clearable="" v-model="codelist" :rows="2" type="textarea" placeholder="请输入内容条形码内容，可换行输入，每行一个" />
                    </el-form-item>
                </el-col>
                <el-col :md="18" :sm="18">
                    <el-form-item label="操作">
                        <el-button type="primary" style="margin-right: 5px;" @click="handleCreate"> 生成条形码</el-button>
                    </el-form-item>
                </el-col>
                <template v-if="imgbase64list.length">
                    <el-col :md="18" :sm="18" v-for="(img, index) in imgbase64list" :key="index">
                        <el-form-item :label="index +1">
                            <img :src="img.codebase64" style="margin-top: 20px;" />
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </el-form>
    </div>
</template>