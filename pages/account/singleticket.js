import SignOut from "../../component/SignOut";
import withAuth from "../../component/withAuth";
import Head from "next/head";

const SingleTicket = () => {
  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | Single Ticket</title>
      </Head>
      <section className="col-lg-8">
        <div className="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-4">
          <div className="d-flex w-100 text-light text-center mr-3">
            <div className="font-size-ms px-3">
              <div className="font-weight-medium">Date Submitted</div>
              <div className="opacity-60">09/27/2019</div>
            </div>
            <div className="font-size-ms px-3">
              <div className="font-weight-medium">Last Updated</div>
              <div className="opacity-60">09/30/2019</div>
            </div>
            <div className="font-size-ms px-3">
              <div className="font-weight-medium">Type</div>
              <div className="opacity-60">Website problem</div>
            </div>
            <div className="font-size-ms px-3">
              <div className="font-weight-medium">Priority</div>
              <span className="badge badge-warning">High</span>
            </div>
            <div className="font-size-ms px-3">
              <div className="font-weight-medium">Status</div>
              <span className="badge badge-success">Open</span>
            </div>
          </div>
          <SignOut label="Sign Out" />
        </div>
        <div className="d-flex d-lg-none flex-wrap bg-secondary text-center rounded-lg pt-4 px-4 pb-1 mb-4">
          <div className="font-size-sm px-3 pb-3">
            <div className="font-weight-medium">Date Submitted</div>
            <div className="text-muted">09/27/2019</div>
          </div>
          <div className="font-size-sm px-3 pb-3">
            <div className="font-weight-medium">Last Updated</div>
            <div className="text-muted">09/30/2019</div>
          </div>
          <div className="font-size-sm px-3 pb-3">
            <div className="font-weight-medium">Type</div>
            <div className="text-muted">Website problem</div>
          </div>
          <div className="font-size-sm px-3 pb-3">
            <div className="font-weight-medium">Priority</div>
            <span className="badge badge-warning">High</span>
          </div>
          <div className="font-size-sm px-3 pb-3">
            <div className="font-weight-medium">Status</div>
            <span className="badge badge-success">Open</span>
          </div>
        </div>
        7
        <div className="media pb-4 border-bottom">
          <img
            className="rounded-circle"
            width={50}
            src="/img/testimonials/03.jpg"
            alt="Michael Davis"
          />
          <div className="media-body pl-3">
            <h6 className="font-size-md mb-2">Michael Davis</h6>
            <p className="font-size-md mb-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat cupidatat non proident, sunt in
              culpa qui.
            </p>
            <span className="font-size-ms text-muted">
              <i className="czi-time align-middle mr-2" />
              Sep 30, 2019 at 11:05AM
            </span>
          </div>
        </div>
        <div className="media py-4 border-bottom">
          <img
            className="rounded-circle"
            width={50}
            src="/img/testimonials/03.jpg"
            alt="Michael Davis"
          />
          <div className="media-body pl-3">
            <h6 className="font-size-md mb-2">Michael Davis</h6>
            <p className="font-size-md mb-1">
              Sed elementum tempus egestas sed sed. Aliquam faucibus purus in
              massa tempor nec feugiat. Interdum varius sit amet mattis. Magna ac
              placerat vestibulum lectus mauris. Magna fringilla urna porttitor
              rhoncus dolor purus non. Urna et pharetra pharetra massa massa
              ultricies mi quis.
            </p>
            <span className="font-size-ms text-muted">
              <i className="czi-time align-middle mr-2" />
              Sep 28, 2019 at 10:00AM
            </span>
            <div className="media border-top pt-4 mt-4">
              <img
                className="rounded-circle"
                width={50}
                src="/img/testimonials/04.jpg"
                alt="Susan Gardner"
              />
              <div className="media-body pl-3">
                <h6 className="font-size-md mb-2">Susan Gardner</h6>
                <p className="font-size-md mb-1">
                  Egestas sed sed risus pretium quam vulputate dignissim. A diam
                  sollicitudin tempor id eu nisl. Ut porttitor leo a diam.
                  Bibendum at varius vel pharetra vel turpis nunc.
                </p>
                <span className="font-size-ms text-muted">
                  <i className="czi-time align-middle mr-2" />
                  Sep 27, 2019 at 6:30PM
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Leave message*/}
        <h3 className="h5 mt-2 pt-4 pb-2">Leave a Message</h3>
        <form className="needs-validation" noValidate>
          <div className="form-group">
            <textarea
              className="form-control"
              rows={8}
              placeholder="Write your message here..."
              required
              defaultValue={""}
            />
            <div className="invalid-tooltip">Please write the message!</div>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="custom-control custom-checkbox d-block">
              <input
                className="custom-control-input"
                type="checkbox"
                id="close-ticket"
              />
              <label className="custom-control-label" htmlFor="close-ticket">
                Submit and close the ticket
              </label>
            </div>
            <button className="btn btn-primary my-2" type="submit">
              Submit message
            </button>
          </div>
        </form>
      </section>
    </>
  );
};
export default withAuth(SingleTicket);
