import React, { useState } from 'react';
import ClinicSearchBar from '../components/Clinicsearch/ClinicSearchBar';
import LocationTab from '../components/Locationtab/LocationTab';
import Layout from '../components/Layout/Layout';

const Clinic = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <Layout>
            <ClinicSearchBar onSearch={handleSearch} />
            <LocationTab searchQuery={searchQuery} />
        </Layout>
    );
};

export default Clinic;
