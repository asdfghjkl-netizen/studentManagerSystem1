<template>
    <tr>
        <td>{{ title }}：</td>
        <td>
            <slot />
        </td>
    </tr>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
    title: { type: String, default: "" },
})
</script>
