<template>
	<template v-for="val in chils">
		<el-sub-menu :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
			<template #title>
				<SvgIcon :name="val.meta.icon" />
				<span>{{ $t(val.meta.title) }}</span>
			</template>
			<sub-item :chil="val.children" />
		</el-sub-menu>
		<template v-else>
			<el-menu-item :index="tagsViewListOver ? null:val.path" :key="val.path"  @click="handleClick">
				<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
					<SvgIcon :name="val.meta.icon" />
					<span>{{ $t(val.meta.title) }}</span>
				</template>
				<template v-else>
					<a class="w100" @click.prevent="onALinkClick(val)">
						<SvgIcon :name="val.meta.icon" />
						{{ $t(val.meta.title) }}
					</a>
				</template>
			</el-menu-item>
		</template>
	</template>
</template>

<script setup lang="ts" name="navMenuSubItem">
import { ref,computed,watch } from 'vue';
import { RouteRecordRaw,useRoute } from 'vue-router';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';

// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	chil: {
		type: Array<RouteRecordRaw>,
		default: () => [],
	},
});
const stores = useTagsViewRoutes();
const route = useRoute()
const tagsViewListOver = ref(false)
// 获取父级菜单数据
const chils = computed(() => {
	return <RouteItems>props.chil;
});
// 打开外部链接
const onALinkClick = (val: RouteItem) => {
	other.handleOpenLink(val);
};
const handleClick = ()=>{
	if(Session.get('tagsViewList')?.length < 15){
		stores.setTagsViewListOver(false)
		tagsViewListOver.value=false
	}else{
		stores.setTagsViewListOver(true)
		tagsViewListOver.value=true
	}

}
watch(()=>route.path,
()=>{
	if(Session.get('tagsViewList')?.length < 15){
		stores.setTagsViewListOver(false)
		tagsViewListOver.value=false
	}else{
		stores.setTagsViewListOver(true)
		tagsViewListOver.value=true
	}
}
)
</script>
