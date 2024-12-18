import Cookies from 'js-cookie';

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 * @method setLocalStorageItemWithExpiry 设置永久缓存并设置过期时间
 * @method getLocalStorageItemWithExpiry 获取永久缓存并判断是否过期
 */
export const Local = {
	// 查看 v2.4.3版本更新日志
	setKey(key: string) {
		// @ts-ignore
		return `${__NEXT_NAME__}:${key}`;
	},
	// 设置永久缓存
	set<T>(key: string, val: T) {
		window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json = <string>window.localStorage.getItem(Local.setKey(key));
		return JSON.parse(json);
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(Local.setKey(key));
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},
	setLocalStorageItemWithExpiry(key: string, value: any, ttl: number) {
		const now = new Date();
		// 将数据和过期时间（以毫秒为单位）一起存储
		const item = {
			value: value,
			expiry: now.getTime() + ttl
		};
		localStorage.setItem(Local.setKey(key),JSON.stringify(item));
	},
	getLocalStorageItemWithExpiry(key: string) {
		const itemStr = localStorage.getItem(Local.setKey(key));
		// 如果没有该项，直接返回null
		if (!itemStr) {
			return null;
		}
		const item = JSON.parse(itemStr);
		const now = new Date();
		// 如果该项已经过期，删除它并返回null
		if (now.getTime() > item.expiry) {
			localStorage.removeItem(key);
			return null;
		}
		// 如果该项还在有效期内，返回它的值
		return item.value;
	}
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set<T>(key: string, val: T) {
		if (key === 'token') return Cookies.set(key, val);
		window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		if (key === 'token') return Cookies.get(key);
		let json = <string>window.sessionStorage.getItem(Local.setKey(key));
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) {
		if (key === 'token') return Cookies.remove(key);
		window.sessionStorage.removeItem(Local.setKey(key));
	},
	// 移除全部临时缓存
	clear() {
		Cookies.remove('token');
		window.sessionStorage.clear();
	},
};
