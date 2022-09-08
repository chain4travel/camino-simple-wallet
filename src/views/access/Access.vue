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
                <div class="content__item">
                    <button @click="goToWallet" class="ava_button access_wallet">
                        Access Wallet in Expert Mode
                    </button>
                </div>
                <ToS style="margin: 20px !important"></ToS>
            </div>
        </div>
    </DefaultLayout>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ToS from '@/components/misc/ToS.vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { iUserAccountEncrypted } from '@/store/types'
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
        ToS,
    },
})
export default class Access extends Vue {
    accounts: iUserAccountEncrypted[] = []
    goToWallet() {
        window.open('https://wallet.camino.foundation/')
    }
    created() {
        this.refreshAccounts()
    }
    refreshAccounts() {
        let accountsRaw = localStorage.getItem('accounts')
        this.accounts = JSON.parse(accountsRaw as string) || []
    }
    beforeMount() {
        if (this.accounts.length === 0) this.$router.push(`/access/mnemonic`)
    }
}
</script>
<style scoped lang="scss">
@use '../../styles/main';

.access_view {
    display: flex;
    // justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
}
.align-v {
    display: flex;
    align-items: center;
    flex-direction: column;
}
.content__item {
    margin-top: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    .button_secondary {
        width: 100%;
        height: 48px;
        padding: 12px 20px;
        border-radius: var(--border-radius-lg);
    }
    .access_wallet {
        max-width: 300px;
    }
    .access_wallet,
    .logout {
        width: 90%;
        height: 48px;
        padding: 12px 20px;
        background-color: var(--disabled-bg);
        border-radius: var(--border-radius-lg);
    }
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
