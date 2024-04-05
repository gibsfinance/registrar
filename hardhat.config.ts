import { HardhatUserConfig } from "hardhat/config";
import '@nomicfoundation/hardhat-foundry'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-dependency-compiler'
import 'solidity-coverage'

Error.stackTraceLimit = Infinity

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: "0.8.24",
      settings: {
        viaIR: true,
      },
    }]
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
  },
  typechain: {
    outDir: './artifacts/types',
    target: 'ethers-v6',
  },
  dependencyCompiler: {
    paths: [
      '@pulsechain/multicaller/src/MulticallerWithSigner.sol',
      '@pulsechain/multicaller/src/LibMulticaller.sol',
    ],
  },
};

export default config;
