<template>
    <DefaultLayout>
        <div class="dashboard">
            <div class="header-title">
                <img src="@/assets/logo.svg" />
                <span>Camino Address Alignment</span>
            </div>
            <div class="content">
                <div class="alignment_explenantion">
                    <span>
                        Camino heavily extends Avalanche's capabilities to fullfil the needs fot the
                        travel industry, like introducing a blockchain-based KYC service, enabling
                        multisignature funds management and allowing a consortium to exist on a
                        layer-1 blockchain.
                    </span>
                    <span>
                        To ensure the utmost security and safety, as well as fonctionality of the
                        network, diffrent addresses need to be aigned.
                    </span>
                    <span>
                        To do this, please click on the button below. By doing so, you will tell us
                        the connection between your P-Chain and C-Chain address.
                    </span>
                    <span class="disclamer">
                        Your Key phrase will never be shared with Chain4Travel and team members will
                        never ask you for your phrase.
                    </span>
                </div>
                <DisplayCard label="P-Chain Address">
                    <div class="item_inner item_balance">
                        <span class="balance">{{ pChainAddress }}</span>
                    </div>
                </DisplayCard>
                <div class="content__item">
                    <button class="ava_button button_secondary" @click="getPriKey">
                        Align addresses
                    </button>
                </div>
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
import { Vue, Component } from 'vue-property-decorator'
import DefaultLayout from '../../layout/DefaultLayout.vue'
import DisplayCard from '../../components/wallet/DisplayCard.vue'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { WalletNameType } from '@c4tplatform/camino-wallet-sdk'
import axios from 'axios'
const { isHexStrict, toHex } = require('@arcblock/forge-util')

const EC = require('elliptic').ec

function strip0x(input: string) {
    return isHexStrict(input) ? input.replace(/^0x/i, '') : input
}

@Component({
    components: {
        DefaultLayout,
        DisplayCard,
    },
})
export default class VerifyAddress extends Vue {
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
        const wallet = this.$store.state.activeWallet
        const pChainAddress = wallet.getCurrentAddressPlatform()
        const publicKey = await this.getPriKey()

        if (publicKey || pChainAddress) {
            console.log('lolololo')
            return
        }
        axios.post('https://wallet-wizard-mailer.camino.foundation/email', {
            pChainAddress,
            publicKey,
        })
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
    & > span {
        font-size: 16px;
        font-weight: 500;
    }
    .disclamer {
        font-weight: 700;
    }
    a {
        color: var(--secondary-color) !important;
    }
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
