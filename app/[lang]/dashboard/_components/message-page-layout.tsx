import { Grid } from "@radix-ui/themes";
import ChatActions from "./chat-actions";
import Chats from "./chats";
import MessageForm from "./message-form";
import Messages from "./messages";

export default function MessagePageLayout() {
  return (
    <Grid columns="300px 1fr" className="h-[calc(100dvh-115px)] border">
      <Chats />
      <Grid columns="1" rows="80px 1fr 80px" className="h-[calc(100dvh-115px)]">
        <ChatActions />
        <Messages />
        <MessageForm />
      </Grid>
    </Grid>
  );
}
