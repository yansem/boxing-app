<template>
    <input
        class="appearance-none text-center block w-[50px] bg-gray-200 text-gray-700 border rounded leading-tight focus:outline-none focus:bg-white"
        :id="props.id"  type="number" max="59" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
</template>

<script setup>
defineEmits(['update:modelValue'])
const props = defineProps(['id', 'modelValue', 'value'])
</script>
