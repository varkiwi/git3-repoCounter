const ethers = require('ethers');
const fs = require('fs');

// Mumbai Testnet information!
const gitFacotryAddress = '0x5545fc8e2cc3815e351E37C6F2f372e2A878E364';
const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/v1/f632570838c8d7c5e5c508c6f24a0e23eabac8c7');

const gitFactoryJson = JSON.parse(fs.readFileSync('./artifacts/contracts/GitFactory.sol/GitFactory.json', 'utf8'));
const gitFacotryAbi = gitFactoryJson.abi;
const gitFactory = new ethers.Contract(gitFacotryAddress, gitFacotryAbi, provider);

async function main() {
    let numberOfRepositories = 0;
    let uniqueUsers = new Set();
    gitFactory.getRepositoryNames()
    .then(async (repos) => {
        numberOfRepositories = repos.length;
        console.log(`Number of repositories: ${numberOfRepositories}`);
        console.log('Checking users...');
        let counter = 1;
        for (let repo of repos) {
            console.log(`${counter} \\ ${numberOfRepositories}`);
            let users = await gitFactory.getRepositoriesUserList(repo)
            for (let user of users) {
                uniqueUsers.add(user);
            }
            counter += 1;
        }
        
        console.log(`Number of unique users: ${uniqueUsers.size}`);
    })
}

main()
