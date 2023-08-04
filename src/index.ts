require("dotenv").config();

import axios from "axios";
import {Route} from "./types";

type TokenInfo = { mint: string, decimals: number };

const tokens: Record<string, TokenInfo> = {
  sol: {mint: "So11111111111111111111111111111111111111112", decimals: 9},
  usdc: {mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6},
  usdt: {mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6},
  uxd: {mint: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT", decimals: 6},
  msol: {mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", decimals: 9},
  bsol: {mint: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1", decimals: 9},
  jitosol: {mint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", decimals: 9}
}

const validateInput = (input, message) => {
  if (input == undefined) throw new Error(message);
  return input.toLowerCase();
}

const inputMint: TokenInfo = tokens[validateInput(process.argv[2], "Invalid input")];
const outputMint: TokenInfo = tokens[validateInput(process.argv[3], "Invalid output")];
const amount: number = Number.parseFloat(validateInput(process.argv[4], "Invalid amount"));
const paths: Record<string, number> = {};

const quoteUrl = (input: TokenInfo, output: TokenInfo, amount: number) =>
  `https://quote-api.jup.ag/v4/quote?inputMint=${input.mint}&outputMint=${output.mint}&amount=${amount * (10 ** input.decimals)}`;

const buyDirectRoute = async () => {
  try {
    const {data} = await axios.get<{
      data: Route[]
    }>(quoteUrl(inputMint, outputMint, amount));
    data.data.forEach((route, ix) => {
      const lstAmount = Number.parseInt(route.outAmount) / (10 ** outputMint.decimals);
      paths[`D${ix + 1}`] = lstAmount;
      console.log(`Option ${ix + 1} ${lstAmount}`);
    });

    //return data.data.marketInfos.map(info => info.outAmount);
  } catch (err) {
    console.log(err);
  }
}

const buySolAndStake = async () => {
  try {
    const {data: toSol} = await axios.get<{ data: Route[] }>(quoteUrl(inputMint, tokens["sol"], amount));
    switch (outputMint.mint) {
      case tokens["msol"].mint:
        const {data: mSOLPrice} = await axios.get<number>("https://api.marinade.finance/lp/price");
        toSol.data.forEach((route, ix) => {
          console.log(`Option ${ix + 1} ${(Number.parseInt(route.outAmount) / (10 ** tokens["sol"].decimals)) / mSOLPrice}`);
        });
        break;
      case tokens["bsol"].mint:
      case tokens["jitosol"].mint:
        toSol.data.forEach((route, ri) => {
          const solAmount = Number.parseInt(route.outAmount) / (10 ** tokens["sol"].decimals);
          axios.get<{
            data: Route[]
          }>(quoteUrl(tokens["sol"], outputMint, solAmount))
            .then(toLst => {
              console.log(`With ${solAmount} SOL`)
              toLst.data.data.forEach((info, ii) => {
                const lstAmount = Number.parseInt(info.outAmount) / (10 ** outputMint.decimals);
                paths[`R${ri + 1}${ii + 1}`] = lstAmount;
                console.log(`Option ${ii + 1} ${lstAmount}`);
              })
            });
        });
        break;
      default:
        console.log("LST not recognized")
        return;
    }
  } catch (err) {
    console.log(err);
  }
}

function findHighestNumber(obj: Record<string, number>): Record<string, any> {
  let highest: number = -1;
  let k: string = "";

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'number') {
        if (highest === -1 || value > highest) {
          highest = value;
          k = key;
        }
      }
    }
  }

  return {key: k, highest};
}

(async () => {
  console.log(`Buying directly in Jupiter`)
  await buyDirectRoute();

  console.log(`Buying SOL first and depositing in its respective page`)
  await buySolAndStake();

  const highest = findHighestNumber(paths);
  console.log(`Best route ${highest.key} with ${highest.highest}`)
})();