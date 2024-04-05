import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { setup } from './utils'

describe("RegistrarList", function () {
  describe("Deployment", function () {
    it("should have set the lib", async function () {
      const s = await loadFixture(setup)
      await expect(s.multicallerWithSigner.getAddress()).eventually.to.equal(await s.list.MULTICALLER_WITH_SIGNER())
    })
  })
  describe('storage', () => {
    describe('create', () => {
      it('should store a claim in the last array slot', async () => {
        const s = await loadFixture(setup)
        await expect(s.list.createClaim(s.key, s.b))
          .to.emit(s.list, 'ClaimUpdated')
          .withArgs(await s.s1.getAddress(), s.key)
      })
      it('should not set anything if no data is presented', async () => {
        const s = await loadFixture(setup)
        await expect(s.list.createClaim(s.key, s.a))
          .not.to.emit(s.list, 'ClaimUpdated')
      })
      it('should make claims available at the latest method', async () => {
        const s = await loadFixture(setup)
        await s.list.createClaim(s.key, s.b)
        await expect(s.list.latest(s.s1.getAddress(), s.key))
          .eventually.to.equal(s.b)
      })
      it('should return zero bytes if no claim is set', async () => {
        const s = await loadFixture(setup)
        await expect(s.list.latest(s.s1.getAddress(), s.key))
          .eventually.to.equal(s.a)
        await s.list.createClaim(s.key, s.b)
        await expect(s.list.latest(s.s1.getAddress(), s.key))
          .eventually.to.equal(s.b)
      })
      it('should not update a claim if create is called', async () => {
        const s = await loadFixture(setup)
        await s.list.createClaim(s.key, s.b)
        await expect(s.list.createClaim(s.key, s.c))
          .not.to.emit(s.list, 'ClaimUpdated')
      })
      it('should update a claim', async () => {
        const s = await loadFixture(setup)
        await expect(s.list.updateClaim(s.key, s.b))
          .to.emit(s.list, 'ClaimUpdated')
          .withArgs(await s.s1.getAddress(), s.key)
        await expect(s.list.updateClaim(s.key, s.c))
          .to.emit(s.list, 'ClaimUpdated')
          .withArgs(await s.s1.getAddress(), s.key)
      })
      it('should preserve the historical data', async () => {
        const s = await loadFixture(setup)
        await s.list.updateClaim(s.key, s.b)
        await s.list.updateClaim(s.key, s.c)
        await expect(s.list.lists(s.s1.getAddress(), s.key, 0))
          .eventually.to.equal(s.b)
        await expect(s.list.lists(s.s1.getAddress(), s.key, 1))
          .eventually.to.equal(s.c)
      })
      it('should know the length at any given time', async () => {
        const s = await loadFixture(setup)
        await expect(s.list.length(s.s1.getAddress(), s.key)).eventually.to.equal(0)
        await s.list.updateClaim(s.key, s.b)
        await expect(s.list.length(s.s1.getAddress(), s.key)).eventually.to.equal(1)
        await s.list.updateClaim(s.key, s.c)
        await expect(s.list.length(s.s1.getAddress(), s.key)).eventually.to.equal(2)
      })
      it('should know the size of the data at any given index', async () => {
        const s = await loadFixture(setup)
        await expect(s.list.claimSizeAt(s.s1.getAddress(), s.key, 0))
          .to.revertedWithPanic(0x32)
        await s.list.updateClaim(s.key, s.b)
        await expect(s.list.claimSizeAt(s.s1.getAddress(), s.key, 0)).eventually.to.equal(1)
        await s.list.updateClaim(s.key, s.c)
        await expect(s.list.claimSizeAt(s.s1.getAddress(), s.key, 1)).eventually.to.equal(1)
      })
    })
  })
})
