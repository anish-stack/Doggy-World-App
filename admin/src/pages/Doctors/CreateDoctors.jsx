import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FormGroups from '../../components/Forms/FormGroups';
import Input from '../../components/Forms/Input';
import Select from 'react-select';  // Assuming you're using react-select for dropdowns
import axios from 'axios';
import toast from 'react-hot-toast'
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateDoctors = () => {
    const [formData, setFormData] = useState({

        ProfileImage: [],
        firstName: '',  //
        lastName: '',  //
        displayName: '',
        designation: '',
        phoneNumbers: '',
        emailAddress: '',
        knownLanguages: [],
        speciality:'',
        HigherEduction:'',
        OverAllExperince:'0',
        education: [
            {
                institutionName: '',
                course: '',
                startDate: '',
                endDate: ''
            }
        ],
        experience: [{
            hospitalName: '',
            title: '',
            yearOfExperience: '',
            employment: '',
            jobDescription: '',
            startDate: '',
            endDate: ''
        }],

        // Step 3 inputs
        clinics: [],
        feeStart: '',
        commissionOnPerAppointment: '',


        businessHours: daysOfWeek.map((day) => ({
            day: day,
            startTime: '09:00',
            endTime: ''
        })),

        password: '',
        isBestDoctor: false
    });

    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Preserve form data in session storage when navigating steps
    useEffect(() => {
        const savedFormData = sessionStorage.getItem('doctorFormData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('doctorFormData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'knownLanguages' ? value.split(',').map(lang => lang.trim()) : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        setFormData(prevData => ({
            ...prevData,
            ProfileImage: files
        }));


    };
    const handleEducationChange = (index, e) => {
        const updatedEducation = [...formData.education];
        updatedEducation[index][e.target.name] = e.target.value;
        setFormData({ ...formData, education: updatedEducation });
    };

    const handleExperienceChange = (index, e) => {
        const updatedExperience = [...formData.experience];
        updatedExperience[index][e.target.name] = e.target.value;
        setFormData({ ...formData, experience: updatedExperience });
    };

    const handleBusinessHoursChange = (index, e) => {
        const updatedBusinessHours = [...formData.businessHours];
        updatedBusinessHours[index][e.target.name] = e.target.value;
        setFormData({ ...formData, businessHours: updatedBusinessHours });
    };

    const handleAddEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { institutionName: '', course: '', startDate: '', endDate: '' }]
        });
    };

    const handleRemoveEducation = (index) => {
        const updatedEducation = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: updatedEducation });
    };

    const handleAddExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, { hospitalName: '', title: '', yearOfExperience: '', employment: '', jobDescription: '', startDate: '', endDate: '' }]
        });
    };

    const handleRemoveExperience = (index) => {
        const updatedExperience = formData.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, experience: updatedExperience });
    };

    const validateFields = () => {
        if (!formData.firstName || !formData.lastName || !formData.emailAddress) {
            setError('Please fill out all required={true} fields in Step 1.');
            return false;
        }

        // Check if at least one education entry is filled
        if (formData.education.some((edu) => !edu.institutionName || !edu.course || !edu.startDate || !edu.endDate)) {
            setError('Please complete all education details.');
            return false;
        }

        // Check experience validation
        if (formData.experience.some((exp) => !exp.hospitalName || !exp.title || !exp.startDate || !exp.endDate)) {
            setError('Please complete all experience details.');
            return false;
        }

        // Check for at least one clinic selected and fee entered
        // if (formData.clinics.length === 0 || !formData.feeStart) {
        //     setError('Please select clinics and enter the fee.');
        //     return false;
        // }

        setError('');
        return true;
    };
    const createFormData = () => {
        const Data = new FormData();
        // console.log(formData.ProfileImage)

        Data.append('images', formData?.ProfileImage[0]);



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

        if (!validateFields()) {
            return; // Exit if validation fails
        }

        setLoading(true); // Set loading state to true before the request

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/Doctors/Create-doctor`,
                createFormData(),
                {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                }
            );
            toast.success('Doctor registered successfully!')
            // Handle the response
            if (res.status === 200) {
                setSuccess('Doctor registered successfully!');
                setLoading(false);
             

                setFormData({
                    ProfileImage: [],
                    firstName: '',
                    lastName: '',
                    displayName: '',
                    designation: '',
                    phoneNumbers: '',
                    emailAddress: '',
                    speciality: '',
                    HigherEduction: '',
                    OverAllExperince: '',
                    knownLanguages: [],
                    education: [
                        {
                            institutionName: '',
                            course: '',
                            startDate: '',
                            endDate: ''
                        }
                    ],
                    experience: [
                        {
                            hospitalName: '',
                            title: '',
                            yearOfExperience: '',
                            employment: '',
                            jobDescription: '',
                            startDate: '',
                            endDate: ''
                        }
                    ],
                    clinics: [],
                    feeStart: '',
                    commissionOnPerAppointment: '',
                    businessHours: daysOfWeek.map((day) => ({
                        day: day,
                        startTime: '09:00',
                        endTime: ''
                    })),
                    password: '',
                    isBestDoctor: false
                });
                sessionStorage.removeItem('doctorFormData');
            }
        } catch (error) {
            console.error('Error registering doctor:', error);
            setLoading(false);
            toast.error(error?.response?.data?.message)
            setError(error?.response?.data?.message); // Set error message to show user
        } finally {
            setLoading(false); // Always
        }
    }

    return (
        <div className="page-body">
            <Breadcrumb heading={'Register Doctor'} subHeading={'Register'} LastHeading={'Register Doctor'} />

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger mt-4">{error}</div>}


            <div className="container mt-4">
                <div className="row">
                    {/* Progress Bar */}
                    <div className="col-12">
                        <div className="progress">
                            {Array.from({ length: 3 }, (_, index) => (
                                <div
                                    key={index}
                                    className={`progress-bar ${index < step ? 'bg-primary' : 'bg-danger'}`}
                                    role="progressbar"
                                    style={{
                                        width: `${(100 / 3)}%`,
                                        transition: 'width 0.4s ease-in-out', // Smooth transition
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row text-center mt-2">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div key={index} className="col">
                            <div className={`step-number ${index < step ? 'text-black' : 'text-secondary'}`}>
                                {index + 1}
                            </div>
                            <div className={`step-label ${index < step ? 'text-success' : 'text-secondary'}`}>
                                Step {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <FormGroups onSubmit={handleSubmit} Elements={
                <div className="container">
                    <div className="row justify-content-center">
                        {step === 1 && (
                            <>
                                <div className="col-md-10">
                                    <h3 className="mb-4">Personal Information</h3>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="firstName" className="form-label">First Name</label>
                                            <Input
                                                type="text"
                                                name="firstName"
                                                className="form-control"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter First Name"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="lastName" className="form-label">Last Name</label>
                                            <Input
                                                type="text"
                                                name="lastName"
                                                className="form-control"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter Last Name"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="emailAddress" className="form-label">Email Address</label>
                                            <Input
                                                type="email"
                                                name="emailAddress"
                                                className="form-control"
                                                value={formData.emailAddress}
                                                onChange={handleChange}
                                                placeholder="Enter Email Address"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="phoneNumbers" className="form-label">Phone Number</label>
                                            <Input
                                                type="text"
                                                name="phoneNumbers"
                                                className="form-control"
                                                value={formData.phoneNumbers}
                                                onChange={handleChange}
                                                placeholder="Enter Phone Number"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="designation" className="form-label">Designation</label>
                                            <Input
                                                type="text"
                                                name="designation"
                                                className="form-control"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                placeholder="Enter Designation"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="displayName" className="form-label">Display Name</label>
                                            <Input
                                                type="text"
                                                name="displayName"
                                                className="form-control"
                                                value={formData.displayName}
                                                onChange={handleChange}
                                                placeholder="Enter Your Display Name"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="knownLanguages" className="form-label">known Language</label> <br />
                                            <small className="form-text text-muted">
                                                Please separate multiple languages with commas (e.g., English, Spanish).
                                            </small>
                                            <Input
                                                type="text"
                                                name="knownLanguages"
                                                className="form-control"
                                                value={formData?.knownLanguages?.join(', ') || ''}
                                                onChange={handleChange}
                                                placeholder="Enter Your known Languages"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="HigherEduction" className="form-label">Higher Education</label> <br />
                                           
                                            <Input
                                                type="text"
                                                name="HigherEduction"
                                                className="form-control"
                                                value={formData?.HigherEduction}
                                                onChange={handleChange}
                                                placeholder="eg:DVM,MVDr"
                                                required={true}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="OverAllExperince" className="form-label">Over All Experince</label> <br />
                                     
                                            <Input
                                                type="text"
                                                name="OverAllExperince"
                                                className="form-control"
                                                value={formData?.OverAllExperince}
                                                onChange={handleChange}
                                                placeholder="Enter Your Over All Experince"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="speciality" className="form-label">Enter Your Speciality</label> <br />
                                     
                                            <Input
                                                type="text"
                                                name="speciality"
                                                className="form-control"
                                                value={formData?.speciality}
                                                onChange={handleChange}
                                                placeholder="eg:Veterinary Specialists,Anesthesiology,Dentistry"
                                                required={true}
                                            />
                                        </div>

                                        <div className="col-md-12 mt-4">
                                            <div className="mb-3 mt-4">
                                                <label className="form-label f-w-600 mb-2">Upload Profile Image</label>
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





                                        <div className="col-12 text-end">
                                            <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Next Step</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="col-md-10">
                                    <h3 className="mb-4">Education & Experience</h3>
                                    <h5 className="mb-3">Education</h5>
                                    {formData?.education?.map((edu, index) => (
                                        <div key={index} className="row mb-3">
                                            <div className="col-md-4">
                                                <Input
                                                    type="text"
                                                    name="institutionName"
                                                    className="form-control"
                                                    value={edu.institutionName}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    placeholder="Institution Name"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Input
                                                    type="text"
                                                    name="course"
                                                    className="form-control"
                                                    value={edu.course}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    placeholder="Course"
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <Input
                                                    type="date"
                                                    name="startDate"
                                                    className="form-control"
                                                    value={edu.startDate}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    placeholder="Start Date"
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <Input
                                                    type="date"
                                                    name="endDate"
                                                    className="form-control"
                                                    value={edu.endDate}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    placeholder="End Date"
                                                />
                                            </div>
                                            <div className="col-12 text-end">
                                                <button type="button" className="btn btn-danger" onClick={() => handleRemoveEducation(index)}>Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-secondary mb-4" onClick={handleAddEducation}>Add Education</button>

                                    <h5 className="mb-3">Experience</h5>
                                    {formData?.experience?.map((exp, index) => (
                                        <div key={index} className="row mb-4 align-items-center">
                                            <div className="col-md-4">
                                                <Input
                                                    type="text"
                                                    name="hospitalName"
                                                    className="form-control"
                                                    value={exp.hospitalName}
                                                    onChange={(e) => handleExperienceChange(index, e)}
                                                    placeholder="Hospital Name"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Input
                                                    type="text"
                                                    name="title"
                                                    className="form-control"
                                                    value={exp.title}
                                                    onChange={(e) => handleExperienceChange(index, e)}
                                                    placeholder="Title"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <Input
                                                    type="date"
                                                    name="startDate"
                                                    className="form-control"
                                                    value={exp.startDate}
                                                    onChange={(e) => handleExperienceChange(index, e)}
                                                    placeholder="Start Date"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <Input
                                                    type="date"
                                                    name="endDate"
                                                    className="form-control"
                                                    value={exp.endDate}
                                                    onChange={(e) => handleExperienceChange(index, e)}
                                                    placeholder="End Date"
                                                    required
                                                />
                                            </div>
                                            <br />
                                            <div className='mt-4 row'>
                                                <div className="col-md-4">
                                                    <Input
                                                        type="number"
                                                        name="yearOfExperience"
                                                        className="form-control"
                                                        value={exp.yearOfExperience}
                                                        onChange={(e) => handleExperienceChange(index, e)}
                                                        placeholder="Years of Experience"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <textarea
                                                        name="jobDescription"
                                                        className="form-control"
                                                        value={exp.jobDescription}
                                                        onChange={(e) => handleExperienceChange(index, e)}
                                                        placeholder="Job Description"
                                                        rows="2"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <select
                                                        onChange={(e) => handleExperienceChange(index, e)}
                                                        value={exp.employment}
                                                        name="employment"
                                                        className="form-select"
                                                    >
                                                        <option value="">--- Select Employment Type ---</option>
                                                        <option value="Part">Part Time</option>
                                                        <option value="Full">Full Time</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-12 text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger mt-2"
                                                    onClick={() => handleRemoveExperience(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" className="btn btn-secondary mb-4" onClick={handleAddExperience}>Add Experience</button>
                                    <div className='mt-2 d-flex align-item-center justify-content-between'>
                                        <div className="text-start">
                                            <button type="button" className="btn btn-danger" onClick={() => setStep(1)}>Back Step</button>
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Next Step</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="col-md-8">
                                    <h3 className="mb-4">Clinics & Business Hours</h3>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="clinics" className="form-label">Clinics</label>
                                            <Select
                                                isMulti
                                                name="clinics"
                                                className="form-select"
                                                value={formData.clinics}
                                                onChange={(selected) => setFormData({ ...formData, clinics: selected })}
                                                placeholder="Select Clinics"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="feeStart" className="form-label">Starting Fee</label>
                                            <Input
                                                type="text"
                                                name="feeStart"
                                                className="form-control"
                                                value={formData.feeStart}
                                                onChange={handleChange}
                                                placeholder="Enter Starting Fee"
                                                required={true}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="commissionOnPerAppointment" className="form-label">Commission (%)</label>
                                            <Input
                                                type="number"
                                                name="commissionOnPerAppointment"
                                                className="form-control"
                                                value={formData.commissionOnPerAppointment}
                                                onChange={handleChange}
                                                placeholder="Commission Percentage"
                                                required={true}
                                            />
                                        </div>
                                    </div>

                                    <h4 className="mb-3">Business Hours</h4>
                                    {formData?.businessHours?.map((day, index) => (
                                        <div key={index} className="row mb-2">
                                            <div className="col-md-4">
                                                <label className="form-label">{day.day}</label>
                                            </div>
                                            <div className="col-md-4">
                                                <Input
                                                    type="time"
                                                    name="startTime"
                                                    className="form-control"
                                                    value={day.startTime}
                                                    onChange={(e) => handleBusinessHoursChange(index, e)}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Input
                                                    type="time"
                                                    name="endTime"
                                                    className="form-control"
                                                    value={day.endTime}
                                                    onChange={(e) => handleBusinessHoursChange(index, e)}
                                                />
                                            </div>
                                        </div>
                                    ))}


                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="commissionOnPerAppointment" className="form-label">Password </label>
                                        <Input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Strong Password"
                                            required={true}
                                        />
                                    </div>

                                    <div className='d-flex align-item-center justify-content-between'>
                                        <div className="text-start">
                                            <button type="button" className="btn btn-danger" onClick={() => setStep(2)}>Back Step</button>
                                        </div>
                                        <div className="text-end">
                                            <button disabled={loading} type="submit" className="btn btn-success">{loading ? 'Please Wait' : 'Submit'}</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            } />
        </div>

    );
};

export default CreateDoctors;
