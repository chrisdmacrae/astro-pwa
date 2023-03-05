<template>
	<!--
		Seeing type errors on the word `class`?
		This unfortunately happens because @types/react's JSX definitions leak into every file due to being declared globally.
		There's currently no way to prevent this when using both Vue and React with TypeScript in the same project.
		You can read more about this issue here: https://github.com/johnsoncodehk/volar/discussions/592
	-->
	<div className="counter">
    <h2>A counter in Vue, sharing global state with all other frameworks</h2>
		<button @click="subtract()">-</button>
		<pre>{{ counter.count }}</pre>
		<button @click="add()">+</button>
	</div>
	<div className="counter-message">
		<slot />
	</div>
</template>

<script lang="ts">
import { useStore } from '@nanostores/vue';
import { counterStore } from './counter';

export default {
  setup: () => {
    const counter = useStore(counterStore)

    return {
      add() { counterStore.setKey('count', counter.value.count + 1) },
      subtract() { counterStore.setKey('count', counter.value.count + -1) },
      counter
    }
  },
};
</script>