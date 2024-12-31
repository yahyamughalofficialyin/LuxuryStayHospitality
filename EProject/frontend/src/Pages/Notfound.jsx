import {React} from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
    return (
        <div class="row flex-center min-vh-100 py-6 text-center">
            <div class="col-sm-10 col-md-8 col-lg-6 col-xxl-5"><Link class="d-flex flex-center mb-4" to="/" ><img class="me-2" src="assets/img/hotel.svg" alt="" width="158" /></Link>
                <div class="card">
                    <div class="card-body p-4 p-sm-5">
                        <div class="fw-black lh-1 text-300 fs-error">404</div>
                        <p class="lead mt-4 text-800 font-sans-serif fw-semi-bold w-md-75 w-xl-100 mx-auto">The page you're looking for is not found.</p>
                        <hr />
                        <p>Make sure the address is correct and that the page hasn't moved. If you think this is a mistake, <a href="mailto:info@shaheencodecrafters.com">contact us</a>.</p><Link class="btn btn-primary btn-sm mt-3" to="/" ><span class="fas fa-home me-2"></span>Take me home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notfound