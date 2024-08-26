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

  const form = useForm<z.infer<typeof betSchema>>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      amount: "0",
      choice: "Heads",
    },
  });

  const connectWallet = async () => {
    setIsLoading(true);
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
    choice: "Heads" | "Tails",
    coinSide: number
  ) => {
    setIsLoading(true);

    let _choice;

    if (choice === "Heads") {
      _choice = 1;
    } else {
      _choice = 0;
    }

    const weiAmount = ethers.parseUnits(betAmount, "ether");

    try {
      if (contract) {
        const tx = await contract.placeBet(weiAmount, _choice, coinSide, {
          value: weiAmount,
          gasPrice: 20000000,
          gasLimit: 20000000000,
        });
        // console.log("tX: ", tx);
        await tx.wait();

        // const txr = await tx.wait();
        // console.log("tXr: ", txr);
      } else {
        await connectWallet();

        const tx = await contract!.placeBet(weiAmount, _choice, coinSide, {
          value: weiAmount,
          gasPrice: 20000000,
          gasLimit: 20000000000,
        });
        await tx.wait();

        // console.log("tx: ", tx);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
    }

    setIsLoading(false);
  };

  async function onSubmit(values: z.infer<typeof betSchema>) {
    if (!isConnected) {
      await connectWallet();
    }

    const randomBinary = Math.floor(Math.random() * 2);
    setCoinSide(randomBinary);

    await placeBet(values.amount, values.choice, randomBinary);
  }
  return (
    <div className="flex flex-col items-center">
      <CoinFlipping
        isLoading={isConnected && isLoading}
        tossedSide={coinSide!}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-10 space-y-3 text-flip-text-primary"
        >
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

          {isConnected ? (
            <Button
              className="w-full bg-neutral-300 hover:bg-neutral-200 text-black font-medium"
              type="submit"
            >
              {isLoading ? <MoonLoader size={20} /> : "Bet"}
            </Button>
          ) : (
            <Button
              className="w-full bg-neutral-300 hover:bg-neutral-200 text-black font-medium"
              type="button"
              onClick={connectWallet}
            >
              {isLoading ? <MoonLoader size={20} /> : "Connect Wallet"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BetForm;
