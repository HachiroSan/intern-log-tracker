import Confetti from "react-confetti";
import { Card, CardContent } from "../ui/card";
import { PartyPopper } from "lucide-react";

export default function CongratsBanner() {
  return (
    <>
      <Confetti
        recycle={false}
        numberOfPieces={1000}
        gravity={0.05}
        tweenDuration={30000}
        colors={["#FF7F50", "#FF6EC7", "#FFD700", "#7FFF00", "#00BFFF"]}
      />
      <Card className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white overflow-hidden">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p>You&apos;ve completed your internship. Great job!</p>
          </div>
          <PartyPopper className="w-12 h-12 animate-party-popper" />
        </CardContent>
      </Card>
    </>
  );
}
