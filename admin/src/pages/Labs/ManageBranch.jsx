import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Table/Table';
import Toggle from '../../components/Forms/toggle';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DoctorsModels from './DoctorsModels';
const ManageBranch = () => {
    const [service, setService] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState({
        doctors: [],
        service: []
    })
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Fetch Branch using Axios
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const { data } = await axios.get('http://localhost:7000/api/v1/Doctors/Get-Branch');
                // console.log(data.data)
                if (data.data) {
                    setService(data.data);
                    console.log(data.data)
                } else {
                    setErrorMsg('Failed to fetch Branch');
                }
            } catch (error) {
                setErrorMsg('An error occurred while fetching Branch.');
            } finally {
                setLoading(false); // Stop loading regardless of success or error
            }
        };

        fetchVouchers();
    }, []);

    const handleOpen = (item, type) => {
        if (type === 'doctor') {
            setSelectedItem({
                doctors: item
            })
            setOpen(true)
        } else if (type === 'service') {
            setSelectedItem({
                service: item
            })
            setOpen(true)
        } else {
            setSelectedItem({})
            setOpen(false)
        }
    }
    const handleClose = () => {
        setOpen(false)
    }

    // Handle deleting a branch
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:7000/api/v1/Doctors/delete-branch/${id}`);

            setService((prevVouchers) => prevVouchers.filter((voucher) => voucher._id !== id));
            toast.success('branch deleted successfully!');

        } catch (error) {
            toast.error('An error occurred while deleting the branch.');
        }
    };

    // Calculate the indices of the branch to display
    const indexOfLastVoucher = currentPage * productsPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - productsPerPage;
    const currentServices = service.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Define headers for the Table component
    const headers = ['S.No', 'PersonName', 'ContactNumber', 'PhoneNumber', 'Images', 'Timing', 'Doctors', 'Services', 'Ratings', 'streetAddress', 'Off day', 'Action'];

    return (
        <div className='page-body'>
            <Breadcrumb heading={'Branches'} subHeading={'Branches'} LastHeading={'All Branches'} />
            {loading ? (
                <div>Loading...</div>
            ) : errorMsg ? (
                <div>{errorMsg}</div>
            ) : (
                <Table
                    headers={headers}
                    elements={currentServices.map((service, index) => (
                        <tr key={service._id}>
                            <td className=''>{index + 1}</td>
                            <td className=''>{service.RepresentedPersonName}</td>
                            <td className=''>{service.RepresentedPersonContactNumber}</td>
                            <td className=''>{service.RepresentedPersonName}</td>
                            <td className=''>{service.OpensTime} - {service.CloseTime}</td>
                            <td className=''>{service.RepresentedPersonName}</td>
                            <td className=''>
                                {service.Doctors.length > 0 ? (
                                    <button onClick={() => handleOpen(service.Doctors, 'doctor')} className="btn btn-danger btn-sm">View 🧑‍⚕️</button>
                                ) : (
                                    'No Doctors'
                                )}
                            </td>
                            <td className='hide'>
                                {service.Services.length > 0 ? (
                                    <button onClick={() => handleOpen(service.Services, 'service')} className="btn btn-sucess shadow btn-sm">View 🧑‍🏭</button>
                                ) : (
                                    'No Services'
                                )}
                            </td>
                            <td className=''>{service.Ratings}</td>
                            <td className=''>{service.streetAddress.substring(0, 20) + (service.streetAddress.length > 20 ? '...' : '')}</td>
                            <td className=''>{service.isSundayOff ? 'Sunday' : 'Always open'}</td>

                            <td className=' hides-wrap'>
                                <div className="product-action">
                                    <Link to={`/branches/edit?id=${service._id}`}>
                                        <svg><use href="../assets/svg/icon-sprite.svg#edit-content"></use></svg>
                                    </Link>
                                    <svg onClick={() => handleDelete(service._id)} style={{ cursor: 'pointer' }}>
                                        <use href="../assets/svg/icon-sprite.svg#trash1"></use>
                                    </svg>
                                </div>
                            </td>
                        </tr>

                    ))}
                    productLength={service.length}
                    productsPerPage={productsPerPage}
                    currentPage={currentPage}
                    paginate={setCurrentPage}
                    href="/branches/create"
                    text="Add Branch"
                    errorMsg=""
                    handleOpen={() => { }}
                />
            )}
            <DoctorsModels isOpen={open} data={selectedItem.doctors || selectedItem.service} OnClose={handleClose} />
        </div>
    )
}

export default ManageBranch
