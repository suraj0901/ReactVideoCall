import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const IncommingCallDialog = ({ open, handleDecline, answerCall, callerId }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incomming Call</DialogTitle>
          <DialogDescription>Caller Id {callerId}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" variant="ghost" onClick={handleDecline}>
            Decline
          </Button>
          <Button type="submit" onClick={answerCall}>
            Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default IncommingCallDialog;
