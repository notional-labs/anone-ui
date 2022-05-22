/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import checkIcon from "../assets/img/check.png";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Image } from "antd";
import {
  ACTION,
  getClaimableForAction,
  getClaimRecord,
} from "../helpers/airdrop";
import { Link } from "react-router-dom";

const style = {
  container: {
    padding: 70,
    paddingTop: "7em",
    color: "#ffffff",
    fontFamily: "montserrat",
  },
  progressBar: {
    backgroundColor: "#ffffff",
    color: "#ffffff",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
  },
  progress: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
    fontWeight: "bold",
  },
  infoRow: {
    margin: "30px 0",
    display: "flex",
    justifyContent: "space-between",
  },
  info: {
    display: "flex",
    border: "1px solid red",
    borderColor: "hsla(0,0%,100%,.1)",
    borderWidth: "0.5px",
    borderRadius: "5px",
    flexDirection: "column",
    maxWidth: "24%",
    textAlign: "start",
    fontSize: "20px",
  },
  infoTitle: {
    color: "hsla(0,0%,100%,.8)",
  },
  infoValue: {
    fontWeight: "bold",
  },
  title: {
    textAlign: "left",
    fontSize: "30px",
    color: "#ffffff",
    fontWeight: "bold",
    margin: "30px 0",
  },
  mission: {
    display: "flex",
    border: "1px solid red",
    borderColor: "hsla(0,0%,100%,.1)",
    borderWidth: "0.5px",
    borderRadius: "5px",
    flexDirection: "column",
    textAlign: "start",
    fontSize: "20px",
    marginBottom: "12px",
    padding: "12px",
  },
};

const containers = [
  // { title: "Claimed", value: "100%" },
  { title: "Staking APR", value: "--%" },
  { title: "YPR", value: "--%" },
  { title: "ABC APR", value: "--%" },
];

const missionContainer = ({
  title,
  description,
  action,
  isSuccess,
  claimeble,
  isClaimable,
}) => (
  <div key={title} style={style.mission}>
    <div style={style.infoTitle}>{ACTION_TITLE[action]}</div>

    <div style={style.row}>
      <div style={style.infoValue}>
        {isClaimable ? `Claimable: ${claimeble}` : `Claimed`}
      </div>
      {isSuccess ? (
        <>
          {isClaimable ? (
            actionButton("claim")
          ) : (
            <Image width={30} src={checkIcon} preview={false} />
          )}
        </>
      ) : (
        actionButton(action)
      )}
    </div>
  </div>
);

const actionButton = (action) => (
  <Link to={`/${ACTION_REDIRECT[action]}`}>
    <button
      style={{
        backgroundColor: "#198754",
        border: "none",
        borderRadius: "10px",
        padding: "0.5em",
        fontSize: "15px",
        fontWeight: 700,
        height: "40px",
        boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.25)",
        cursor: "pointer",
        width: "80px",
        color: "#ffffff",
      }}
    >
      {action.toUpperCase()}
    </button>
  </Link>
);

const infoContainer = ({ title, value }) => (
  <Col key={title} style={style.info}>
    <div style={style.infoTitle}>{title}</div>
    <div style={style.infoValue}>{value}</div>
  </Col>
);

const ACTION_TITLE = {
  initClaim: "Init Claim",
  bid: "Bid an NFT",
  mint: "Mint an NFT",
  vote: "Vote for a proposals",
  stake: "Stake",
};

const ACTION_REDIRECT = {
  initClaim: "Init Claim",
  bid: "",
  mint: "",
  vote: "proposals",
  stake: "staking",
};

const initMissionInfo = {
  title: "",
  description: "",
  action: "",
  isSuccess: false,
  isClaimable: false,
  claimeble: 0,
};

const Airdrop = ({ accounts }) => {
  const [progress, setProgress] = useState();
  const [claimableAmount, setClaimableAmount] = useState();
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionBid, setActionBid] = useState({
    ...initMissionInfo,
    action: "bid",
  });
  const [actionInitClaim, setActionInitClaim] = useState({
    ...initMissionInfo,
    action: "initClaim",
  });
  const [actionMint, setActionMint] = useState({
    ...initMissionInfo,
    action: "mint",
  });
  const [actionVote, setActionVote] = useState({
    ...initMissionInfo,
    action: "vote",
  });
  const [actionStake, setActionStake] = useState({
    ...initMissionInfo,
    action: "stake",
  });
  const address = accounts[0].account.address;

  const getAddressClaimRecord = async (address) => {
    const [_claimableAmount, _actionCompleted] = await getClaimRecord(address);
    setClaimableAmount(_claimableAmount);

    const totalFinishMissions = _actionCompleted.filter(
      (action) => action
    ).length;

    const resInitClaim = await getClaimableForAction(address, ACTION.claim);
    setActionInitClaim({
      ...actionInitClaim,
      isClaimable: resInitClaim > 0,
      claimeble: resInitClaim,
      isSuccess: _actionCompleted[0],
    });
    const resBid = await getClaimableForAction(address, ACTION.bid);
    setActionBid({
      ...actionBid,
      isClaimable: resBid > 0,
      claimeble: resBid,
      isSuccess: _actionCompleted[0],
    });
    const resMint = await getClaimableForAction(address, ACTION.mint);
    setActionMint({
      ...actionMint,
      isClaimable: resMint > 0,
      claimeble: resMint,
      isSuccess: _actionCompleted[1],
    });
    const resVote = await getClaimableForAction(address, ACTION.vote);
    setActionVote({
      ...actionVote,
      isClaimable: resVote > 0,
      claimeble: resVote,
      isSuccess: _actionCompleted[2],
    });
    const resStake = await getClaimableForAction(address, ACTION.stake);
    setActionStake({
      ...actionStake,
      isClaimable: resStake > 0,
      claimeble: resStake,
      isSuccess: _actionCompleted[3],
    });
    console.log(resBid, resMint, resInitClaim, resStake, resVote);
    setTotalClaimed(
      Math.round(
        (_claimableAmount -
          resBid -
          resMint -
          resInitClaim -
          resStake -
          resVote) *
          10
      ) / 10
    );

    setProgress((100 * totalFinishMissions) / _actionCompleted.length);
  };

  const getAction = async () => {};

  useEffect(() => {
    (async () => {
      await getAddressClaimRecord(address);
      await getAction();
      setIsLoading(false);
    })();
  }, [address]);

  return (
    <div style={style.container}>
      <div
        style={{
          textAlign: "left",
          fontSize: "36px",
          color: "#ffffff",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Airdrop
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          <ClipLoader
            style={{ marginTop: "5em" }}
            color={"#f0a848"}
            loading={isLoading}
          />
        </div>
      ) : (
        <>
          <div style={style.progress}>
            <span>Your Progress</span>
            <span>{progress}%</span>
          </div>

          <ProgressBar variant="success" now={progress} />

          <Row style={style.infoRow}>
            {infoContainer({
              title: "Claimed",
              value: `${totalClaimed}/${claimableAmount} AN1`,
            })}
            {containers.map((container) => infoContainer(container))}
          </Row>

          <div style={style.title}>My missions</div>
          {/* {missionContainer(actionBid)} */}
          {missionContainer(actionInitClaim)}
          {missionContainer(actionMint)}
          {missionContainer(actionStake)}
          {missionContainer(actionVote)}
        </>
      )}
    </div>
  );
};

export default Airdrop;
