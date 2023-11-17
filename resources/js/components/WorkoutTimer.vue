<template>
    <div class="flex flex-col items-center align-middle">
        <span class="text-9xl">{{ roundCount }}</span>
        <span class="text-9xl">{{ timer }}</span>
    </div>
</template>

<script setup>

const props = defineProps(['roundCount', 'timer']);

</script>
