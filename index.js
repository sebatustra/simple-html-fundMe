import {ethers} from "./ethers-5.6.esm.min.js";
import {abi, contractAddress} from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton  = document.getElementById("fundButton");
const balanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdraw");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;


async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider)
        } catch(e) {
            console.log(e)
        }

    } else {
        console.log("withdraw(): not connected")
    }
}


async function connect() {
    if (typeof window.ethereum !== "undefined"){

        await ethereum.request({method: "eth_requestAccounts"});

        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = "Please install metamask!";
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress)
        console.log("balance: ", ethers.utils.formatEther(balance))

    } else {
        console.log("getBalance: not connected")
    }
}


// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`);
    if (typeof window.ethereum !== "undefined"){
        /* This needed to send funds:
        provider / connection to the blockchain
        signer / wallet / someone wtih some gas
        abi and address
        */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done")
        } catch(e) {
            console.error(e)
        }


    } else {
        fundButton.innerHTML="Please install metamask"
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`completed with ${transactionReceipt.confirmations}`)
            resolve()
        })
    })
}


// withdraw function
