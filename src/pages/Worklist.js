import * as React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { Container, Grid, Paper, Box, Button, Tabs, Tab, TextField } from '@mui/material';
import Title from '../dashboard/Title';
import Orders from '../dashboard/Orders';
import { useNavigate } from 'react-router-dom';

export default function Worklist() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuth(); // Access the authenticated user information

  const { data, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3500/report');
      console.log(response.data);
      return response.data;
    },
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // const handleCreateStudy = () => {
  //   navigate('/create-study/add-scan');
  // };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredData = data?.filter(report => {
    if (tabValue === 0) {
      return report.status === 'N/A';
    } else {
      return report.status === 'draft' && (report?.description?.doctor_information.fullname === auth?.doctor_information?.fullname || report.description?.doctor_information?.id === auth?.doctor_information?.id );
    }
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Title>Исследования</Title>
            </Box>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="worklist tabs">
              <Tab label="Новые" />
              <Tab label="В процессе" />
            </Tabs>
            <Orders
              data={filteredData}
              onSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
