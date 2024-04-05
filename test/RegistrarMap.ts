import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import { setup } from './utils'

describe("RegistrarMap", function () {
  describe("Deployment", function () {
    it("should have set the lib", async function () {
      const s = await loadFixture(setup)
      await expect(s.multicallerWithSigner.getAddress()).eventually.to.equal(await s.map.MULTICALLER_WITH_SIGNER())
    })
  })
  describe('storage', () => {
    describe('create', () => {
      it('should store a claim in the last array slot', async () => {
        const s = await loadFixture(setup)
        await expect(s.map.createClaim(s.key, s.b))
          .to.emit(s.map, 'ClaimUpdated')
          .withArgs(await s.s1.getAddress(), s.key)
      })
      it('should not set anything if no data is presented', async () => {
        const s = await loadFixture(setup)
        await expect(s.map.createClaim(s.key, s.a))
          .not.to.emit(s.map, 'ClaimUpdated')
      })
      it('should return zero bytes if no claim is set', async () => {
        const s = await loadFixture(setup)
        await expect(s.map.claims(s.s1.getAddress(), s.key))
          .eventually.to.equal(s.a)
        await s.map.createClaim(s.key, s.b)
        await expect(s.map.claims(s.s1.getAddress(), s.key))
          .eventually.to.equal(s.b)
      })
      it('should not update a claim if create is called', async () => {
        const s = await loadFixture(setup)
        await s.map.createClaim(s.key, s.b)
        await expect(s.map.createClaim(s.key, s.c))
          .not.to.emit(s.map, 'ClaimUpdated')
      })
      it('should update a claim', async () => {
        const s = await loadFixture(setup)
        await expect(s.map.updateClaim(s.key, s.b))
          .to.emit(s.map, 'ClaimUpdated')
          .withArgs(await s.s1.getAddress(), s.key)
        await expect(s.map.updateClaim(s.key, s.c))
          .to.emit(s.map, 'ClaimUpdated')
          .withArgs(await s.s1.getAddress(), s.key)
      })
    })
  })
})
