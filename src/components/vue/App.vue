<template>
	<div className="app">
    <p>Hello from Vue App: {{ JSON.stringify(data) }}</p>
		<slot />
	</div>
</template>

<script lang="ts">
import { globalStore } from '../../data/globalStore';
import { useStore } from '../../lib/vue'

export default {
	setup() {
    const data = useStore(globalStore)

		return {
      data
		};
	},
};
</script>
