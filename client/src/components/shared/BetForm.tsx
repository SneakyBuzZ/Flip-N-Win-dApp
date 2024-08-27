import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { betSchema } from "@/lib/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ethers } from "ethers";
import { useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { CONTRACT_ABI } from "@/lib/constants";
import CoinFlipping from "./CoinFlipping";
import { MoonLoader } from "react-spinners";
import { confettiFunction } from "@/lib/utils";

import SparklesText from "@/components/magicui/sparkles-text";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const BetForm = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<null | ethers.Contract>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coinSide, setCoinSide] = useState<number>(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [showWinningText, setShowWinningText] = useState<boolean>(false);
  const [showLoosingText, setShowLoosingText] = useState(false);

  const form = useForm<z.infer<typeof betSchema>>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      amount: "0",
      choice: "Heads",
    },
  });

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      setIsConnected(true);

      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS!,
        CONTRACT_ABI,
        signer
      );
      setContract(contract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
    setIsLoading(false);
  };

  const placeBet = async (
    betAmount: string,
    choice: number,
    coinSide: number
  ): Promise<boolean | undefined> => {
    setIsLoading(true);

    const weiAmount = ethers.parseUnits(betAmount, "ether");

    try {
      if (contract) {
        const tx = await contract.placeBet(weiAmount, choice, coinSide, {
          value: weiAmount,
          gasPrice: 20000000,
          gasLimit: 20000000000,
        });
        // console.log("tX: ", tx);
        await tx.wait();

        // const txr = await tx.wait();
        // console.log("tXr: ", txr);

        return true;
      } else {
        await connectWallet();

        const tx = await contract!.placeBet(weiAmount, choice, coinSide, {
          value: weiAmount,
          gasPrice: 20000000,
          gasLimit: 20000000000,
        });
        await tx.wait();

        // console.log("tx: ", tx);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      return false;
    }
  };

  async function onSubmit(values: z.infer<typeof betSchema>) {
    setIsLoading(true);

    if (values.choice === "Heads") {
      setChoice(1);
    } else {
      setChoice(0);
    }

    if (!isConnected) {
      await connectWallet();
    }

    const randomBinary = Math.floor(Math.random() * 2);
    setCoinSide(randomBinary);

    if (choice !== null) {
      const response = await placeBet(values.amount, choice, randomBinary);

      if (response) {
        if (randomBinary === choice) {
          setShowWinningText(true);
          confettiFunction();
        } else {
          setShowLoosingText(true);
        }
      } else {
        alert("Something went wrong");
      }
    }

    setIsLoading(false);
  }

  const reset = () => {
    setIsLoading(false);
    setShowWinningText(false);
    setChoice(null);
    setShowLoosingText(false);
  };
  return (
    <div className="flex flex-col items-center">
      {showWinningText ? (
        <>
          <SparklesText className="text-3xl w-1/2" text="Congrats! You won!" />
        </>
      ) : (
        <>
          <CoinFlipping
            isLoading={isConnected && isLoading}
            tossedSide={coinSide!}
          />
        </>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-10 space-y-3 text-flip-text-primary"
        >
          {!showWinningText && (
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Input
                        disabled={!isConnected}
                        type="number"
                        placeholder="amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="choice"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isConnected}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a side" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          className=" hover:bg-yellow-400 hover:text-black"
                          value="Heads"
                        >
                          Heads
                        </SelectItem>
                        <SelectItem
                          className=" hover:bg-yellow-400 hover:text-black"
                          value="Tails"
                        >
                          Tails
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {isConnected ? (
            <>
              {showWinningText ? (
                <Button
                  onClick={reset}
                  type="button"
                  className=" w-40 dark:bg-neutral-300 bg-neutral-800 dark:hover:bg-neutral-400 hover:bg-neutral-700 dark:text-black text-neutral-200 font-medium"
                >
                  Bet Again
                </Button>
              ) : (
                <Button
                  className="w-full dark:bg-neutral-300 bg-neutral-800 dark:hover:bg-neutral-400 hover:bg-neutral-700 dark:text-black text-neutral-200 font-medium"
                  type="submit"
                >
                  {isLoading ? (
                    <MoonLoader size={20} color="#FFFF00" />
                  ) : (
                    <>{showLoosingText ? "Oops! Try Again" : "Bet"}</>
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button
              className="w-full dark:bg-neutral-300 bg-neutral-800 dark:hover:bg-neutral-400 hover:bg-neutral-700 dark:text-black text-neutral-200 font-medium"
              type="button"
              onClick={connectWallet}
            >
              {isLoading ? (
                <MoonLoader size={20} color="#FFFF00" />
              ) : (
                "Connect Wallet"
              )}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BetForm;
