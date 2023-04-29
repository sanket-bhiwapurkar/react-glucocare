import "./index.css";

const EmptyView = (props) => {
  const { msg } = props;
  return (
    <div className="empty-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="All Empty Here"
        className="empty-image"
      />
      <p className="empty-msg">{msg}</p>
    </div>
  );
};
export default EmptyView;
