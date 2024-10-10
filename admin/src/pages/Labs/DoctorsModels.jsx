import React from 'react';
import s from './s.webp'

const DoctorsModels = ({ isOpen, OnClose, data }) => {
  console.log(data);

  // Check if any doctor has a displayName
  const hasDisplayName = Array.isArray(data) && data.some(item => item?.displayName);



  return (
    <>
      {/* Modal */}
      <div
        className={`modal fade ${isOpen ? 'show' : ''}`}
        style={{ display: isOpen ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="doctorsModalLabel"
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="doctorsModalLabel"></h5>
              <button type="button" className="close btn-sm btn-danger rounded-pill" onClick={OnClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {hasDisplayName ? (
                <div className="row">
                  {data.map((item, index) => item?.displayName && (
                    <div className="col-sm-6 col-md-4 mb-3" key={index}>
                      <div className="card text-black border-secondary" style={{ height: 'auto' }}>
                        <img
                          src={item.ProfileImage?.url || s}
                          className="img-fluid"
                          alt={item.displayName}
                          style={{ height: '150px', objectFit: 'cover', borderRadius: '25px' }}
                        />

                        <div className="card-body">
                          <h6 className="card-title text-center">{item.displayName}</h6>
                          <div className="row">
                            <div className="col-6">
                              <p className="card-text hide small">Designation:</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">{item.designation}</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">Phone:</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">{item.phoneNumbers}</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">Email:</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">{item.emailAddress}</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">Experience:</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">{item.experience[0]?.yearOfExperience} years</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">Languages:</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">{item.knownLanguages.join(', ')}</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text hide small">Fee Start:</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text small">₹{item.feeStart}</p>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="container-fluid">
                  <div className="row">
                    {Array.isArray(data) && data.length > 0 ? (
                      data.map((service, index) => (
                        <div key={index} className="col-md-4 mb-3"> {/* Each card will take 3 columns (out of 12) on medium screens */}
                          <div className="card shadow-sm">
                            <div className="row ">

                              <img
                                src={service.Images[0].url}
                                className="img-fluid rounded-start"
                                alt={service.ServiceName}
                                style={{ height: '200px', objectFit: 'cover' }}
                              />

                              <div className="col-md-12">
                                <div className="card-body">
                                  <h5 className="card-title text-sm">{service.ServiceName}</h5>
                                  {/* <p className="card-text text-sm">{service.Para}</p> */}
                                  <p className="card-text text-muted text-sm">
                                    Price: <span className="text-danger">{service.Price} </span>
                                    <br />
                                    Discount Price: <span className="text-success">{service.DiscountPrice} </span>
                                    <br />
                                    Discount: <span className="text-warning">{service.DiscountPercentage}%</span>
                                  </p>
                                  <h6 className="text-sm">Specialties:</h6>
                                  <ul className="list-group list-group-flush">
                                    {service.ServiceSpecilatity.length > 5 ? (
                                      <>
                                        {service.ServiceSpecilatity.slice(0, 5).map((specialty, index) => (
                                          <li key={index} className="list-group-item hide">
                                            <span className="text-primary me-2">✅</span>
                                            <small className='hide'>{specialty}</small>
                                          </li>
                                        ))}
                                        <li className="list-group-item">
                                          <span className="text-primary me-2">...</span>
                                          <small>
                                            <a href="#" className="text-decoration-none text-primary" >
                                              more specialties
                                            </a>
                                          </small>
                                        </li>
                                      </>
                                    ) : (
                                      service.ServiceSpecilatity.map((specialty, index) => (
                                        <li key={index} className="list-group-item">
                                          <span className="text-primary me-2">✅</span>
                                          <small className='hide'>{specialty}</small>
                                        </li>
                                      ))
                                    )}
                                  </ul>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="alert alert-warning" role="alert">
                        No  information available.
                      </div>
                    )}
                  </div>
                </div>

              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={OnClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default DoctorsModels;
