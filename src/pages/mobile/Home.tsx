import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, BarChart } from 'lucide-react';
import { MobileLayout } from '@/components/ui/styled/navigation';
import { Card, CardButton } from '@/components/ui/styled/cards';
import { Flex, Grid } from '@/components/ui/styled/containers';
import { Text } from '@/components/ui/styled/typography';
import { useStyledTheme } from '@/components/ui/styled/theme-context';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <MobileLayout title="SuiteSync Home">
      <Flex direction="column" gap={6}>
        <Card title="Welcome to SuiteSync" subtitle="Your service scheduling solution">
          <Text variant="body">
            Manage your appointments, services, and customer relationships all in one place.
          </Text>
        </Card>

        <Grid columns={2} gap={4}>
          <CardButton
            icon={<Calendar />}
            label="Appointments"
            onClick={() => navigate('/mobile/appointments')}
          />
          
          <CardButton
            icon={<Clock />}
            label="Schedule"
            onClick={() => navigate('/mobile/schedule')}
          />
          
          <CardButton
            icon={<Users />}
            label="Clients"
            onClick={() => navigate('/mobile/clients')}
          />
          
          <CardButton
            icon={<BarChart />}
            label="Analytics"
            onClick={() => navigate('/mobile/analytics')}
          />
        </Grid>
      </Flex>
    </MobileLayout>
  );
};

export default Home;
