import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"

export type Web3Api = {
  web3: Web3 | null
  provider: any
  contract: any
  isProviderLoaded?: boolean
}

export enum Contracts {
  Faucet = "Faucet",
}

export const accountListener = (provider: any) => {
  provider.on("accountsChanged", () => window.location.reload())
  provider.on("chainChanged", () => window.location.reload())
}

export const loadContract = async (name: string, provider: Web3) => {
  const currentNetworkId = await provider.eth.net.getId()

  const res = await fetch(`/contracts/${name}.json`)
  const Artifact = await res.json()

  if (Artifact.networks[currentNetworkId]) {
    const contract = new provider.eth.Contract(
      Artifact.abi,
      Artifact.networks[currentNetworkId].address
    )
    return contract
  } else {
    console.error("Connected to wrong network, couldn't load contract")
    return Promise.reject(`Contract: [${name}] cannot be loaded!`)
  }
}

export const loadProvider = async (setter: React.Dispatch<Web3Api>) => {
  const provider = (await detectEthereumProvider()) as any

  if (provider) {
    accountListener(provider)
    const web3 = new Web3(provider)
    let contract = null
    try {
      contract = await loadContract(Contracts.Faucet, web3)
    } catch (error) {}
    setter({
      web3,
      provider,
      contract,
      isProviderLoaded: true,
    })
  } else {
    // if the provider is not detected, detectEthereumProvider resolves to null

    //@ts-ignore
    setter((api: any) => ({ ...api, isProviderLoaded: true }))
    console.error("Please install MetaMask!")
  }
}

export const getAccount = async (
  web3: Web3Api["web3"],
  setter: React.Dispatch<string>
) => {
  if (web3 !== null) {
    const accounts = await web3.eth.getAccounts()
    setter(accounts[0])
  }
}

export const loadBalance = async (
  web3Api: Web3Api,
  setter: React.Dispatch<string>
) => {
  const { contract, web3 } = web3Api
  const balance = await web3?.eth.getBalance(contract.options.address)

  if (balance !== undefined && web3 !== null) {
    setter(web3?.utils.fromWei(balance, "ether"))
  }
}
