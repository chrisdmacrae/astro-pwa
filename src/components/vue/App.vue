<template>
	<div className="app">
    <p>Hello from Vue App: {{ JSON.stringify(data) }}</p>
		<slot />
	</div>
</template>

<script lang="ts">
import { createStore } from '../../lib/store';
import { useStore } from '@nanostores/vue';

export const appStore = createStore<Record<string, any>>('app', { foo: "bar" })

export default {
	setup() {
    const data = useStore(appStore)

		return {
      data
		};
	},
};
</script>
