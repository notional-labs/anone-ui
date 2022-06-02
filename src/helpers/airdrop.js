import axios from "axios";

const api = process.env.REACT_APP_API;

export const getClaimRecord = async (address) => {
  const URL = `${api}/anone/claim/claim_record/${address}`;
  
  try {
    const res = await axios.get(URL);
    const claimRecord = res.data.claim_record;

    let claimableAmount = 0;
    let actionCompleted = claimRecord.action_completed;

    claimableAmount = claimRecord.initial_claimable_amount[0].amount / 10 ** 12;
    return [claimableAmount, actionCompleted];
  } catch (error) {
    return [0, []];
  }
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
