import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import Select from 'react-select';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';
import { useSearchParams } from 'react-router-dom';

const EditBranch = () => {
    const [searchParms, setSerachParmes] = useSearchParams()
    const id = searchParms.get('id')

    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        RepresentedPersonName: '',
        RepresentedPersonContactNumber: '',
        RepresentedEmail: '',
        Ratings: '',
        OpensTime: '',
        CloseTime: '',
        ContactNumber: '',
        Doctors: [],
        Services: [],
        longitude: '',
        latitude: '',
        OfficeNo: '',
        Landmark: '',
        streetAddress: '',
        MapLocation: '',
        isSundayOff: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;


        if (name === 'Doctors' || name === 'Services') {
            const selectedOptions = JSON.parse(value);
            const values = selectedOptions.map(option => option.value);
            console.log(values)
            setFormData((prevData) => ({
                ...prevData,
                [name]: values, // Update state with only values
            }));
        } else {
            // Handle other inputs
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleFetchDetails = async () => {
        try {
            const { data } = await axios.get(`http://localhost:7000/api/v1/Doctors/Get-Single-Branch/${id}`)
            const preData = data.data
            if (preData) {
                setFormData({
                    RepresentedPersonName: preData?.RepresentedPersonName || '',
                    RepresentedPersonContactNumber: preData?.RepresentedPersonContactNumber || '',
                    RepresentedEmail: preData?.RepresentedEmail || '',
                    Ratings: preData?.Ratings || '',
                    OpensTime: preData?.OpensTime || '',
                    CloseTime: preData?.CloseTime || '',
                    ContactNumber: preData?.ContactNumber || '',
                    Doctors: preData?.Doctors.map((item) => ({
                        value: item._id,
                        label: item.displayName,
                    })) || [],
                    Services: preData?.Services.map((item) => ({
                        value: item._id,
                        label: item.ServiceName,
                    })) || [],
                    longitude: preData?.longitude || '',
                    latitude: preData?.latitude || '',
                    OfficeNo: preData?.OfficeNo || '',
                    Landmark: preData?.Landmark || '',
                    streetAddress: preData?.streetAddress || '',
                    MapLocation: preData?.MapLocation || '',
                    isSundayOff: preData?.isSundayOff || false,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchDetails()
    }, [id])

    const handleToggle = () => {
        setFormData((prevData) => ({
            ...prevData,
            isSundayOff: !prevData.isSundayOff,
        }));
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/Doctors/get-doctor');
                if (response.data.success) {
                    const formattedDoctors = response.data.data.map((doctor) => ({
                        value: doctor._id,
                        label: doctor.displayName,
                    }));
                    setDoctors(formattedDoctors);
                } else {
                    setError('Failed to fetch doctors');
                }
            } catch (error) {
                setError('An error occurred while fetching doctors.');
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/v1/Doctors/Get-Services');
                if (response.data.success) {
                    const formattedServices = response.data.data.map((service) => ({
                        value: service._id,
                        label: service.ServiceName,
                    }));
                    setServices(formattedServices);
                } else {
                    setError('Failed to fetch services');
                }
            } catch (error) {
                setError('An error occurred while fetching services.');
            }
        };

        fetchServices();
    }, []);





    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`http://localhost:7000/api/v1/Doctors/update-Branch/${id}`, formData);
            toast.success('Branch updated successfully!');
            console.log(response.data);

        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message)
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb heading={'Branch'} subHeading={'Edit Branch'} LastHeading={'Update Branch'} />

            {error && <div className="alert alert-danger">{error}</div>}

            <FormGroups onSubmit={handleSubmit} Elements={
                <div className='row'>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="RepresentedPersonName">Represented Person Name</label>
                        <Input
                            type='text'
                            placeholder='Enter Represented Person Name'
                            name='RepresentedPersonName'
                            value={formData.RepresentedPersonName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="RepresentedPersonContactNumber">Represented Person Contact Number</label>
                        <Input
                            type='tel'
                            placeholder='Enter Contact Number'
                            name='RepresentedPersonContactNumber'
                            value={formData.RepresentedPersonContactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="RepresentedEmail">Represented Email</label>
                        <Input
                            type='email'
                            placeholder='Enter Email'
                            name='RepresentedEmail'
                            value={formData.RepresentedEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="ContactNumber">Contact Number</label>
                        <Input
                            type='tel'
                            placeholder='Enter Contact Number'
                            name='ContactNumber'
                            value={formData.ContactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="Doctors">Doctors</label>
                        <Select
                            isMulti
                            options={doctors}
                            name="Doctors"
                            value={formData.Doctors}
                            onChange={(selected) => setFormData({ ...formData, Doctors: selected })}
                            placeholder="Select Doctors"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="Services">Services</label>
                        <Select
                            isMulti
                            name="Services"
                            options={services}
                            value={formData.Services}
                            onChange={(selected) => setFormData({ ...formData, Services: selected })}
                            placeholder="Select Services"
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="OpensTime">Opening Time</label>
                        <Input
                            type='time'
                            placeholder='Opens Time'
                            name='OpensTime'
                            value={formData.OpensTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="CloseTime">Closing Time</label>
                        <Input
                            type='time'
                            placeholder='Close Time'
                            name='CloseTime'
                            value={formData.CloseTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="Ratings">Ratings</label>
                        <Input
                            type='text'
                            placeholder='Enter Ratings'
                            name='Ratings'
                            value={formData.Ratings}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="OfficeNo">Office No</label>
                        <Input
                            type='text'
                            placeholder='Office Number'
                            name='OfficeNo'
                            value={formData.OfficeNo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="Landmark">Landmark</label>
                        <Input
                            type='text'
                            placeholder='Enter Landmark'
                            name='Landmark'
                            value={formData.Landmark}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="streetAddress">Street Address</label>
                        <Input
                            type='text'
                            placeholder='Street Address'
                            name='streetAddress'
                            value={formData.streetAddress}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="longitude">Longitude</label>
                        <Input
                            type='text'
                            placeholder='Longitude'
                            name='longitude'
                            value={formData.longitude}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="latitude">Latitude</label>
                        <Input
                            type='text'
                            placeholder='Latitude'
                            name='latitude'
                            value={formData.latitude}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="MapLocation">Map Location</label>
                        <Input
                            type='text'
                            placeholder='Map Location'
                            name='MapLocation'
                            value={formData.MapLocation}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>

                            Is Sunday Off
                        </label>
                        <Toggle isActive={formData.isSundayOff} onToggle={handleToggle} />
                    </div>





                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            } />
        </div>
    );
};

export default EditBranch;


