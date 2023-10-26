<template>
    <div>
        <label :for="`${props.punch}` + props.index">{{ props.punch }}</label>
        <input type="checkbox" v-model="value" :id="`${props.punch}` + props.index" :value="props.punch">
    </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['punch', 'index', 'modelValue']);
const emits = defineEmits(['update:modelValue']);

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emits('update:modelValue', value)
    }
})


</script>
