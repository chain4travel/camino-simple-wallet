<template>
    <v-main>
        <Navbar />
        <div class="content">
            <slot></slot>
        </div>
        <!-- <ToS style="margin: 20px !important"></ToS> -->
    </v-main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/Navbar.vue'
import ToS from '@/components/misc/ToS.vue'
@Component({
    components: { Navbar, ToS },
})
export default class DefaultLayout extends Vue {}
</script>
<style scoped>
.content {
    /* height: calc(100vh - 80px); */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
