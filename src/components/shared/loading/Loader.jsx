import "./loader.css";

const Loader = () => {
  return (
    <div className="loader flex justify-center items-center w-100 h-100">
      <div className="cssload-container">
        <div className="cssload-loading">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
    </div>
  );
};

export default Loader;
