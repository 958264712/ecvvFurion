<template>
	<el-menu
		router
		:default-active="state.defaultActive"
		background-color="transparent"
		:collapse="state.isCollapse"
		:collapse-transition="false"
		:unique-opened="getThemeConfig.isUniqueOpened" 
		>
		<template v-for="val in menuLists">
			<el-sub-menu :index="val.path" v-if="val.children && val.children.length > 0" :key="val.path">
				<template #title>
					<SvgIcon :name="val.meta.icon" />
					<span>{{ $t(val.meta.title) }}</span>
				</template>
				<SubItem :chil="val.children" />
			</el-sub-menu>
			<template v-else>
				<el-menu-item :index="tagsViewListOver ? null:val.path" :key="val.path" @click="handleClick">
					<SvgIcon :name="val.meta.icon" />
					<template #title v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
						<span>{{ $t(val.meta.title) }}</span>
					</template>
					<template #title v-else>
						<a class="w100" @click.prevent="onALinkClick(val)">{{ $t(val.meta.title) }}</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script setup lang="ts" name="navMenuVertical">
import { ref,defineAsyncComponent, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate, RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useThemeConfig } from '/@/stores/themeConfig';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';

// 引入组件
const SubItem = defineAsyncComponent(() => import('/@/layout/navMenu/subItem.vue'));
const stores = useTagsViewRoutes();

// 定义父组件传过来的值
const props = defineProps({
	// 菜单列表
	menuList: {
		type: Array<RouteRecordRaw>,
		default: () => [],
	},
});
const tagsViewListOver = ref(false)

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const state = reactive({
	// 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
	defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
	isCollapse: false,
});

// 获取父级菜单数据
const menuLists = computed(() => {
	return <RouteItems>props.menuList;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteToFrom) => {
	const { path, meta } = currentRoute;
	const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/');
	const parentPath = pathSplit.splice(0, 3).join('/');
    if (pathSplit.length >= 4 && meta?.isHide) return parentPath;
	else return path;
};
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
// 页面加载时
onMounted(() => {
	state.defaultActive = setParentHighlight(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
	// 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
	state.defaultActive = setParentHighlight(to);
	const clientWidth = document.body.clientWidth;
	// 修改屏幕尺寸大小自适应收合菜单
	if (clientWidth < 1900) themeConfig.value.isCollapse = true;
});
// 设置菜单的收起/展开
watch(
	() => themeConfig.value.isCollapse,
	(isCollapse) => {
		document.body.clientWidth <= 1900 ? (state.isCollapse = false) : (state.isCollapse = false);
	},
	{
		immediate: true,
	}
);
// 面包屑条数限制
watch(()=>route.path,
()=>{
	if(Session.get('tagsViewList')?.length > 14){
		tagsViewListOver.value = true
		stores.setTagsViewListOver(true)
	}else{
		tagsViewListOver.value = false
		stores.setTagsViewListOver(false)
	}
}
)
</script>
