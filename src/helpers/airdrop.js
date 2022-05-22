import axios from "axios";

const api = "http://65.21.232.185:2283";

export const getClaimRecord = async (address) => {
  const URL = `${api}/anone/claim/claim_record/${address}`;
  const res = await axios.get(URL);
  const claimRecord = res.data.claim_record;
  const claimableAmount =
    claimRecord.initial_claimable_amount[0].amount / 10 ** 12;
  return [claimableAmount, claimRecord.action_completed];
};

export const getClaimableForAction = async (address, action) => {
  const URL = `${api}/anone/claim/claimable_for_action/${address}/${action}`;
  try {
    const res = await axios.get(URL);
    if (res.data.coins) {
      const claimable = res.data.coins;
      if (claimable.length) return claimable[0].amount / 10 ** 12;
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

export const ACTION = {
  bid: "ActionBidNFT",
  mint: "ActionMintNFT",
  vote: "ActionVote",
  stake: "ActionDelegateStake",
  claim: "ActionInitialClaim",
};
