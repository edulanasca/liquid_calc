"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const tokens = {
    SOL: "So11111111111111111111111111111111111111112",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    UXD: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    mSOL: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    bSOL: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
    jitoSOL: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"
};
const validateInput = (input, message) => {
    if (input == undefined)
        throw new Error(message);
    return input;
};
const inputMint = tokens[validateInput(process.argv[2], "Invalid input")];
const outputMint = tokens[validateInput(process.argv[3], "Invalid output")];
const amount = validateInput(process.argv[4], "Invalid amount");
const tokenMetadata = () => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get("https://api.helius.xyz/v0/token-metadata", {});
});
const buyDirectRoute = () => {
};
const buySolAndStake = () => {
};
