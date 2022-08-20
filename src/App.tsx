import React, { useCallback, useEffect, useState } from "react"
import { loadProvider, getAccount, loadBalance, Web3Api } from "./utils/web3"

function App() {
  const [web3Api, setWeb3Api] = useState<Web3Api>({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,
  })
  const [account, setAccount] = useState<string>("")
  const [balance, setBalance] = useState<string>("")
  const [shouldReload, reload] = useState<boolean>(false)

  const isContractLoaded: boolean = account && web3Api.contract
  const reloadEffect = useCallback(() => {
    reload(!shouldReload)
  }, [shouldReload])

  useEffect(() => {
    loadProvider(setWeb3Api)
  }, [])

  useEffect(() => {
    web3Api.web3 && getAccount(web3Api.web3, setAccount)
  }, [web3Api.web3])

  useEffect(() => {
    web3Api.contract && loadBalance(web3Api, setBalance)
  }, [web3Api, shouldReload])

  const connectToMetamask = () => {
    web3Api.provider.request({
      method: "eth_requestAccounts",
    })
  }

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.methods.addFunds().send({
      from: account,
      value: web3?.utils.toWei("1", "ether"),
    })
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  const withdrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3?.utils.toWei("0.1", "ether")
    await contract.methods.withdraw(withdrawAmount).send({
      from: account,
    })
    reloadEffect()
  }, [web3Api, account, reloadEffect])

  return (
    <div className="">
      <>
        {web3Api.isProviderLoaded ? (
          <div className="">
            <p className="">
              Account :{" "}
              {account ? (
                account
              ) : !web3Api.provider ? (
                <>
                  {" "}
                  Wallet not detected, please{" "}
                  <a
                    href="https://metamask.io/"
                    target="_blank"
                    rel="noopener, noreferrer"
                  >
                    Install Metamask
                  </a>{" "}
                </>
              ) : (
                <button onClick={connectToMetamask}>
                  {" "}
                  Connect to metamask
                </button>
              )}
            </p>
          </div>
        ) : (
          "Loading provider..."
        )}
        <div>Balance : {balance ? `${balance} Eth` : "N/A"}</div>
        {!isContractLoaded && "Connect to Ganache"}
      </>
      <div>
        <button disabled={!isContractLoaded} onClick={addFunds}>
          Donate 1 ether
        </button>
        <button disabled={!isContractLoaded} onClick={withdrawFunds}>
          Withdraw 0.1 ether
        </button>
      </div>
    </div>
  )
}

export default App
