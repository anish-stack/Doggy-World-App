import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import axios from 'axios';
import Select from 'react-select';
import toast from 'react-hot-toast';
import Toggle from '../../components/Forms/toggle';

const CreateLabs = () => {
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
    isSundayOff: false,
    Images: []
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


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log(files)
    setFormData(prevData => ({
      ...prevData,
      Images: files || [files]
    }));


  };
  const createFormData = () => {
    const Data = new FormData();

    formData.Images.forEach((item) => {
      Data.append('images', item);
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        Data.append(key, JSON.stringify(value));
      } else {
        Data.append(key, value);
      }
    });

    return Data;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:7000/api/v1/Doctors/Create-Branch', createFormData(), {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      });
      toast.success('Branch created successfully!');
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
      <Breadcrumb heading={'Branch'} subHeading={'Branch'} LastHeading={'Create Branch'} />

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
          <div className="col-md-12 mt-4">
            <div className="mb-3 mt-4">
              <label className="form-label f-w-600 mb-2">Upload Branch  Images</label>
              <div className="dropzone card" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                <div className="dz-message needsclick text-center p-4">
                  <i className="fa-solid fa-cloud-arrow-up mb-3"></i>
                  <h6>Drop files here or click to upload.</h6>
                  <span className="note needsclick">(Supported formats: JPG, PNG)</span>
                </div>
              </div>
              <input
                type="file"
                id="fileInput"
                multiple
                className="form-control"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>


          {/* {imagePreviews.length > 0 && (
            <div className="col-md-2 mb-3">
              <h5>Image Previews:</h5>
              {imagePreviews.map((img, index) => (
                <img key={index} src={img} alt={`preview ${index}`} className='img-preview' />
              ))}
            </div>
          )} */}



          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      } />
    </div>
  );
};

export default CreateLabs;
