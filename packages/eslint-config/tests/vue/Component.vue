<template>
    <h1>Hello {{ name }}!</h1>
</template>

<script setup lang="ts">
const { name } = defineProps<{
    name: string
}>()
</script>
