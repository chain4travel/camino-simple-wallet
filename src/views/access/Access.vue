<template>
    <DefaultLayout>
        <div class="access_view">
            <div class="align-v">
                <div class="header-title">
                    <img src="@/assets/logo.svg" />
                    <span>Camino Wallet</span>
                </div>
                <transition name="fade" mode="out-in">
                    <router-view class="access_card"></router-view>
                </transition>
            </div>
        </div>
    </DefaultLayout>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DefaultLayout from '@/layout/DefaultLayout.vue'
@Component({
    metaInfo: () => {
        const description =
            'Access your stored crypto assets in a simple fashion, yet highly secure, and non-custodial fashion. Your Avalanche wallet is a few clicks away!'
        return {
            meta: [
                {
                    vmid: 'description',
                    name: 'description',
                    content: description,
                },
                {
                    vmid: 'og:description',
                    name: 'description',
                    content: description,
                },
                {
                    vmid: 'og:title',
                    name: 'og:title',
                    content: 'Access Stored Crypto Assets | Avalanche Wallet',
                },
            ],
            title: 'Access Stored Crypto Assets',
        }
    },
})
@Component({
    name: 'Access',
    components: {
        DefaultLayout,
    },
})
export default class Access extends Vue {}
</script>
<style scoped lang="scss">
@use '../../styles/main';

.access_view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
}
/* .align-v {
    display: flex;
    align-items: center;
    justify-content: center;
} */
.header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    gap: 10px;
    font-size: 47px;
    font-weight: 700;
    line-height: 47px;
    margin-bottom: 40px;
}
.access_card {
    text-align: center;
}
</style>
