import { HardhatRuntimeEnvironment } from "hardhat/types"

export const multicallerWithSigner = new Map<number, string>([
  [1, '0x000000000000D9ECebf3C23529de49815Dac1c4c'],
])

export const getMulticallerWithSigner = (hre: HardhatRuntimeEnvironment) => {
  const chainId = hre.network.config.chainId
  const known = multicallerWithSigner.get(chainId as number)
  if (known) {
    return known
  }
  return null
}