<template>
	<!--
		Seeing type errors on the word `class`?
		This unfortunately happens because @types/react's JSX definitions leak into every file due to being declared globally.
		There's currently no way to prevent this when using both Vue and React with TypeScript in the same project.
		You can read more about this issue here: https://github.com/johnsoncodehk/volar/discussions/592
	-->
	<div class="flex flex-col gap-2">
    <h2 class="text-md slate-500">A counter in Vue, capable of sharing global state with all other frameworks</h2>
    <div class="flex flex-row justify-center gap-2 p-4 bg-slate-100 border border-slate-200 rounded-xl">
      <button @click="subtract()" class="p-2 px-4 bg-red-200 hover:bg-red-300 border border-red-300 hover:border-red-400 text-red-500 rounded-lg">
        -
      </button>
      <pre class="p-2 border border-slate-300 bg-slate-200 rounded-lg">
        {{ counter.count }}
      </pre>
      <button @click="add()" class="p-2 px-4 bg-green-200 hover:bg-green-300 border border-green-300 hover:border-green-400 text-green-500 rounded-lg">
        +
      </button>
    </div>
	</div>
	<div class="counter-message">
		<slot />
	</div>
</template>

<script lang="ts">
import { useStore } from '../../lib/vue';
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