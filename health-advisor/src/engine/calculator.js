import { calcRealPremium } from "../data/premiumRates"

export function calcPremium(policy, profile) {
  return calcRealPremium(policy, profile)
}

export function getSegment(profile) {
  if (profile.isStudent) return "student"
  if (profile.age >= 60) return "senior"
  if (profile.members >= 3 || profile.hasChildren) return "family"
  if (profile.members === 2) return "couple"
  return "young_professional"
}
