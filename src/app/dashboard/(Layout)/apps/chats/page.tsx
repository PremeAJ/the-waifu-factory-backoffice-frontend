import React from "react";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import AppCard from "@/components/shared/AppCard";
import ChatsApp from "@/components/apps/chats";
import { ChatProvider } from '@/context/ChatContext/index'
const Chats = () => {
  return (
    <ChatProvider>
      <PageContainer title="Chat" description="this is Chat">
        <Breadcrumb title="Chat app" subtitle="Messenger" />
        <AppCard>
          <ChatsApp />
        </AppCard>
      </PageContainer>
    </ChatProvider>
  );
};

export default Chats;
