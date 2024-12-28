import React from 'react'

const Booking = () => {
    return (
        <>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="mb-4 col-md-6 col-lg-4">
                            <div class="border rounded-1 h-100 d-flex flex-column justify-content-between pb-3">
                                <div class="overflow-hidden">
                                    <div class="position-relative rounded-top overflow-hidden"><a class="d-block" href="product-details.html"><img class="img-fluid rounded-top" src="../../../assets/img/products/2.jpg" alt="" /></a><span class="badge rounded-pill bg-success position-absolute mt-2 me-2 z-2 top-0 end-0">New</span></div>
                                    <div class="p-3">
                                        <h5 class="fs-9"><a class="text-1100" href="product-details.html">Room No. 201</a></h5>
                                        <p class="fs-10 mb-3"><a class="text-500" href="#!">Room Type</a></p>
                                        <h5 class="fs-md-7 text-warning mb-0 d-flex align-items-center mb-3">$2399</h5>
                                        <p class="fs-10 mb-1">Half Day: <strong>$50</strong></p>
                                        <p class="fs-10 mb-1">Status: <strong class="text-success">Available</strong></p>
                                    </div>
                                </div>
                                <div class="d-flex flex-between-center px-3">
                                    <div><span class="fa fa-star text-warning"></span><span class="fa fa-star text-warning"></span><span class="fa fa-star text-warning"></span><span class="fa fa-star text-warning"></span><span class="fa fa-star text-300"></span><span class="ms-1">(8)</span></div>
                                    <div><a class="btn btn-sm btn-falcon-default me-2" href="#!" data-bs-toggle="tooltip" data-bs-placement="top" title="Add to Wish List"><span class="far fa-heart"></span></a><a class="btn btn-sm btn-falcon-default" href="#!" data-bs-toggle="tooltip" data-bs-placement="top" title="Add to Cart"><span class="fas fa-cart-plus"></span></a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Booking