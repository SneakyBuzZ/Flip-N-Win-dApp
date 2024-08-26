import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayCarrdProps } from "@/lib/types";

const DisplayCard = ({ desription, children }: DisplayCarrdProps) => {
  return (
    <Card className="flex flex-col items-center bg-[#0a0a0a] border border-flip-border glass w-[25rem]">
      <CardHeader>
        <CardTitle className="font-bold text-md text-flip-text-primary">
          {desription}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DisplayCard;
