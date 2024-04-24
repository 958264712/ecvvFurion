import { ref } from 'vue';

export const useDebounce = (fn: Function, delay: number) => {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: any[]) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};
