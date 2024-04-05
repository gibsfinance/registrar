import { MulticallerWithSigner } from "../artifacts/types"
import * as config from '../src/config'
import hre from "hardhat"

const getMulticallerWithSigner = async () => {
  let multicallerWithSigner!: MulticallerWithSigner
  const multicallerWithSignerAddress = config.getMulticallerWithSigner(hre)
  if (!multicallerWithSignerAddress) {
    const MulticallerWithSignerFactory = await hre.ethers.getContractFactory('MulticallerWithSigner')
    multicallerWithSigner = await MulticallerWithSignerFactory.deploy()
  } else {
    multicallerWithSigner = await hre.ethers.getContractAt('MulticallerWithSigner', multicallerWithSignerAddress)
  }
  return multicallerWithSigner
}

export async function setup() {
  const multicallerWithSigner = await getMulticallerWithSigner()
  const List = await hre.ethers.getContractFactory("RegistrarList")
  const Map = await hre.ethers.getContractFactory("RegistrarMap")
  const list = await List.deploy(multicallerWithSigner.getAddress())
  const map = await Map.deploy(multicallerWithSigner.getAddress())

  const a = '0x'
  const b = '0x00'
  const c = '0x01'
  const kBytes = hre.ethers.hexlify(hre.ethers.toBeArray(BigInt(Date.now())))
  const key = hre.ethers.zeroPadValue(kBytes, 32)
  const signers = await hre.ethers.getSigners()

  return {
    map, list,
    multicallerWithSigner,
    a, b, c,
    key,
    signers, s1: signers[0],
  }
}