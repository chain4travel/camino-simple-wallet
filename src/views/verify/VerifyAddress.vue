<template>
    <DefaultLayout>
        <div class="dashboard">
            <div class="header-title">
                <img src="@/assets/logo.svg" />
                <span>{{ $t('verifyAddress.title') }}</span>
            </div>
            <div class="content">
                <div class="alignment_explenantion">
                    <span>{{ $t('verifyAddress.alignment.top_desc1') }}</span>
                    <span>{{ $t('verifyAddress.alignment.top_desc2') }}</span>
                    <span>{{ $t('verifyAddress.alignment.top_desc4') }}</span>
                    <span class="disclamer">{{ $t('verifyAddress.alignment.disclamer') }}</span>
                </div>
                <DisplayCard label="P-Chain Address">
                    <div class="item_inner item_balance">
                        <span class="balance">{{ pChainAddress }}</span>
                    </div>
                </DisplayCard>
                <div class="content__item">
                    <button
                        class="ava_button button_secondary send_button"
                        @click="alignAddresses"
                        :disabled="loading"
                    >
                        <template v-if="!loading">
                            {{ $t('verifyAddress.confirm_address') }}
                        </template>
                        <Spinner v-else class="spinner"></Spinner>
                    </button>
                </div>
                <span v-if="error" class="err">
                    Something went wrong, click &nbsp;
                    <a href="/verifyaddress/mnemonic/">here</a>
                    &nbsp; to redo the process
                </span>
                <div class="alignment_explenantion">
                    <span>
                        The addresses shown above will be used to allocate funds to your wallet once
                        Camino goes live. They are public and you may shre them with anyone.
                    </span>
                    <span>
                        To double check the addresses, you may also login to the
                        <a href="https://wallet.camino.network">expert wallet</a>
                    </span>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import DefaultLayout from '../../layout/DefaultLayout.vue'
import DisplayCard from '../../components/wallet/DisplayCard.vue'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletNameType } from '@c4tplatform/camino-wallet-sdk'
import Spinner from '@/components/misc/Spinner.vue'
import axios from 'axios'
import router from '@/router'
const { isHexStrict, toHex } = require('@arcblock/forge-util')

const EC = require('elliptic').ec

function strip0x(input: string) {
    return isHexStrict(input) ? input.replace(/^0x/i, '') : input
}

@Component({
    components: {
        DefaultLayout,
        DisplayCard,
        Spinner,
    },
})
export default class VerifyAddress extends Vue {
    @Prop() error!: boolean
    @Prop() loading!: boolean

    data() {
        return {
            loading: false,
        }
    }
    get pChainAddress() {
        try {
            let wallet: MnemonicWallet = this.$store.state.activeWallet
            if (!wallet) return '-'

            return wallet.getCurrentAddressPlatform()
        } catch (e) {
            return '-'
        }
    }

    get wallet() {
        let wallet: MnemonicWallet = this.$store.state.activeWallet
        return wallet
    }

    get walletType(): WalletNameType {
        return this.wallet.type
    }

    get privateKeyC(): string | null {
        if (this.walletType === 'ledger') return null
        let wallet = this.wallet as SingletonWallet | MnemonicWallet
        return wallet.ethKey
    }

    async getPriKey() {
        const secp256k1 = new EC('secp256k1')
        const compressed = false
        const pk = secp256k1
            .keyFromPrivate(strip0x(toHex(`0x${this.privateKeyC}`)), 'hex')
            .getPublic(compressed, 'hex')

        return `0x${pk}`
    }

    async alignAddresses() {
        this.loading = true
        this.error = false
        const wallet = this.$store.state.activeWallet
        const pChainAddress = wallet.getCurrentAddressPlatform()
        const publicKey = await this.getPriKey()

        if (!publicKey || !pChainAddress) {
            this.error = true
            return
        }

        try {
            await axios.post('http://localhost:3000/email', {
                pChainAddress,
                publicKey,
            })
            router.push('/verifyaddress/success')
        } catch (e) {
            this.error = true
            return
        }
    }
}
</script>
<style scoped lang="scss">
@use '../../styles/main';

.alignment_explenantion {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 20px;
    gap: 15px;
    color: var(--primary-color);
    text-align: left;
    & > span {
        font-size: 16px;
        font-weight: 500;
    }
    .disclamer {
        font-weight: 700;
    }
}

a {
    color: var(--secondary-color) !important;
}

.dashboard {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 50px;
    margin-bottom: 50px;
    gap: 40px;
    width: 100vw;
    .content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 300px;
        width: 600px;
    }
    .content__item {
        .button_secondary {
            width: 100%;
            height: 48px;
            padding: 12px 20px;
            border-radius: var(--border-radius-lg);
        }
    }
}

.header-title {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    gap: 10px;
    font-size: 44px;
    font-weight: 700;
    line-height: 47px;
}

.item_balance {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
    .balance {
        display: inline-block;
        word-wrap: break-word;
        width: 100%;
    }
}

.send_button {
    display: flex;
    justify-content: center;
    align-items: center;
}

.err {
    font-size: 16px;
    color: var(--error);
    text-align: center;
}

@include main.medium-device {
    .content {
        max-width: 100%;
    }
}

@include main.mobile-device {
    .content {
        padding: 12px;
        max-width: 100%;
    }
    .item_balance {
        max-width: calc(90% - 32px) !important;
    }
    .header-title {
        font-size: 33px;
        flex-direction: column;
        span {
            text-align: center;
        }
    }
}
</style>
