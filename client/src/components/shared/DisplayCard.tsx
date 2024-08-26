import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayCarrdProps } from "@/lib/types";

const DisplayCard = ({ desription, children }: DisplayCarrdProps) => {
  return (
    <Card className="flex flex-col items-center bg-neutral-50 dark:bg-[#0a0a0a] border dark:border-flip-border border-neutral-300 shadow-none glass w-[25rem]">
      <CardHeader>
        <CardTitle className="font-bold text-md dark:text-flip-text-primary text-neutral-800">
          {desription}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DisplayCard;
