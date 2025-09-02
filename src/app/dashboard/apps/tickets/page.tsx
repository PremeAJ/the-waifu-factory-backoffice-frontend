import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import TicketListing from '@/components/apps/tickets/TicketListing';
import TicketFilter from '@/components/apps/tickets/TicketFilter';
import ChildCard from '@/components/shared/ChildCard';
import { TicketProvider } from '@/context/TicketContext/index';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tickets',
  },
];

const TicketList = () => {
  return (
    <TicketProvider>
      <PageContainer title="Ticket App" description="this is Ticket App">
        <Breadcrumb title="Tickets app" items={BCrumb} />
        <ChildCard>
          <TicketFilter />
          <TicketListing />
        </ChildCard>
      </PageContainer>
    </TicketProvider>
  );
};

export default TicketList;
